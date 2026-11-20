import { useEffect, useState } from 'react';
import type { Direction } from './gameTypes';
import { CATCH_STEP } from './gameEngine';

/** Visible stops per engine step (Android: VISUAL_SUBSTEPS = 2 → hop every half-tick). */
export const VISUAL_SUBSTEPS = 2;
/** Duration of the catch/miss animation in ms (Android: CATCH_ANIM_MS). */
export const CATCH_ANIM_MS = 250;

export interface Pct {
  x: number;
  y: number;
}

/** A lane in % of screen: start (off-screen) → end (character's paw). */
export interface Lane {
  start: Pct;
  end: Pct;
}

type FormFactor = 'mobile' | 'desktop';

/** Base sprite width in px before per-character spriteScale (Android: imageRect.width * 0.30). */
export const BASE_SPRITE_WIDTH: Record<FormFactor, number> = {
  mobile: 146,
  desktop: 208,
};

/** Sprite center on screen, % (matches where Game.tsx anchors the sprite). */
export const PLAYER_CENTER: Record<FormFactor, Pct> = {
  mobile: { x: 50, y: 58 },
  desktop: { x: 50, y: 65 },
};

/** Paw reach as a fraction of sprite width (Android: 0.34 * playerSize). */
const HAND_REACH = 0.34;
/** How far past the screen edge lane starts are pushed, in %. */
const EDGE_MARGIN = 8;

/** Where each ramp visually begins, % of screen (mouth of the painted lanes). */
const LANE_STARTS: Record<FormFactor, Record<Direction, Pct>> = {
  desktop: {
    'top-left': { x: 8, y: 22 },
    'top-right': { x: 92, y: 22 },
    'bottom-left': { x: 8, y: 85 },
    'bottom-right': { x: 92, y: 85 },
  },
  mobile: {
    'top-left': { x: 10, y: 30 },
    'top-right': { x: 90, y: 30 },
    'bottom-left': { x: 10, y: 82 },
    'bottom-right': { x: 90, y: 82 },
  },
};

export function spriteWidthPx(isMobile: boolean, spriteScale = 1): number {
  return BASE_SPRITE_WIDTH[isMobile ? 'mobile' : 'desktop'] * spriteScale;
}

/** Base falling-object size in px — Android: objectSize = imageW * 0.10 vs player 0.30 → player/3. */
export function objectBasePx(isMobile: boolean, objectScale = 1): number {
  return (BASE_SPRITE_WIDTH[isMobile ? 'mobile' : 'desktop'] / 3) * objectScale;
}

/**
 * Lane start pushed past the screen edge along the lane direction, so objects
 * fly in instead of popping into existence (Android: laneStartExt).
 */
function extendStart(start: Pct, center: Pct): Pct {
  const dx = start.x - center.x;
  const dy = start.y - center.y;
  const len = Math.hypot(dx, dy);
  let { x, y } = start;
  for (
    let i = 0;
    i < 400 &&
    x > -EDGE_MARGIN &&
    x < 100 + EDGE_MARGIN &&
    y > -EDGE_MARGIN &&
    y < 100 + EDGE_MARGIN;
    i++
  ) {
    x += (dx / len) * 2;
    y += (dy / len) * 2;
  }
  return { x, y };
}

/**
 * Catch point = the character's extended paw: from the sprite center toward
 * the ramp mouth by ~1/3 of the sprite width (Android: handPoint).
 */
function handPoint(
  dir: Direction,
  isMobile: boolean,
  spriteScale: number,
  vw: number,
  vh: number
): Pct {
  const center = PLAYER_CENTER[isMobile ? 'mobile' : 'desktop'];
  const start = LANE_STARTS[isMobile ? 'mobile' : 'desktop'][dir];
  const cx = (center.x / 100) * vw;
  const cy = (center.y / 100) * vh;
  const dx = (start.x / 100) * vw - cx;
  const dy = (start.y / 100) * vh - cy;
  const len = Math.hypot(dx, dy);
  const reach = spriteWidthPx(isMobile, spriteScale) * HAND_REACH;
  return {
    x: ((cx + (dx / len) * reach) / vw) * 100,
    y: ((cy + (dy / len) * reach) / vh) * 100,
  };
}

/** All 4 lanes for the current viewport: off-screen start → paw. */
export function buildLanes(
  isMobile: boolean,
  spriteScale: number,
  vw: number,
  vh: number
): Record<Direction, Lane> {
  const key: FormFactor = isMobile ? 'mobile' : 'desktop';
  const center = PLAYER_CENTER[key];
  const lanes = {} as Record<Direction, Lane>;
  (Object.keys(LANE_STARTS[key]) as Direction[]).forEach((dir) => {
    lanes[dir] = {
      start: extendStart(LANE_STARTS[key][dir], center),
      end: handPoint(dir, isMobile, spriteScale, vw, vh),
    };
  });
  return lanes;
}

/** Position along a lane at progress t (0 = off-screen start, 1 = paw). */
export function pointAt(lane: Lane, t: number): Pct {
  const u = Math.min(1, Math.max(0, t));
  return {
    x: lane.start.x + (lane.end.x - lane.start.x) * u,
    y: lane.start.y + (lane.end.y - lane.start.y) * u,
  };
}

/**
 * Quantized render step for the "hopping" retro look (Android: renderStep =
 * step - 1 + floor(frac * VISUAL_SUBSTEPS) / VISUAL_SUBSTEPS). pendingMiss
 * pins the object at the paw for its grace tick.
 */
export function renderStepFor(
  step: number,
  pendingMiss: boolean | undefined,
  frac: number
): number {
  if (pendingMiss) return CATCH_STEP;
  const sub = Math.floor(frac * VISUAL_SUBSTEPS) / VISUAL_SUBSTEPS;
  return Math.min(CATCH_STEP, Math.max(0, step - 1 + sub));
}

/** Live viewport size for lane/sprite math that uses pixel reach. */
export function useViewportSize(): { vw: number; vh: number } {
  const [size, setSize] = useState({ vw: window.innerWidth, vh: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ vw: window.innerWidth, vh: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}
