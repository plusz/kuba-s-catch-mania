import type { GameCharacter } from '@/lib/gameTypes';
import { playClickSound } from '@/lib/audio';
import { useLang, useLabels } from '@/lib/i18n';

interface StartScreenProps {
  character: GameCharacter;
  onStart: () => void;
  onBack: () => void;
}

/** Start screen with instructions */
const StartScreen = ({ character, onStart, onBack }: StartScreenProps) => {
  const { t } = useLang();
  const { charName, objName } = useLabels();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <h1 className="font-arcade text-lg md:text-3xl text-secondary mb-1 sm:mb-2 text-center">
        {charName(character)}
      </h1>
      <p className="font-arcade text-[10px] sm:text-xs text-primary mb-4 sm:mb-8">
        {t('catchThe', { obj: objName(character) })}
      </p>

      <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl overflow-hidden mb-4 sm:mb-8 animate-pulse-glow">
        <img
          src={character.spriteImage}
          alt={character.displayName}
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-4 sm:mb-8 max-w-md w-[calc(100%-1rem)] sm:w-full">
        <h2 className="font-arcade text-[10px] sm:text-xs text-secondary mb-3 sm:mb-4">{t('controls')}</h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <kbd className="bg-muted text-foreground font-arcade text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-border">A</kbd>
            <span className="text-muted-foreground text-[10px] sm:text-sm">{t('dirTopLeft')}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <kbd className="bg-muted text-foreground font-arcade text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-border">L</kbd>
            <span className="text-muted-foreground text-[10px] sm:text-sm">{t('dirTopRight')}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <kbd className="bg-muted text-foreground font-arcade text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-border">Z</kbd>
            <span className="text-muted-foreground text-[10px] sm:text-sm">{t('dirBottomLeft')}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <kbd className="bg-muted text-foreground font-arcade text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-border">M</kbd>
            <span className="text-muted-foreground text-[10px] sm:text-sm">{t('dirBottomRight')}</span>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4 text-center">
          {t('missHint', { obj: objName(character) })}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="font-arcade text-xs px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:bg-border transition-colors"
        >
          {t('back')}
        </button>
        <button
          onClick={() => { playClickSound(); onStart(); }}
          className="font-arcade text-xs px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity animate-pulse-glow"
        >
          {t('startGame')}
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
