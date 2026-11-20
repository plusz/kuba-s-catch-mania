import { CATCH_STEP } from '@/lib/gameEngine';

interface ObjectImageProps {
  emoji: string;
  objectImage?: string;
  objectImageStages?: string[];
  /** Engine step — drives staged sprites (exploding only on the last hop) */
  step: number;
  /** Miss visual — renders the "spilled" stage instead of the falling sprite */
  missed?: boolean;
  sizePx: number;
}

/** Renders a falling object: staged sprite, single image, or emoji fallback. */
const ObjectImage = ({
  emoji,
  objectImage,
  objectImageStages,
  step,
  missed,
  sizePx,
}: ObjectImageProps) => {
  let src = objectImage;
  if (objectImageStages && objectImageStages.length > 0) {
    if (missed) {
      src = objectImageStages[Math.min(2, objectImageStages.length - 1)];
    } else if (step >= CATCH_STEP) {
      src = objectImageStages[Math.min(1, objectImageStages.length - 1)];
    } else {
      src = objectImageStages[0];
    }
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
