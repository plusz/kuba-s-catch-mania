import { useState } from 'react';
import type { GameCharacter, GamePhase } from '@/lib/gameTypes';
import CharacterSelect from '@/components/CharacterSelect';
import StartScreen from '@/components/StartScreen';
import Game from '@/components/Game';
import PlayTimeWarning from '@/components/PlayTimeWarning';
import PlayTimeLock from '@/components/PlayTimeLock';
import {
  checkBeforeStart,
  isLocked,
  getLockRemainingMinutes,
} from '@/lib/playTime';
import { trackPlayTime } from '@/lib/analytics';

const Index = () => {
  const [phase, setPhase] = useState<GamePhase>('select');
  const [character, setCharacter] = useState<GameCharacter | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showLock, setShowLock] = useState(() => isLocked());
  const [gameKey, setGameKey] = useState(0);

  const handleSelectCharacter = (char: GameCharacter) => {
    setCharacter(char);
    setPhase('start');
  };

  /** Gate before starting a round — only actual play time counts */
  const checkAndPlay = (restart: boolean) => {
    const check = checkBeforeStart();
    if (check === 'locked') {
      trackPlayTime(30);
      setShowLock(true);
      return;
    }
    if (check === 'warn') {
      trackPlayTime(15);
      setShowWarning(true);
      return;
    }
    if (restart) setGameKey((k) => k + 1);
    setPhase('playing');
  };

  const handleStart = () => checkAndPlay(false);

  const handleBackToSelect = () => {
    setCharacter(null);
    setPhase('select');
  };

  /** Called when user clicks "Play Again" — check time limits */
  const handleNewGame = () => checkAndPlay(true);

  if (showLock) {
    return <PlayTimeLock remainingMinutes={getLockRemainingMinutes()} onMenu={handleBackToSelect} />;
  }

  if (showWarning) {
    return (
      <PlayTimeWarning
        onContinue={() => {
          setShowWarning(false);
          setGameKey((k) => k + 1); // remount Game — may be coming from a game-over restart
          setPhase('playing');
        }}
        onMenu={() => {
          setShowWarning(false);
          handleBackToSelect();
        }}
      />
    );
  }

  if (phase === 'select') {
    return <CharacterSelect onSelect={handleSelectCharacter} />;
  }

  if (phase === 'start' && character) {
    return (
      <StartScreen
        character={character}
        onStart={handleStart}
        onBack={handleBackToSelect}
      />
    );
  }

  if (phase === 'playing' && character) {
    return <Game key={gameKey} character={character} onMenu={handleBackToSelect} onNewGame={handleNewGame} />;
  }

  return null;
};

export default Index;
