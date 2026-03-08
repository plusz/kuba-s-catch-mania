import { useState } from 'react';
import type { GameCharacter, GamePhase } from '@/lib/gameTypes';
import CharacterSelect from '@/components/CharacterSelect';
import StartScreen from '@/components/StartScreen';
import Game from '@/components/Game';

/**
 * Main page orchestrating game phases:
 * select → start → playing (with gameover handled inside Game)
 */
const Index = () => {
  const [phase, setPhase] = useState<GamePhase>('select');
  const [character, setCharacter] = useState<GameCharacter | null>(null);

  const handleSelectCharacter = (char: GameCharacter) => {
    setCharacter(char);
    setPhase('start');
  };

  const handleStart = () => {
    setPhase('playing');
  };

  const handleBackToSelect = () => {
    setCharacter(null);
    setPhase('select');
  };

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
    return <Game character={character} onMenu={handleBackToSelect} />;
  }

  return null;
};

export default Index;
