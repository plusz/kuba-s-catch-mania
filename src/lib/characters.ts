import type { GameCharacter } from './gameTypes';
import lionSprites from '@/assets/lion_sprites.jpg';
import mouseSprites from '@/assets/mouse_sprites.png';

/**
 * Character definitions. Each sprite sheet is a 2x2 grid.
 * Row 0 = top row, Row 1 = bottom row
 * Col 0 = left col, Col 1 = right col
 * 
 * Lion: top-left=throw-left(0,0), top-right=throw-right(0,1), bottom-left=run-left(1,0), bottom-right=run-right(1,1)
 * Mouse: same layout
 */
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
