import type { Direction, FallingObject } from '@/lib/gameTypes';

interface FallingItemProps {
  object: FallingObject;
  emoji: string;
}

/**
 * Renders a falling object (steak/cheese) traveling along a lane
 * from a corner toward the center of the screen.
 */
const FallingItem = ({ object, emoji }: FallingItemProps) => {
  const { direction, progress } = object;

  // Define start and end positions (percentages) for each lane
  // Start = corner, End = center (where character is)
  const lanes: Record<Direction, { startX: number; startY: number; endX: number; endY: number }> = {
    'top-left': { startX: 5, startY: 10, endX: 42, endY: 40 },
    'top-right': { startX: 90, startY: 10, endX: 55, endY: 40 },
    'bottom-left': { startX: 5, startY: 85, endX: 42, endY: 55 },
    'bottom-right': { startX: 90, startY: 85, endX: 55, endY: 55 },
  };

  const lane = lanes[direction];
  const x = lane.startX + (lane.endX - lane.startX) * progress;
  const y = lane.startY + (lane.endY - lane.startY) * progress;

  // Scale up as it gets closer
  const scale = 0.6 + progress * 0.6;

  return (
    <div
      className="absolute pointer-events-none transition-none"
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
