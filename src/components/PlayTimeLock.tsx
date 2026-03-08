import { playClickSound } from '@/lib/audio';

const PlayTimeLock = ({
  remainingMinutes,
  onMenu,
}: {
  remainingMinutes: number;
  onMenu: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
    <div className="bg-card border-2 border-destructive rounded-2xl p-8 max-w-md mx-4">
      <h2 className="font-arcade text-lg text-destructive mb-4">🔒 Przerwa!</h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Grasz już ponad 30 minut — pora na prawdziwą przerwę! Wyjdź na zewnątrz,
        pobiegaj, poczytaj książkę albo pobaw się z przyjaciółmi. 🌞
      </p>
      <p className="text-sm text-foreground font-semibold mb-8">
        Gra będzie dostępna ponownie za ok.{' '}
        <span className="text-destructive">{remainingMinutes}</span>{' '}
        {remainingMinutes === 1 ? 'minutę' : remainingMinutes < 5 ? 'minuty' : 'minut'}.
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

export default PlayTimeLock;
