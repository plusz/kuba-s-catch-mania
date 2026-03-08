/** Direction a steak/object can fall from */
export type Direction = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';

/** A falling object in the game */
export interface FallingObject {
  id: number;
  direction: Direction;
  /** Progress from 0 (spawn) to 1 (reached catch point) */
  progress: number;
  caught: boolean;
}

/** Character definition for extensibility */
export interface GameCharacter {
  id: string;
  name: string;
  displayName: string;
  objectName: string;
  spriteImage: string;
  /** Sprite sheet layout: 2x2 grid mapping to directions */
  spritePositions: Record<Direction, { row: number; col: number }>;
}

/** Game state phases */
export type GamePhase = 'select' | 'start' | 'playing' | 'gameover';

/** Key mappings for directions */
export const KEY_MAP: Record<string, Direction> = {
  a: 'top-left',
  z: 'bottom-left',
  l: 'top-right',
  m: 'bottom-right',
};

/** Direction labels for display */
export const DIRECTION_LABELS: Record<Direction, string> = {
  'top-left': 'Top Left',
  'bottom-left': 'Bottom Left',
  'top-right': 'Top Right',
  'bottom-right': 'Bottom Right',
};

/** Key labels for each direction */
export const DIRECTION_KEYS: Record<Direction, string> = {
  'top-left': 'A',
  'bottom-left': 'Z',
  'top-right': 'L',
  'bottom-right': 'M',
};
