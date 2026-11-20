import { playClickSound } from '@/lib/audio';
import { useLang } from '@/lib/i18n';

const PlayTimeLock = ({
  remainingMinutes,
  onMenu,
}: {
  remainingMinutes: number;
  onMenu: () => void;
}) => {
  const { lang, t } = useLang();
  const unit =
    lang === 'pl'
      ? remainingMinutes === 1
        ? 'minutę'
        : remainingMinutes < 5
          ? 'minuty'
          : 'minut'
      : 'min.';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="bg-card border-2 border-destructive rounded-2xl p-8 max-w-md mx-4">
        <h2 className="font-arcade text-lg text-destructive mb-4">{t('lockTitle')}</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {t('lockBody')}
        </p>
        <p className="text-sm text-foreground font-semibold mb-8">
          {t('lockBack')}{' '}
          <span className="text-destructive">{remainingMinutes}</span>{' '}
          {unit}
        </p>
        <button
          onClick={() => { playClickSound(); onMenu(); }}
          className="font-arcade text-xs px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:bg-border transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PlayTimeLock;
