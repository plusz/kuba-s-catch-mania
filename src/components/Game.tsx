import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Direction, FallingObject, GameCharacter } from '@/lib/gameTypes';
import {
  trySpawnObject,
  getTickInterval,
  getLevel,
  resetIdCounter,
  CATCH_STEP,
} from '@/lib/gameEngine';
import {
  buildLanes,
  objectBasePx,
  useViewportSize,
  VISUAL_SUBSTEPS,
  CATCH_ANIM_MS,
  renderStepFor,
} from '@/lib/layout';
import { beginPlay, endPlay } from '@/lib/playTime';
import { useGameControls } from '@/lib/controls';
import { useIsMobile } from '@/hooks/use-mobile';
import { playCatchSound, playMissSound, playStepSound, playDropSound } from '@/lib/audio';
import { trackGameOver } from '@/lib/analytics';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import CharacterSprite from './CharacterSprite';
import FallingItem from './FallingItem';
import DyingItem, { type DyingEntry } from './DyingItem';
import GameHud from './GameHud';
import GameOverModal from './GameOverModal';
import gameBackground from '@/assets/game_background.png';
import mobileBackground from '@/assets/mobile_background.png';

interface GameProps {
  character: GameCharacter;
  onMenu: () => void;
  onNewGame: () => void;
}

const STORAGE_KEY = 'catch-game-best-score';

/**
 * HOW CATCHING WORKS (discrete step system, parity with Android/iOS spec):
 *
 * 1. Objects move in discrete steps (0 to 6), one engine step per "tick".
 *    The view snaps each step through 2 sub-hops via a frame clock.
 * 2. Tick interval starts at 1000ms and speeds up to 100ms (10/sec).
 * 3. Objects fly in from off-screen along a lane ending at the character's paw.
 * 4. When an object reaches step CATCH_STEP (6), a matching pose catches it.
 *    Otherwise it gets a grace tick (pendingMiss) sitting at the paw — a press
 *    can still rescue it (press catches any object at step >= CATCH_STEP - 1).
 *    Uncaught after the grace tick → miss → game over.
 * 5. Caught/missed objects leave the list instantly and finish with a short
 *    animation (fly-to-paw / spilled-at-paw), like the Android dying list.
 * 6. Objects never spawn while another is in the first steps of its lane, so
 *    arrivals always have a reaction gap (MIN_ARRIVAL_GAP_STEPS=3).
 */
