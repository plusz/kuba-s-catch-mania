import { useState, useEffect, useRef, useCallback } from 'react';
import type { Direction, FallingObject, GameCharacter } from '@/lib/gameTypes';
import {
  trySpawnObject,
  getTickInterval,
  getLevel,
  resetIdCounter,
  CATCH_STEP,
} from '@/lib/gameEngine';
import { useGameControls } from '@/lib/controls';
import { useIsMobile } from '@/hooks/use-mobile';
import { playCatchSound, playMissSound, playStepSound } from '@/lib/audio';
import { trackGameOver } from '@/lib/analytics';
import CharacterSprite from './CharacterSprite';
import FallingItem from './FallingItem';
import GameHud from './GameHud';
import GameOverModal from './GameOverModal';
import gameBackground from '@/assets/game_background.png';
import mobileBackground from '@/assets/mobile_background.png';

interface GameProps {
  character: GameCharacter;
  onMenu: () => void;
}

const STORAGE_KEY = 'catch-game-best-score';

/**
 * HOW CATCHING WORKS (discrete step system):
 * 
 * 1. Objects move in discrete steps (0 to 7), one step per "tick".
 * 2. Tick interval starts at 1000ms (1/sec) and speeds up to 100ms (10/sec).
 * 3. When an object reaches step CATCH_STEP (7), it's at ramp end (catch zone).
 * 4. The player must press the matching direction key (A/Z/L/M) while the
 *    object is at step 7. The key press checks objects at step 7 for that direction.
 * 5. If an object at step 7 is NOT caught by the next tick, it misses and game ends.
 * 6. Objects are never spawned if they'd arrive at the catch zone too close
 *    to another object (MIN_ARRIVAL_GAP_STEPS=3), so the player always has
 *    time to react between catches.
 */
const Game = ({ character, onMenu }: GameProps) => {
  const isMobile = useIsMobile();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPose, setCurrentPose] = useState<Direction | null>(null);
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [shaking, setShaking] = useState(false);
  const [debugLines, setDebugLines] = useState<string[]>([]);

  const scoreRef = useRef(0);
  const objectsRef = useRef<FallingObject[]>([]);
  const poseRef = useRef<Direction | null>(null);
  const gameOverRef = useRef(false);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ticksSinceSpawnRef = useRef(0);

  useEffect(() => { objectsRef.current = objects; }, [objects]);
  useEffect(() => { poseRef.current = currentPose; }, [currentPose]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const level = getLevel(score);

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

  // Handle direction input — check for catchable objects near ramp end
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
        .map((o) => `${o.direction}@${o.step}`)
        .join(',') || 'none'} catch=${catchable ? `${catchable.direction}@${catchable.step}` : 'none'}`
    );

    if (catchable) {
      playCatchSound();
      setObjects((prev) => {
        const updated = prev.filter((o) => o.id !== catchable.id);
        objectsRef.current = updated;
        return updated;
      });
      setScore((prev) => prev + 1);
      appendDebug(`CAUGHT dir=${dir} step=${catchable.step}`);
    }
  }, [appendDebug]);

  useGameControls(handleDirection, !gameOver);

  /** One game tick: advance all objects by 1 step, auto-catch by current pose, check misses, maybe spawn */
  const doTick = useCallback(() => {
    if (gameOverRef.current) return;

    let missed = false;
    let caughtByPoseCount = 0;
    let updatedSnapshot: FallingObject[] = [];

    setObjects((prev) => {
      const updated = prev
        .map((obj) => {
          if (obj.caught) return obj;

          const poseCatch =
            !!poseRef.current &&
            obj.direction === poseRef.current &&
            obj.step >= CATCH_STEP - 1;

          if (poseCatch) {
            caughtByPoseCount++;
            return null;
          }

          const newStep = obj.step + 1;
          if (newStep > CATCH_STEP) {
            missed = true;
            return { ...obj, step: CATCH_STEP };
          }

          return { ...obj, step: newStep };
        })
        .filter((obj): obj is FallingObject => obj !== null && !obj.caught);

      updatedSnapshot = updated;
      objectsRef.current = updated;

      if (missed) {
        playMissSound();
        setShaking(true);
        setTimeout(() => setShaking(false), 300);
        setGameOver(true);
        trackGameOver(scoreRef.current, getLevel(scoreRef.current));
        return updated;
      }

      return updated;
    });

    if (caughtByPoseCount > 0) {
      playCatchSound();
      setScore((prev) => prev + caughtByPoseCount);
      appendDebug(`AUTO-CAUGHT count=${caughtByPoseCount} pose=${poseRef.current}`);
    }

    appendDebug(
      `TICK pose=${poseRef.current ?? 'none'} objs=${updatedSnapshot
        .map((o) => `${o.direction}@${o.step}${o.direction === poseRef.current && o.step >= CATCH_STEP - 1 ? '[match]' : ''}`)
        .join(',') || 'none'}`
    );

    if (missed) {
      appendDebug('MISS -> game over');
      return;
    }

    // Play step sound for each tick (audible rhythm)
    playStepSound();

    // Try to spawn a new object every few ticks
    ticksSinceSpawnRef.current++;
    if (ticksSinceSpawnRef.current >= 3) {
      const newObj = trySpawnObject(objectsRef.current);
      if (newObj) {
        setObjects((prev) => [...prev, newObj]);
        ticksSinceSpawnRef.current = 0;
        appendDebug(`SPAWN ${newObj.direction}@${newObj.step}`);
      }
    }
  }, [appendDebug]);

  /** Start or restart the tick interval */
  const startTickLoop = useCallback(() => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    const currentLevel = getLevel(scoreRef.current);
    const interval = getTickInterval(currentLevel);

    tickIntervalRef.current = setInterval(() => {
      doTick();
    }, interval);
  }, [doTick]);

  // Adjust tick speed when level changes
  useEffect(() => {
    if (gameOver) {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      return;
    }
    startTickLoop();
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, [level, gameOver, startTickLoop]);

  // Initial setup
  useEffect(() => {
    resetIdCounter();
    ticksSinceSpawnRef.current = 10; // spawn immediately on first tick
  }, []);

  const handlePlayAgain = () => {
    resetIdCounter();
    setScore(0);
    setObjects([]);
    setCurrentPose(null);
    setGameOver(false);
    setDebugLines([]);
    gameOverRef.current = false;
    ticksSinceSpawnRef.current = 10;
  };

  const objectEmoji = character.id === 'lion' ? '🥩' : '🧀';

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${shaking ? 'animate-shake' : ''}`}
      style={{
        backgroundImage: `url(${isMobile ? mobileBackground : gameBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      

      <GameHud score={score} level={level} currentPose={currentPose} />

      <div className="absolute z-10" style={{ left: '50%', top: isMobile ? '58%' : '65%', transform: 'translate(-50%, -50%)' }}>
        <CharacterSprite character={character} pose={currentPose} />
      </div>

      {objects.map((obj) => (
        <FallingItem key={obj.id} object={obj} emoji={objectEmoji} />
      ))}

      {new URLSearchParams(window.location.search).has('debug') && (
        <div className="absolute left-2 bottom-2 z-30 max-w-[92vw] rounded-md border border-border bg-card/85 p-2 text-xs text-card-foreground">
          <div className="font-semibold">DEBUG CATCH</div>
          <div>pose: {currentPose ?? 'none'} | catchWindow: step ≥ {CATCH_STEP - 1}</div>
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
          onPlayAgain={handlePlayAgain}
          onMenu={onMenu}
        />
      )}
    </div>
  );
};

export default Game;
