declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGameOver(score: number, level: number) {
  if (window.gtag) {
    window.gtag('event', 'game_over', {
      event_category: 'game',
      score,
      level,
    });
  }
}
