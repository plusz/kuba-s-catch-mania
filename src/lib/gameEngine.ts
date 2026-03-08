import type { Direction, FallingObject } from './gameTypes';

/** Game configuration constants */
export const BASE_FALL_SPEED = 0.4; // progress per second at level 1
export const SPEED_INCREMENT = 0.05; // speed increase per level
export const POINTS_PER_LEVEL = 5; // points before leveling up
export const CATCH_THRESHOLD = 0.85; // progress at which catch is checked
export const MISS_THRESHOLD = 1.0; // progress at which object is missed
export const MIN_SPAWN_INTERVAL = 800; // ms minimum between spawns
export const MAX_SPAWN_INTERVAL = 2000; // ms maximum between spawns

const DIRECTIONS: Direction[] = ['top-left', 'bottom-left', 'top-right', 'bottom-right'];

let nextId = 0;

/** Reset the ID counter */
export function resetIdCounter() {
  nextId = 0;
}

/** Spawn a new falling object from a random direction */
export function spawnObject(): FallingObject {
  return {
    id: nextId++,
    direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
    progress: 0,
    caught: false,
  };
}

/** Calculate current fall speed based on level */
export function getFallSpeed(level: number): number {
  return BASE_FALL_SPEED + (level - 1) * SPEED_INCREMENT;
}

/** Calculate spawn interval based on level (decreases as level increases) */
export function getSpawnInterval(level: number): number {
  const interval = MAX_SPAWN_INTERVAL - (level - 1) * 150;
  return Math.max(MIN_SPAWN_INTERVAL, interval);
}

/** Calculate level from score */
export function getLevel(score: number): number {
  return Math.floor(score / POINTS_PER_LEVEL) + 1;
}

/** Check if an object has reached the catch zone */
export function isInCatchZone(obj: FallingObject): boolean {
  return obj.progress >= CATCH_THRESHOLD && obj.progress < MISS_THRESHOLD;
}

/** Check if an object has been missed */
export function isMissed(obj: FallingObject): boolean {
  return obj.progress >= MISS_THRESHOLD;
}
