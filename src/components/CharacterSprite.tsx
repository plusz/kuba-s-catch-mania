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
  // Default to top-left if no pose
  const currentPose = pose || 'top-left';
  const pos = character.spritePositions[currentPose];

  // Use object-position to show the correct quadrant of the 2x2 sprite sheet
  // Each quadrant is 50% of the image
  const objectPosition = `${pos.col * 100}% ${pos.row * 100}%`;

  return (
    <div className="w-32 h-32 md:w-40 md:h-40 relative">
      <div
        className="w-full h-full overflow-hidden rounded-lg"
        style={{
          position: 'relative',
        }}
      >
        <img
          src={character.spriteImage}
          alt={`${character.displayName} - ${currentPose}`}
          className="absolute"
          style={{
            width: '200%',
            height: '200%',
            objectFit: 'cover',
            left: `${-pos.col * 100}%`,
            top: `${-pos.row * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default CharacterSprite;
