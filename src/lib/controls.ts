import { useEffect, useCallback } from 'react';
import type { Direction } from './gameTypes';
import { KEY_MAP } from './gameTypes';

/**
 * Hook to listen for keyboard AND touch input and map to game directions.
 * Touch zones: the screen is divided into 4 quadrants.
 * Top-left, top-right, bottom-left, bottom-right map to the 4 directions.
 */
export function useGameControls(
  onDirection: (dir: Direction) => void,
  enabled: boolean
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      const key = e.key.toLowerCase();
      const direction = KEY_MAP[key];
      if (direction) {
        e.preventDefault();
        onDirection(direction);
      }
    },
    [onDirection, enabled]
  );

  const handleTouch = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      if (!touch) return;

      const x = touch.clientX;
      const y = touch.clientY;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const isLeft = x < w / 2;
      const isTop = y < h / 2;

      let direction: Direction;
      if (isTop && isLeft) direction = 'top-left';
      else if (isTop && !isLeft) direction = 'top-right';
      else if (!isTop && isLeft) direction = 'bottom-left';
      else direction = 'bottom-right';

      e.preventDefault();
      onDirection(direction);
    },
    [onDirection, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [handleKeyDown, handleTouch]);
}
