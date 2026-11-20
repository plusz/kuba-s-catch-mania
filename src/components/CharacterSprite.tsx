import { useEffect, useState } from 'react';
import type { Direction, GameCharacter } from '@/lib/gameTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { spriteWidthPx } from '@/lib/layout';

interface CharacterSpriteProps {
  character: GameCharacter;
  pose: Direction | null;
}

/**
 * Renders the character sprite, cropping the 2x2 sprite sheet
 * to show only the quadrant matching the current pose.
 *
 * Height is derived from the sprite cell's real aspect ratio (a cell is a
 * quarter of the sheet, so cell aspect = sheet aspect) — same as Android's
 * `cellH = playerSize * cell.height / cell.width`. Hardcoding both width and
 * height visibly distorted cells whose aspect differs from the box (e.g. the
 * mouse was rendered ~38% too wide).
 */
const CharacterSprite = ({ character, pose }: CharacterSpriteProps) => {
  const isMobile = useIsMobile();
  const currentPose = pose || 'top-left';
  const pos = character.spritePositions[currentPose];

  const bgX = pos.col === 0 ? '0%' : '100%';
  const bgY = pos.row === 0 ? '0%' : '100%';

  const [aspect, setAspect] = useState<number | null>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAspect(img.naturalWidth / img.naturalHeight);
    img.src = character.spriteImage;
  }, [character.spriteImage]);

  const width = spriteWidthPx(isMobile, character.spriteScale ?? 1);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        width,
        aspectRatio: aspect ? String(aspect) : '0.66',
        backgroundImage: `url(${character.spriteImage})`,
        backgroundSize: '200% 200%',
        backgroundPosition: `${bgX} ${bgY}`,
        backgroundRepeat: 'no-repeat',
        mixBlendMode: 'multiply',
      }}
    />
  );
};

export default CharacterSprite;
