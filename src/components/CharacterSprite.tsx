import type { Direction, GameCharacter } from '@/lib/gameTypes';

interface CharacterSpriteProps {
  character: GameCharacter;
  pose: Direction | null;
}

/**
 * Renders the character sprite, cropping the 2x2 sprite sheet
 * to show only the quadrant matching the current pose.
 */
const CharacterSprite = ({ character, pose }: CharacterSpriteProps) => {
  const currentPose = pose || 'top-left';
  const pos = character.spritePositions[currentPose];

  // background-size: 200% 200% makes the image 2x the container in both axes
  // background-position picks which quadrant to show:
  // col 0 → 0%, col 1 → 100%; row 0 → 0%, row 1 → 100%
  const bgX = pos.col === 0 ? '0%' : '100%';
  const bgY = pos.row === 0 ? '0%' : '100%';

  return (
    <div
      className="w-36 h-36 md:w-48 md:h-48 rounded-lg"
      style={{
        backgroundImage: `url(${character.spriteImage})`,
        backgroundSize: '200% 200%',
        backgroundPosition: `${bgX} ${bgY}`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export default CharacterSprite;
