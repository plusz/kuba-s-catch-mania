import type { GameCharacter } from './gameTypes';
import lionSprites from '@/assets/lion_sprites.png';
import mouseSprites from '@/assets/mouse_sprites.png';

export const CHARACTERS: GameCharacter[] = [
  {
    id: 'lion',
    name: 'Kuba',
    displayName: 'Lion Kuba',
    objectName: 'Steak',
    spriteImage: lionSprites,
    spritePositions: {
      'top-left': { row: 0, col: 0 },
      'top-right': { row: 0, col: 1 },
      'bottom-left': { row: 1, col: 0 },
      'bottom-right': { row: 1, col: 1 },
    },
  },
  {
    id: 'mouse',
    name: 'Patricia',
    displayName: 'Mouse Patricia',
    objectName: 'Cheese',
    spriteImage: mouseSprites,
    spritePositions: {
      'top-left': { row: 0, col: 0 },
      'top-right': { row: 0, col: 1 },
      'bottom-left': { row: 1, col: 0 },
      'bottom-right': { row: 1, col: 1 },
    },
  },
];