const Game = ({ character, onMenu, onNewGame }: GameProps) => {
  const isMobile = useIsMobile();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPose, setCurrentPose] = useState<Direction | null>('top-left');
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [dying, setDying] = useState<DyingEntry[]>([]);
  const [shaking, setShaking] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [now, setNow] = useState(0);
  const [debugLines, setDebugLines] = useState<string[]>([]);

  const scoreRef = useRef(0);
  const objectsRef = useRef<FallingObject[]>([]);
  const poseRef = useRef<Direction | null>(null);
  const gameOverRef = useRef(false);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ticksSinceSpawnRef = useRef(0);
  const tickCountRef = useRef(0);
  /** performance.now() of the last engine tick — drives inter-tick sub-hops */
  const lastTickRef = useRef(0);
  const lastHopRef = useRef(-1);

  useEffect(() => { objectsRef.current = objects; }, [objects]);
  useEffect(() => { poseRef.current = currentPose; }, [currentPose]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const level = getLevel(score);
  const intervalMs = getTickInterval(level);
  const { musicEnabled, toggleMusic } = useBackgroundMusic(!gameOver && !hidden);

  const { vw, vh } = useViewportSize();
  const lanes = useMemo(
    () => buildLanes(isMobile, character.spriteScale ?? 1, vw, vh),
    [isMobile, character.spriteScale, vw, vh]
  );
  const objBase = objectBasePx(isMobile, character.objectScale ?? 1);

  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (gameOver && score > bestScore) {
      setBestScore(score);
      localStorage.setItem(STORAGE_KEY, score.toString());
    }
  }, [gameOver, score, bestScore]);

  const appendDebug = useCallback((line: string) => {
    setDebugLines((prev) => [...prev.slice(-10), line]);
  }, []);

  /** Queue a short catch/miss animation for an object leaving the list. */
  const pushDying = useCallback((obj: FallingObject, missed: boolean) => {
    // start the animation from the object's actual visual position, not its
    // engine step — otherwise a press-catch teleports the piece forward
    const interval = getTickInterval(getLevel(scoreRef.current));
    const f = lastTickRef.current > 0
      ? Math.min(1, Math.max(0, (performance.now() - lastTickRef.current) / interval))
      : 0;
    const entry: DyingEntry = {
      id: `d-${obj.id}-${missed ? 'm' : 'c'}`,
      direction: obj.direction,
      step: obj.step,
      renderStep: missed ? CATCH_STEP : renderStepFor(obj.step, obj.pendingMiss, f),
      missed,
      startMs: performance.now(),
    };
    setDying((prev) => [...prev, entry]);
    setTimeout(() => {
      setDying((prev) => prev.filter((d) => d.id !== entry.id));
    }, CATCH_ANIM_MS + 60);
  }, []);

  // Handle direction input — pose change + rescue catch near the paw
  const handleDirection = useCallback((dir: Direction) => {
    if (gameOverRef.current) return;
    setCurrentPose(dir);
    poseRef.current = dir; // sync immediately for doTick
    const currentObjects = objectsRef.current;
    const catchable = currentObjects.find(
      (obj) => !obj.caught && obj.direction === dir && obj.step >= CATCH_STEP - 1
    );

    appendDebug(
      `INPUT dir=${dir} pose=${dir} objs=${currentObjects
        .map((o) => `${o.direction}@${o.step}${o.pendingMiss ? '!' : ''}`)
        .join(',') || 'none'} catch=${catchable ? `${catchable.direction}@${catchable.step}` : 'none'}`
    );

    if (catchable) {
      playCatchSound();
      const updated = currentObjects.filter((o) => o.id !== catchable.id);
      objectsRef.current = updated;
      setObjects(updated);
      setScore((prev) => prev + 1);
      pushDying(catchable, false);
      appendDebug(`CAUGHT dir=${dir} step=${catchable.step}`);
    }
  }, [appendDebug, pushDying]);

  useGameControls(handleDirection, !gameOver);

  /** One engine tick: advance objects, resolve paw arrivals (catch/grace/miss), maybe spawn */
  const doTick = useCallback(() => {
    if (gameOverRef.current) return;

    tickCountRef.current++;
    lastTickRef.current = performance.now();

    const prev = objectsRef.current;
    const caughtNow: FallingObject[] = [];
    let missedObj: FallingObject | null = null;
    const updated: FallingObject[] = [];

    for (const obj of prev) {
      if (obj.caught) continue;
      if (obj.step >= CATCH_STEP) {
        // object is at the paw: matching pose catches, pendingMiss misses,
        // otherwise it gets one grace tick at the paw
        if (poseRef.current && obj.direction === poseRef.current) {
          caughtNow.push(obj);
        } else if (obj.pendingMiss) {
          missedObj = obj;
        } else {
          updated.push({ ...obj, pendingMiss: true });
        }
        continue;
      }
      updated.push({ ...obj, step: obj.step + 1 });
    }

    objectsRef.current = updated;
    setObjects(updated);

    appendDebug(
      `TICK pose=${poseRef.current ?? 'none'} objs=${updated
        .map((o) => `${o.direction}@${o.step}${o.pendingMiss ? '!' : ''}`)
        .join(',') || 'none'}`
    );

    if (caughtNow.length > 0) {
      playCatchSound();
      setScore((s) => s + caughtNow.length);
      caughtNow.forEach((o) => pushDying(o, false));
      appendDebug(`AUTO-CAUGHT count=${caughtNow.length} pose=${poseRef.current}`);
    }

    if (missedObj) {
      pushDying(missedObj, true);
      playMissSound();
      setShaking(true);
      setTimeout(() => setShaking(false), 300);
      gameOverRef.current = true;
      setGameOver(true);
      trackGameOver(scoreRef.current, getLevel(scoreRef.current));
      appendDebug('MISS -> game over');
      return;
    }

    // Try to spawn a new object every few ticks
    ticksSinceSpawnRef.current++;
    if (ticksSinceSpawnRef.current >= 3) {
      const newObj = trySpawnObject(objectsRef.current);
      if (newObj) {
        const withNew = [...objectsRef.current, newObj];
        objectsRef.current = withNew;
        setObjects(withNew);
        ticksSinceSpawnRef.current = 0;
        playDropSound();
        appendDebug(`SPAWN ${newObj.direction}@${newObj.step}`);
      }
    }
  }, [appendDebug, pushDying]);

  /** Start or restart the tick interval */
  const startTickLoop = useCallback(() => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    tickIntervalRef.current = setInterval(doTick, getTickInterval(getLevel(scoreRef.current)));
  }, [doTick]);

  // Adjust tick speed when level changes; pause engine while tab is hidden
  useEffect(() => {
    if (gameOver || hidden) {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      return;
    }
    startTickLoop();
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, [level, gameOver, hidden, startTickLoop]);

  // Freeze the round when the tab is hidden (engine + music); resume cleanly
  useEffect(() => {
    const onVisibility = () => {
      const h = document.hidden;
      setHidden(h);
      if (!h) lastTickRef.current = performance.now();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Frame clock — drives inter-tick hops and catch/miss animations.
  // Only runs while something is animated (Android: same optimization).
  const animActive = objects.length > 0 || dying.length > 0;
  useEffect(() => {
    if (!animActive) return;
    let raf: number;
    const loop = (t: number) => {
      setNow(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animActive]);

  const frac =
    lastTickRef.current > 0
      ? Math.min(1, Math.max(0, (now - lastTickRef.current) / intervalMs))
      : 0;

  // One blip per visible hop — all objects share frac, so they hop in sync.
  // Silent when nothing is falling (sound is per-hop, not per-second).
  const hop = tickCountRef.current * VISUAL_SUBSTEPS + Math.floor(frac * VISUAL_SUBSTEPS);
  useEffect(() => {
    if (lastHopRef.current >= 0 && hop > lastHopRef.current && objects.length > 0) {
      playStepSound();
    }
    lastHopRef.current = hop;
  }, [hop, objects.length]);

  // Play-time accounting: the counter only runs during an active round
  useEffect(() => {
    beginPlay();
    return () => endPlay();
  }, []);
  useEffect(() => {
    if (gameOver) endPlay();
  }, [gameOver]);

  // Initial setup
  useEffect(() => {
    resetIdCounter();
    ticksSinceSpawnRef.current = 10; // spawn immediately on first tick
  }, []);

  const objectEmoji = character.objectEmoji;
  const backgroundImage = isMobile
    ? (character.mobileBackground ?? character.background ?? mobileBackground)
    : (character.background ?? gameBackground);

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${shaking ? 'animate-shake' : ''}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: character.backgroundPosition ?? 'center',
      }}
    >
      <GameHud score={score} level={level} currentPose={currentPose} musicEnabled={musicEnabled} onToggleMusic={toggleMusic} />

      <div className="absolute z-10" style={{ left: '50%', top: isMobile ? '58%' : '65%', transform: 'translate(-50%, -50%)' }}>
        <CharacterSprite character={character} pose={currentPose} />
      </div>

      {objects.map((obj) => (
        <FallingItem
          key={obj.id}
          object={obj}
          lane={lanes[obj.direction]}
          frac={frac}
          baseSize={objBase}
          emoji={objectEmoji}
          objectImage={character.objectImage}
          objectImageStages={character.objectImageStages}
          missedImage={character.missedImage}
        />
      ))}

      {dying.map((d) => (
        <DyingItem
          key={d.id}
          item={d}
          lane={lanes[d.direction]}
          baseSize={objBase}
          now={now}
          emoji={objectEmoji}
          objectImage={character.objectImage}
          objectImageStages={character.objectImageStages}
          missedImage={character.missedImage}
        />
      ))}

      {new URLSearchParams(window.location.search).has('debug') && (
        <div className="absolute left-2 bottom-2 z-30 max-w-[92vw] rounded-md border border-border bg-card/85 p-2 text-xs text-card-foreground">
          <div className="font-semibold">DEBUG CATCH</div>
          <div>pose: {currentPose ?? 'none'} | press catches step ≥ {CATCH_STEP - 1}, pose catches at {CATCH_STEP}</div>
          {debugLines.length === 0 ? (
            <div>brak logów…</div>
          ) : (
            <div className="mt-1 max-h-36 overflow-auto space-y-0.5">
              {debugLines.map((line, idx) => (
                <div key={`${idx}-${line}`}>{line}</div>
              ))}
            </div>
          )}
        </div>
      )}
      {gameOver && (
        <GameOverModal
          score={score}
          bestScore={bestScore}
          onPlayAgain={onNewGame}
          onMenu={onMenu}
        />
      )}
    </div>
  );
};

export default Game;
