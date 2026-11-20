import { playClickSound } from '@/lib/audio';
import { useLang } from '@/lib/i18n';

const PlayTimeWarning = ({
  onContinue,
  onMenu,
}: {
  onContinue: () => void;
  onMenu: () => void;
}) => {
  const { t } = useLang();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="bg-card border-2 border-secondary rounded-2xl p-8 max-w-md mx-4">
        <h2 className="font-arcade text-lg text-secondary mb-4">{t('breakTitle')}</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {t('breakBody')}
        </p>
        <p className="text-xs text-muted-foreground mb-8">
          {t('breakSub')}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { playClickSound(); onContinue(); }}
            className="font-arcade text-xs px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {t('keepPlaying')}
          </button>
          <button
            onClick={() => { playClickSound(); onMenu(); }}
            className="font-arcade text-xs px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
          >
            {t('donePlaying')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayTimeWarning;
