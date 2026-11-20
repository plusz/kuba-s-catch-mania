import { CATCH_STEP } from '@/lib/gameEngine';
import type { Direction } from '@/lib/gameTypes';
import { CATCH_ANIM_MS, pointAt, type Lane, type Pct } from '@/lib/layout';
import ObjectImage from './ObjectImage';

/** A caught/missed object event — removed from the engine, kept briefly for the animation. */
export interface DyingEntry {
  id: string;
  direction: Direction;
  /** Engine step at the moment of catch/miss — animation starts there */
  step: number;
  missed: boolean;
  /** performance.now() timestamp when the event fired */
  startMs: number;
}

interface DyingItemProps {
  item: DyingEntry;
  lane: Lane;
  baseSize: number;
  /** Current frame timestamp (performance.now() basis) driving the animation */
  now: number;
  emoji: string;
  objectImage?: string;
  objectImageStages?: string[];
}

/**
 * Short animation after catch or miss (Android: dying list, 250ms).
 * Catch: the object flies into the paw with ease-in, shrinking and fading.
 * Miss: the object sits at the paw (spilled stage if available) and fades.
 */
const DyingItem = ({
  item,
  lane,
  baseSize,
  now,
  emoji,
  objectImage,
  objectImageStages,
}: DyingItemProps) => {
  const aT = Math.min(1, Math.max(0, (now - item.startMs) / CATCH_ANIM_MS));

  let pos: Pct;
  let sizePx: number;
  if (item.missed) {
    pos = lane.end;
    sizePx = baseSize * 1.2;
  } else {
    const from = pointAt(lane, item.step / CATCH_STEP);
    const ease = aT * aT; // accelerate toward the hand
    pos = {
      x: from.x + (lane.end.x - from.x) * ease,
      y: from.y + (lane.end.y - from.y) * ease,
    };
    sizePx = baseSize * 1.2 * (1 - 0.6 * aT);
  }

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        opacity: 1 - aT,
      }}
    >
      <ObjectImage
        emoji={emoji}
        objectImage={objectImage}
        objectImageStages={objectImageStages}
        step={item.step}
        missed={item.missed}
        sizePx={sizePx}
      />
    </div>
  );
};

export default DyingItem;
