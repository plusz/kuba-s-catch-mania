import { useEffect, useCallback } from 'react';
import type { Direction } from './gameTypes';
import { KEY_MAP } from './gameTypes';

/**
 * Hook to listen for keyboard input and map to game directions.
 * Calls onDirection when a valid key is pressed.
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
