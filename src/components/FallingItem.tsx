import type { Direction, FallingObject } from '@/lib/gameTypes';
import { CATCH_STEP } from '@/lib/gameEngine';

interface FallingItemProps {
  object: FallingObject;
  emoji: string;
}

/**
 * Renders a falling object traveling in discrete steps along a lane
 * from a corner toward the center of the screen.
 */
const FallingItem = ({ object, emoji }: FallingItemProps) => {
  const { direction, step } = object;
  const progress = Math.min(step, CATCH_STEP) / CATCH_STEP;

  // Lanes follow the 4 wooden/bamboo ramps visible in the background
  // Top ramps: start at outer edges ~20% height, end near character ~48% height
  // Bottom ramps: start at outer edges ~85% height, end near character ~58% height
  const lanes: Record<Direction, { startX: number; startY: number; endX: number; endY: number }> = {
    'top-left': { startX: 8, startY: 22, endX: 38, endY: 48 },
    'top-right': { startX: 92, startY: 22, endX: 62, endY: 48 },
    'bottom-left': { startX: 8, startY: 85, endX: 38, endY: 60 },
    'bottom-right': { startX: 92, startY: 85, endX: 62, endY: 60 },
  };

  const lane = lanes[direction];
  const x = lane.startX + (lane.endX - lane.startX) * progress;
  const y = lane.startY + (lane.endY - lane.startY) * progress;
  const scale = 1.2 + progress * 1.2;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        fontSize: '2rem',
        zIndex: 20,
      }}
    >
      <span className="drop-shadow-lg">{emoji}</span>
    </div>
  );
};

export default FallingItem;
