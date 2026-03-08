import { Volume2, VolumeX } from 'lucide-react';
import { DIRECTION_KEYS } from '@/lib/gameTypes';
import type { Direction } from '@/lib/gameTypes';

interface GameHudProps {
  score: number;
  level: number;
  currentPose: Direction | null;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

/** Heads-up display showing score, level, and key hints */
const GameHud = ({ score, level, currentPose }: GameHudProps) => {
  const directions: Direction[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
          <p className="font-arcade text-xs text-muted-foreground">Score</p>
          <p className="font-arcade text-lg text-secondary">{score}</p>
        </div>
        <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
          <p className="font-arcade text-xs text-muted-foreground">Level</p>
          <p className="font-arcade text-lg text-primary">{level}</p>
        </div>
      </div>

      {/* Key hints at corners */}
      {directions.map((dir) => {
        const isActive = currentPose === dir;
        const posClass = {
          'top-left': 'top-20 left-4',
          'top-right': 'top-20 right-4',
          'bottom-left': 'bottom-4 left-4',
          'bottom-right': 'bottom-4 right-4',
        }[dir];

        return (
          <div
            key={dir}
            className={`absolute ${posClass} z-10 transition-all duration-100 ${
              isActive ? 'scale-125' : ''
            }`}
          >
            <kbd
              className={`font-arcade text-sm px-3 py-2 rounded border-2 transition-colors ${
                isActive
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'bg-card/80 text-muted-foreground border-border'
              }`}
            >
              {DIRECTION_KEYS[dir]}
            </kbd>
          </div>
        );
      })}
    </>
  );
};

export default GameHud;
