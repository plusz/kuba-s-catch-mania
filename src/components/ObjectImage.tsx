import { CATCH_STEP } from '@/lib/gameEngine';

interface ObjectImageProps {
  emoji: string;
  objectImage?: string;
  objectImageStages?: string[];
  /** Optional "missed" artwork — shown at the paw when a catch is missed */
  missedImage?: string;
  /** Visual (quantized) step — staged sprites switch on the last hop */
  renderStep: number;
  /** Miss visual — renders the "spilled" stage instead of the falling sprite */
  missed?: boolean;
  sizePx: number;
}

/** Renders a falling object: staged sprite, single image, or emoji fallback. */
const ObjectImage = ({
  emoji,
  objectImage,
  objectImageStages,
  missedImage,
  renderStep,
  missed,
  sizePx,
}: ObjectImageProps) => {
  let src = objectImage;
  if (missed) {
    src = missedImage ?? objectImageStages?.[Math.min(2, objectImageStages.length - 1)] ?? objectImage;
  } else if (objectImageStages && objectImageStages.length > 0) {
    // "exploding" only once the object visually reaches the paw — driving this
    // by renderStep (not engine step) keeps it from switching a hop early
    src = renderStep >= CATCH_STEP
      ? objectImageStages[Math.min(1, objectImageStages.length - 1)]
      : objectImageStages[0];
  }

  return src ? (
    <img
      src={src}
      alt=""
      className="drop-shadow-lg"
      style={{ width: sizePx, height: sizePx, objectFit: 'contain' }}
    />
  ) : (
    <span className="drop-shadow-lg" style={{ fontSize: sizePx * 0.8 }}>
      {emoji}
    </span>
  );
};

export default ObjectImage;
