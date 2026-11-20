import type { FallingObject } from '@/lib/gameTypes';
import { CATCH_STEP } from '@/lib/gameEngine';
import { pointAt, renderStepFor, type Lane } from '@/lib/layout';
import ObjectImage from './ObjectImage';

interface FallingItemProps {
  object: FallingObject;
  /** Lane geometry: off-screen start → paw, in % of screen */
  lane: Lane;
  /** Fraction of the current tick interval elapsed (0-1), shared across objects */
  frac: number;
  /** Base object size in px before along-path growth */
  baseSize: number;
  emoji: string;
  objectImage?: string;
  objectImageStages?: string[];
}

/**
 * A falling object rendered at its quantized render step — the engine moves
 * it one step per tick, the view snaps it through VISUAL_SUBSTEPS hops per
 * tick (Android: renderStep = step - 1 + floor(frac * 2) / 2).
 */
const FallingItem = ({
  object,
  lane,
  frac,
  baseSize,
  emoji,
  objectImage,
  objectImageStages,
}: FallingItemProps) => {
  const { direction, step, pendingMiss } = object;
  const renderStep = renderStepFor(step, pendingMiss, frac);
  const t = renderStep / CATCH_STEP;
  const p = pointAt(lane, t);
  const sizePx = baseSize * (0.7 + 0.5 * t);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        transform: 'translate(-50%, -50%)',
        // under the sprite for most of the route, above it for the final hops
        zIndex: step >= CATCH_STEP - 1 ? 20 : 5,
      }}
    >
      <ObjectImage
        emoji={emoji}
        objectImage={objectImage}
        objectImageStages={objectImageStages}
        step={step}
        sizePx={sizePx}
      />
    </div>
  );
};

export default FallingItem;
