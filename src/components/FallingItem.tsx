import type { Direction, FallingObject } from '@/lib/gameTypes';
import { CATCH_STEP } from '@/lib/gameEngine';
import { useIsMobile } from '@/hooks/use-mobile';

interface FallingItemProps {
  object: FallingObject;
  emoji: string;
  /** Optional image to render instead of emoji */
  objectImage?: string;
  /** Optional stages: cycled by drop progress */
  objectImageStages?: string[];
  /** Character ID for per-character sizing */
  characterId?: string;
}

const DESKTOP_LANES: Record<Direction, { startX: number; startY: number; endX: number; endY: number }> = {
  'top-left': { startX: 8, startY: 22, endX: 38, endY: 48 },
  'top-right': { startX: 92, startY: 22, endX: 62, endY: 48 },
  'bottom-left': { startX: 8, startY: 85, endX: 38, endY: 60 },
  'bottom-right': { startX: 92, startY: 85, endX: 62, endY: 60 },
};

const MOBILE_LANES: Record<Direction, { startX: number; startY: number; endX: number; endY: number }> = {
  'top-left': { startX: 10, startY: 30, endX: 38, endY: 52 },
  'top-right': { startX: 90, startY: 30, endX: 62, endY: 52 },
  'bottom-left': { startX: 10, startY: 82, endX: 38, endY: 62 },
  'bottom-right': { startX: 90, startY: 82, endX: 62, endY: 62 },
};

const FallingItem = ({ object, emoji, objectImage, objectImageStages, characterId }: FallingItemProps) => {
  const isMobile = useIsMobile();
  const { direction, step } = object;
  const progress = Math.min(step, CATCH_STEP) / CATCH_STEP;

  const lanes = isMobile ? MOBILE_LANES : DESKTOP_LANES;
  const lane = lanes[direction];
  const x = lane.startX + (lane.endX - lane.startX) * progress;
  const y = lane.startY + (lane.endY - lane.startY) * progress;
  const scale = 1.2 + progress * 1.2;

  // Staged sprites: only switch in the last 2 catch steps (CATCH_STEP-1, CATCH_STEP).
  // Earlier steps always use the first (intact) sprite.
  let stageImage = objectImage;
  if (objectImageStages && objectImageStages.length > 0) {
    if (step >= CATCH_STEP) {
      stageImage = objectImageStages[Math.min(2, objectImageStages.length - 1)];
    } else if (step >= CATCH_STEP - 1) {
      stageImage = objectImageStages[Math.min(1, objectImageStages.length - 1)];
    } else {
      stageImage = objectImageStages[0];
    }
  }

  const itemSize = characterId === 'giraffe' || characterId === 'jackal' ? '2.6rem' : '2rem';

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 20,
      }}
    >
      {stageImage ? (
        <img
          src={stageImage}
          alt=""
          className="drop-shadow-lg"
          style={{ width: itemSize, height: itemSize, objectFit: 'contain' }}
        />

      ) : (
        <span className="drop-shadow-lg" style={{ fontSize: '2rem' }}>{emoji}</span>
      )}
    </div>
  );
};

export default FallingItem;
