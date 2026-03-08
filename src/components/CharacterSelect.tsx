import { CHARACTERS } from '@/lib/characters';
import type { GameCharacter } from '@/lib/gameTypes';
import { playClickSound } from '@/lib/audio';

interface CharacterSelectProps {
  onSelect: (character: GameCharacter) => void;
}

/** Character selection screen */
const CharacterSelect = ({ onSelect }: CharacterSelectProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="font-arcade text-2xl md:text-4xl text-secondary mb-2 text-center drop-shadow-lg">
        🎮 Catch Game
      </h1>
      <p className="font-arcade text-xs text-muted-foreground mb-12">
        Choose your character
      </p>

      <div className="flex flex-wrap gap-8 justify-center">
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            onClick={() => {
              playClickSound();
              onSelect(char);
            }}
            className="group flex flex-col items-center gap-4 p-6 rounded-xl bg-card border-2 border-border hover:border-secondary transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-secondary/20 cursor-pointer"
          >
            <div className="w-40 h-40 rounded-lg overflow-hidden bg-muted">
              <img
                src={char.spriteImage}
                alt={char.displayName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="font-arcade text-sm text-foreground group-hover:text-secondary transition-colors">
              {char.displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              Catches {char.objectName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelect;
