import type { GameCharacter } from './gameTypes';
import lionSprites from '@/assets/lion_sprites.png';
import mouseSprites from '@/assets/mouse_sprites.png';
import anteaterSprites from '@/assets/anteater_sprites.png';
import giraffeSprites from '@/assets/giraffe_sprites.png';
import cookieImage from '@/assets/cookie_game.png';
import palmImage from '@/assets/palm_game.png';

export const CHARACTERS: GameCharacter[] = [
  {
    id: 'lion',
    name: 'Kuba',
    displayName: 'Lion Kuba',
    objectName: 'Steak',
    objectEmoji: '🥩',
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
    objectEmoji: '🧀',
    spriteImage: mouseSprites,
    spritePositions: {
      'top-left': { row: 0, col: 0 },
      'top-right': { row: 0, col: 1 },
      'bottom-left': { row: 1, col: 0 },
      'bottom-right': { row: 1, col: 1 },
    },
  },
  {
    id: 'anteater',
    name: 'Alfred',
    displayName: 'Anteater Alfred',
    objectName: 'Ant Cookie',
    objectEmoji: '🍪',
    objectImage: cookieImage,
    spriteImage: anteaterSprites,
    spritePositions: {
      'top-left': { row: 0, col: 0 },
      'top-right': { row: 0, col: 1 },
      'bottom-left': { row: 1, col: 0 },
      'bottom-right': { row: 1, col: 1 },
    },
    locked: true,
  },
  {
    id: 'giraffe',
    name: 'Sophia',
    displayName: 'Giraffe Sophia',
    objectName: 'Palm Leaf',
    objectEmoji: '🌿',
    objectImage: palmImage,
    spriteImage: giraffeSprites,
    spritePositions: {
      'top-left': { row: 0, col: 0 },
      'top-right': { row: 0, col: 1 },
      'bottom-left': { row: 1, col: 0 },
      'bottom-right': { row: 1, col: 1 },
    },
    locked: true,
  },
];
