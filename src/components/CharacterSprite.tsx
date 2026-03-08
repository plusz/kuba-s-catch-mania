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

  const sizeMap: Record<string, string> = {
    giraffe: 'w-[174px] h-[250px] md:w-[250px] md:h-[348px]',
    anteater: 'w-[160px] h-[190px] md:w-[228px] md:h-[270px]',
    default: 'w-[146px] h-[208px] md:w-[208px] md:h-[291px]',
  };
  const sizeClass = sizeMap[character.id] || sizeMap.default;

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
