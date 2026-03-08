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
import { playCatchSound, playMissSound, playStepSound } from '@/lib/audio';
import CharacterSprite from './CharacterSprite';
import FallingItem from './FallingItem';
import GameHud from './GameHud';
import GameOverModal from './GameOverModal';
import gameBackground from '@/assets/game_background.png';

interface GameProps {
  character: GameCharacter;
  onMenu: () => void;
}

const STORAGE_KEY = 'catch-game-best-score';

/**
 * HOW CATCHING WORKS (discrete step system):
 * 
 * 1. Objects move in discrete steps (0 to TOTAL_STEPS=8), one step per "tick".
 * 2. Tick interval starts at 1000ms (1/sec) and speeds up to 100ms (10/sec).
 * 3. When an object reaches step CATCH_STEP (7), it's in the "catch zone".
 * 4. The player must press the matching direction key (A/Z/L/M) while the
 *    object is at step 7. The key press instantly checks all objects at step 7
 *    with that direction and catches the first match.
 * 5. If an object at step 7 is NOT caught by the next tick, it advances past
 *    TOTAL_STEPS → game over (missed).
 * 6. Objects are never spawned if they'd arrive at the catch zone too close
 *    to another object (MIN_ARRIVAL_GAP_STEPS=3), so the player always has
 *    time to react between catches.
 */
const Game = ({ character, onMenu }: GameProps) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPose, setCurrentPose] = useState<Direction | null>(null);
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [shaking, setShaking] = useState(false);

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

  // Handle direction input — check for catchable objects at CATCH_STEP
  const handleDirection = useCallback((dir: Direction) => {
    if (gameOverRef.current) return;
    setCurrentPose(dir);

    const currentObjects = objectsRef.current;
    const catchable = currentObjects.find(
      (obj) => !obj.caught && obj.direction === dir && obj.step >= CATCH_STEP
    );

    if (catchable) {
      playCatchSound();
      setObjects((prev) => prev.filter((o) => o.id !== catchable.id));
      setScore((prev) => prev + 1);
    }
  }, []);

  useGameControls(handleDirection, !gameOver);

  /** One game tick: advance all objects by 1 step, check misses, maybe spawn */
  const doTick = useCallback(() => {
    if (gameOverRef.current) return;

    let missed = false;

    setObjects((prev) => {
      const updated = prev.map((obj) => {
        if (obj.caught) return obj;
        const newStep = obj.step + 1;
        if (newStep > TOTAL_STEPS) {
          missed = true;
        }
        return { ...obj, step: newStep };
      }).filter((obj) => !obj.caught);

      if (missed) {
        playMissSound();
        setShaking(true);
        setTimeout(() => setShaking(false), 300);
        setGameOver(true);
        return updated;
      }

      return updated;
    });

    if (missed) return;

    // Play step sound for each tick (audible rhythm)
    playStepSound();

    // Try to spawn a new object every few ticks
    ticksSinceSpawnRef.current++;
    if (ticksSinceSpawnRef.current >= 3) {
      const newObj = trySpawnObject(objectsRef.current);
      if (newObj) {
        setObjects((prev) => [...prev, newObj]);
        ticksSinceSpawnRef.current = 0;
      }
    }
  }, []);

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
    gameOverRef.current = false;
    ticksSinceSpawnRef.current = 10;
  };

  const objectEmoji = character.id === 'lion' ? '🥩' : '🧀';

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${shaking ? 'animate-shake' : ''}`}
      style={{
        backgroundImage: `url(${gameBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-background/30" />

      <GameHud score={score} level={level} currentPose={currentPose} />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <CharacterSprite character={character} pose={currentPose} />
      </div>

      {objects.map((obj) => (
        <FallingItem key={obj.id} object={obj} emoji={objectEmoji} />
      ))}

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5 opacity-20">
        <line x1="5%" y1="10%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
        <line x1="95%" y1="10%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
        <line x1="5%" y1="90%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
        <line x1="95%" y1="90%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
      </svg>

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
