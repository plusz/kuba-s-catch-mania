import { playClickSound } from '@/lib/audio';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

/** Game over overlay with score and actions */
const GameOverModal = ({ score, bestScore, onPlayAgain, onMenu }: GameOverModalProps) => {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border-2 border-destructive rounded-2xl p-8 text-center max-w-sm mx-4">
        <h2 className="font-arcade text-lg text-destructive mb-6">Game Over!</h2>

        <div className="space-y-3 mb-8">
          <div>
            <p className="text-xs text-muted-foreground">Score</p>
            <p className="font-arcade text-3xl text-secondary">{score}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Score</p>
            <p className="font-arcade text-lg text-foreground">{bestScore}</p>
          </div>
          {isNewBest && (
            <p className="font-arcade text-xs text-game-gold animate-pulse-glow">
              🏆 New Record!
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => { playClickSound(); onPlayAgain(); }}
            className="font-arcade text-xs px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
          <button
            onClick={() => { playClickSound(); onMenu(); }}
            className="font-arcade text-xs px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:bg-border transition-colors"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
