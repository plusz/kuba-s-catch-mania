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

  const bgX = pos.col === 0 ? '0%' : '100%';
  const bgY = pos.row === 0 ? '0%' : '100%';

  const isGiraffe = character.id === 'giraffe';
  const sizeClass = isGiraffe
    ? 'w-[134px] h-[192px] md:w-48 md:h-[268px]'
    : 'w-28 h-40 md:w-40 md:h-56';

  return (
    <div
      className={`${sizeClass} rounded-xl overflow-hidden`}
      style={{
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
