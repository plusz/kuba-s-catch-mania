import type { GameCharacter } from './gameTypes';
import lionSprites from '@/assets/lion_sprites.png';
import mouseSprites from '@/assets/mouse_sprites.png';
import anteaterSprites from '@/assets/anteater_sprites.png';
import giraffeSprites from '@/assets/giraffe_sprites.png';
import jackalSprites from '@/assets/jackal_sprites.webp';
import jackalBackground from '@/assets/jackal_background.webp';
import mobileJackalBackground from '@/assets/mobile_jackal_background.png';
import cookieImage from '@/assets/cookie_game.png';
import palmImage from '@/assets/palm_game.png';
import moneyBagImage from '@/assets/moneybag_game.webp';
import moneyBagExploding from '@/assets/moneybag_exploding.webp';
import moneyBagSpilled from '@/assets/moneybag_spilled.webp';


export const CHARACTERS: GameCharacter[] = [
  {
    id: 'lion',
    name: 'Kuba',
    displayName: 'Lion Kuba',
    displayNamePl: 'Lew Kuba',
    objectName: 'Steak',
    objectNamePl: 'stek',
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
    displayNamePl: 'Mysz Patrycja',
    objectName: 'Cheese',
    objectNamePl: 'ser',
    objectEmoji: '🧀',
    spriteImage: mouseSprites,
    spriteScale: 0.8,
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
    displayNamePl: 'Mrówkojad Alfred',
    objectName: 'Ant Cookie',
    objectNamePl: 'ciastko',
    objectEmoji: '🍪',
    objectImage: cookieImage,
    spriteImage: anteaterSprites,
    spriteScale: 1.15,
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
    displayNamePl: 'Żyrafa Zofia',
    objectName: 'Palm Leaf',
    objectNamePl: 'liść palmy',
    objectEmoji: '🌿',
    objectImage: palmImage,
    objectScale: 1.3,
    spriteImage: giraffeSprites,
    spritePositions: {
      'top-left': { row: 0, col: 0 },
      'top-right': { row: 0, col: 1 },
      'bottom-left': { row: 1, col: 0 },
      'bottom-right': { row: 1, col: 1 },
    },
    locked: true,
  },
  {
    id: 'jackal',
    name: 'Szymon',
    displayName: 'Jackal Szymon',
    displayNamePl: 'Szakal Szymon',
    objectName: 'Money Bag',
    objectNamePl: 'worek pieniędzy',
    objectEmoji: '💰',
    objectImage: moneyBagImage,
    objectScale: 1.3,
    objectImageStages: [moneyBagImage, moneyBagExploding, moneyBagSpilled],
    spriteImage: jackalSprites,
    background: jackalBackground,
    mobileBackground: mobileJackalBackground,
    backgroundPosition: '75% center',
    spritePositions: {
      'top-left': { row: 0, col: 0 },
      'top-right': { row: 0, col: 1 },
      'bottom-left': { row: 1, col: 0 },
      'bottom-right': { row: 1, col: 1 },
    },
  },
];

