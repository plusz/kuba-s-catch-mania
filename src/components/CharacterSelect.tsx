import { useState } from 'react';
import { CHARACTERS } from '@/lib/characters';
import type { GameCharacter } from '@/lib/gameTypes';
import { playClickSound } from '@/lib/audio';
import { verifyPassword } from '@/lib/password';

interface CharacterSelectProps {
  onSelect: (character: GameCharacter) => void;
}

const UNLOCK_STORAGE_KEY = 'catch-game-unlocked';

/** Character selection screen */
const CharacterSelect = ({ onSelect }: CharacterSelectProps) => {
  const [unlocked, setUnlocked] = useState(() => {
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === '1';
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleUnlock = () => {
    if (verifyPassword(passwordInput)) {
      setUnlocked(true);
      localStorage.setItem(UNLOCK_STORAGE_KEY, '1');
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(false);
      playClickSound();
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="font-arcade text-2xl md:text-4xl text-secondary mb-2 text-center drop-shadow-lg">
        🎮 Catch Game
      </h1>
      <p className="font-arcade text-xs text-muted-foreground mb-12">
        Choose your character
      </p>

      <div className="flex flex-wrap gap-8 justify-center">
        {CHARACTERS.map((char) => {
          const isLocked = char.locked && !unlocked;

          return (
            <button
              key={char.id}
              onClick={() => {
                if (isLocked) {
                  setShowPasswordModal(true);
                  return;
                }
                playClickSound();
                onSelect(char);
              }}
              className={`group flex flex-col items-center gap-4 p-6 rounded-xl bg-card border-2 transition-all duration-200 cursor-pointer ${
                isLocked
                  ? 'border-border opacity-60 hover:opacity-80'
                  : 'border-border hover:border-secondary hover:scale-105 hover:shadow-xl hover:shadow-secondary/20'
              }`}
            >
              <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-muted">
                <img
                  src={char.spriteImage}
                  alt={char.displayName}
                  className={`w-full h-full object-cover object-top ${isLocked ? 'blur-sm grayscale' : ''}`}
                />
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🔒</span>
                  </div>
                )}
              </div>
              <span className={`font-arcade text-sm transition-colors ${
                isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-secondary'
              }`}>
                {char.displayName}
              </span>
              <span className="text-xs text-muted-foreground">
                {isLocked ? 'Locked' : `Catches ${char.objectName}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-card border-2 border-border rounded-xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4">
            <span className="text-4xl">🔐</span>
            <h2 className="font-arcade text-sm text-secondary text-center">
              Secret Characters
            </h2>
            <p className="text-xs text-muted-foreground text-center">
              💡 Podpowiedź: podaj imię koguta z bajki o szczęściu
            </p>
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Wpisz hasło..."
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground text-center font-arcade text-xs focus:outline-none focus:border-secondary"
              autoFocus
            />
            {passwordError && (
              <p className="text-xs text-destructive font-arcade">Złe hasło!</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setPasswordError(false); }}
                className="font-arcade text-xs px-5 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-border transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleUnlock}
                className="font-arcade text-xs px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Odblokuj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelect;
