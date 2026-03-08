import type { Direction, FallingObject } from '@/lib/gameTypes';
import { CATCH_STEP } from '@/lib/gameEngine';
import { useIsMobile } from '@/hooks/use-mobile';

interface FallingItemProps {
  object: FallingObject;
  emoji: string;
}

const DESKTOP_LANES: Record<Direction, { startX: number; startY: number; endX: number; endY: number }> = {
  'top-left': { startX: 8, startY: 22, endX: 38, endY: 48 },
  'top-right': { startX: 92, startY: 22, endX: 62, endY: 48 },
  'bottom-left': { startX: 8, startY: 85, endX: 38, endY: 60 },
  'bottom-right': { startX: 92, startY: 85, endX: 62, endY: 60 },
};

const MOBILE_LANES: Record<Direction, { startX: number; startY: number; endX: number; endY: number }> = {
  'top-left': { startX: 5, startY: 25, endX: 35, endY: 55 },
  'top-right': { startX: 95, startY: 25, endX: 65, endY: 55 },
  'bottom-left': { startX: 5, startY: 90, endX: 35, endY: 68 },
  'bottom-right': { startX: 95, startY: 90, endX: 65, endY: 68 },
};

const FallingItem = ({ object, emoji }: FallingItemProps) => {
  const isMobile = useIsMobile();
  const { direction, step } = object;
  const progress = Math.min(step, CATCH_STEP) / CATCH_STEP;

  const lanes = isMobile ? MOBILE_LANES : DESKTOP_LANES;
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
