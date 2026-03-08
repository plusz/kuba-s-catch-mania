import { useState } from 'react';
import type { GameCharacter, GamePhase } from '@/lib/gameTypes';
import CharacterSelect from '@/components/CharacterSelect';
import StartScreen from '@/components/StartScreen';
import Game from '@/components/Game';
import PlayTimeWarning from '@/components/PlayTimeWarning';
import PlayTimeLock from '@/components/PlayTimeLock';
import {
  ensureSession,
  shouldShowWarning,
  shouldLock,
  activateLock,
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

  const handleStart = () => {
    ensureSession();
    setPhase('playing');
  };

  const handleBackToSelect = () => {
    setCharacter(null);
    setPhase('select');
  };

  /** Called when user clicks "Play Again" or "Start Game" — check time limits */
  const handleNewGame = () => {
    if (isLocked()) {
      setShowLock(true);
      return;
    }
    if (shouldLock()) {
      trackPlayTime(30);
      activateLock();
      setShowLock(true);
      return;
    }
    if (shouldShowWarning()) {
      trackPlayTime(15);
      setShowWarning(true);
      return;
    }
    setGameKey((k) => k + 1);
    setPhase('playing');
  };

  if (showLock) {
    return <PlayTimeLock remainingMinutes={getLockRemainingMinutes()} onMenu={handleBackToSelect} />;
  }

  if (showWarning) {
    return (
      <PlayTimeWarning
        onContinue={() => {
          setShowWarning(false);
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
    return <Game character={character} onMenu={handleBackToSelect} onNewGame={handleNewGame} />;
  }

  return null;
};

export default Index;
