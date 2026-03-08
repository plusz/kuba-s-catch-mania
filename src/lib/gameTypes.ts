/** Direction a steak/object can fall from */
export type Direction = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';

/** A falling object in the game (discrete steps) */
export interface FallingObject {
  id: number;
  direction: Direction;
  /** Current step: 0 = just spawned, CATCH_STEP = at catch zone */
  step: number;
  caught: boolean;
}

/** Character definition for extensibility */
export interface GameCharacter {
  id: string;
  name: string;
  displayName: string;
  objectName: string;
  objectEmoji: string;
  /** Optional image for falling object (used instead of emoji) */
  objectImage?: string;
  spriteImage: string;
  /** Sprite sheet layout: 2x2 grid mapping to directions */
  spritePositions: Record<Direction, { row: number; col: number }>;
  /** Whether this character requires a password to unlock */
  locked?: boolean;
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
