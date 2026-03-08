import { useState, useEffect, useRef, useCallback } from 'react';
import type { Direction, FallingObject, GameCharacter } from '@/lib/gameTypes';
import {
  spawnObject,
  getFallSpeed,
  getSpawnInterval,
  getLevel,
  isInCatchZone,
  isMissed,
  resetIdCounter,
} from '@/lib/gameEngine';
import { useGameControls } from '@/lib/controls';
import { playCatchSound, playMissSound } from '@/lib/audio';
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

/** Main game component with game loop */
const Game = ({ character, onMenu }: GameProps) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPose, setCurrentPose] = useState<Direction | null>(null);
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [shaking, setShaking] = useState(false);

  // Refs for the game loop to avoid stale closures
  const scoreRef = useRef(0);
  const objectsRef = useRef<FallingObject[]>([]);
  const poseRef = useRef<Direction | null>(null);
  const gameOverRef = useRef(false);
  const lastSpawnRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Sync refs
  useEffect(() => { objectsRef.current = objects; }, [objects]);
  useEffect(() => { poseRef.current = currentPose; }, [currentPose]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const level = getLevel(score);

  // Best score from localStorage
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Save best score on game over
  useEffect(() => {
    if (gameOver && score > bestScore) {
      setBestScore(score);
      localStorage.setItem(STORAGE_KEY, score.toString());
    }
  }, [gameOver, score, bestScore]);

  // Handle direction input
  const handleDirection = useCallback((dir: Direction) => {
    if (gameOverRef.current) return;
    setCurrentPose(dir);

    // Check if any object in catch zone matches this direction
    const currentObjects = objectsRef.current;
    const catchable = currentObjects.find(
      (obj) => !obj.caught && obj.direction === dir && isInCatchZone(obj)
    );

    if (catchable) {
      // Successful catch
      playCatchSound();
      setObjects((prev) => prev.filter((o) => o.id !== catchable.id));
      setScore((prev) => prev + 1);
    }
  }, []);

  useGameControls(handleDirection, !gameOver);

  // Game loop
  useEffect(() => {
    resetIdCounter();
    lastTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();

    const gameLoop = (timestamp: number) => {
      if (gameOverRef.current) return;

      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = timestamp;

      const currentLevel = getLevel(scoreRef.current);
      const speed = getFallSpeed(currentLevel);
      const spawnInterval = getSpawnInterval(currentLevel);

      // Spawn new objects
      if (timestamp - lastSpawnRef.current > spawnInterval) {
        const newObj = spawnObject();
        setObjects((prev) => [...prev, newObj]);
        lastSpawnRef.current = timestamp;
      }

      // Update object positions
      setObjects((prev) => {
        let missed = false;
        const updated = prev
          .map((obj) => {
            if (obj.caught) return obj;
            const newProgress = obj.progress + speed * deltaTime;
            if (newProgress >= 1.0) {
              missed = true;
            }
            return { ...obj, progress: Math.min(newProgress, 1.0) };
          })
          .filter((obj) => !obj.caught);

        if (missed) {
          playMissSound();
          setShaking(true);
          setTimeout(() => setShaking(false), 300);
          setGameOver(true);
          return updated;
        }

        return updated;
      });

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handlePlayAgain = () => {
    resetIdCounter();
    setScore(0);
    setObjects([]);
    setCurrentPose(null);
    setGameOver(false);
    gameOverRef.current = false;
    lastTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();

    // Restart game loop
    const gameLoop = (timestamp: number) => {
      if (gameOverRef.current) return;

      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const currentLevel = getLevel(scoreRef.current);
      const speed = getFallSpeed(currentLevel);
      const spawnInterval = getSpawnInterval(currentLevel);

      if (timestamp - lastSpawnRef.current > spawnInterval) {
        const newObj = spawnObject();
        setObjects((prev) => [...prev, newObj]);
        lastSpawnRef.current = timestamp;
      }

      setObjects((prev) => {
        let missed = false;
        const updated = prev
          .map((obj) => {
            if (obj.caught) return obj;
            const newProgress = obj.progress + speed * deltaTime;
            if (newProgress >= 1.0) missed = true;
            return { ...obj, progress: Math.min(newProgress, 1.0) };
          })
          .filter((obj) => !obj.caught);

        if (missed) {
          playMissSound();
          setShaking(true);
          setTimeout(() => setShaking(false), 300);
          setGameOver(true);
          return updated;
        }
        return updated;
      });

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
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
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/30" />

      <GameHud score={score} level={level} currentPose={currentPose} />

      {/* Character in center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <CharacterSprite character={character} pose={currentPose} />
      </div>

      {/* Falling objects */}
      {objects.map((obj) => (
        <FallingItem key={obj.id} object={obj} emoji={objectEmoji} />
      ))}

      {/* Lane guides - subtle lines from corners to center */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5 opacity-20">
        <line x1="5%" y1="10%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
        <line x1="95%" y1="10%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
        <line x1="5%" y1="90%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
        <line x1="95%" y1="90%" x2="50%" y2="50%" stroke="hsl(45, 100%, 50%)" strokeWidth="2" strokeDasharray="8,8" />
      </svg>

      {/* Game over modal */}
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
