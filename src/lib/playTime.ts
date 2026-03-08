const COOKIE_NAME = 'play_session';
const WARNING_MINUTES = 15;
const LOCK_MINUTES = 30;
const LOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour

interface PlaySession {
  startedAt: number;
  lockedUntil?: number;
}

function getCookie(): PlaySession | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function setCookie(session: PlaySession) {
  const maxAge = 2 * 60 * 60; // 2h
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(session))};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function initSession() {
  const existing = getCookie();
  if (!existing || existing.lockedUntil) return;
  // session already running, keep it
}

export function ensureSession() {
  const existing = getCookie();
  if (existing && !isLocked()) return;
  setCookie({ startedAt: Date.now() });
}

function getElapsedMinutes(): number {
  const session = getCookie();
  if (!session) return 0;
  return (Date.now() - session.startedAt) / 60000;
}

export function isLocked(): boolean {
  const session = getCookie();
  if (!session?.lockedUntil) return false;
  if (Date.now() < session.lockedUntil) return true;
  // lock expired, clear
  setCookie({ startedAt: Date.now() });
  return false;
}

export function getLockRemainingMinutes(): number {
  const session = getCookie();
  if (!session?.lockedUntil) return 0;
  return Math.max(0, Math.ceil((session.lockedUntil - Date.now()) / 60000));
}

export function shouldShowWarning(): boolean {
  return getElapsedMinutes() >= WARNING_MINUTES && !isLocked();
}

export function shouldLock(): boolean {
  return getElapsedMinutes() >= LOCK_MINUTES;
}

export function activateLock() {
  setCookie({ startedAt: Date.now(), lockedUntil: Date.now() + LOCK_DURATION_MS });
}

export { WARNING_MINUTES, LOCK_MINUTES };
