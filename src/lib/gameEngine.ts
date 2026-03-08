import type { Direction, FallingObject } from './gameTypes';

/**
 * DISCRETE STEP-BASED GAME ENGINE
 * 
 * Objects move in discrete steps (like classic handheld games).
 * Each step makes a "tick" sound so the player hears the rhythm.
 * 
 * Total steps per lane: 8 visual positions (0-7)
 * Step 7 = catch zone (end of ramp).
 * If object is at step 7 and not caught, next tick = miss → game over.
 */

export const CATCH_STEP = 7;

/** Starting interval between ticks: 1000ms (1 step/sec) */
export const INITIAL_TICK_MS = 1000;
/** Minimum interval: 100ms (10 steps/sec) */
export const MIN_TICK_MS = 100;
/** How much faster per level (ms reduction) */
export const TICK_SPEEDUP = 50;
/** Points per level */
export const POINTS_PER_LEVEL = 5;

/**
 * Minimum gap in steps between two objects reaching the catch zone.
 * This ensures the player always has time to react between catches.
 * A gap of 3 steps means at least 3 ticks between arrivals.
 */
export const MIN_ARRIVAL_GAP_STEPS = 3;

const DIRECTIONS: Direction[] = ['top-left', 'bottom-left', 'top-right', 'bottom-right'];

let nextId = 0;

export function resetIdCounter() {
  nextId = 0;
}

/** Calculate tick interval based on level */
export function getTickInterval(level: number): number {
  const interval = INITIAL_TICK_MS - (level - 1) * TICK_SPEEDUP;
  return Math.max(MIN_TICK_MS, interval);
}

/** Calculate level from score */
export function getLevel(score: number): number {
  return Math.floor(score / POINTS_PER_LEVEL) + 1;
}

/**
 * Spawn a new falling object, ensuring it won't arrive at the catch zone
 * at the same time as any existing object.
 * 
 * Returns null if spawning now would cause a simultaneous arrival.
 */
export function trySpawnObject(existingObjects: FallingObject[]): FallingObject | null {
  const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  
  // New object starts at step 0, so it arrives at CATCH_STEP after CATCH_STEP ticks.
  // Check that no existing object will be at CATCH_STEP within MIN_ARRIVAL_GAP_STEPS
  // of when this new object arrives.
  const newArrivalTick = CATCH_STEP; // ticks from now until new object reaches catch zone
  
  for (const obj of existingObjects) {
    if (obj.caught) continue;
    const objTicksToArrive = CATCH_STEP - obj.step;
    const gap = Math.abs(newArrivalTick - objTicksToArrive);
    if (gap < MIN_ARRIVAL_GAP_STEPS) {
      return null; // too close, skip this spawn
    }
  }

  return {
    id: nextId++,
    direction,
    step: 0,
    caught: false,
  };
}

/** Force-spawn (used when we must spawn) */
export function spawnObject(): FallingObject {
  return {
    id: nextId++,
    direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
    step: 0,
    caught: false,
  };
}
