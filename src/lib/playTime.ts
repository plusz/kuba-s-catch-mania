/**
 * Play-time limiting (parity with Android GameSession).
 *
 * Time is counted ONLY while a round is running — beginPlay() marks the
 * start of a round, endPlay() banks the elapsed time into `playedMs`.
 * Menu/idle/closed-tab time does not count. After 4h without playing the
 * counter resets. 15 min played → continue prompt; 30 min → 1h lock.
 */

const STORAGE_KEY = 'catch-play-session';

const WARNING_MS = 15 * 60 * 1000; // 15 min played → warning
const LOCK_MS = 30 * 60 * 1000; //    30 min played → lock
const LOCK_DURATION_MS = 60 * 60 * 1000; // lock lasts 1h
const RESET_IDLE_MS = 4 * 60 * 60 * 1000; // 4h without playing resets playedMs

interface PlaySession {
  /** Total ms played across finished rounds */
  playedMs: number;
  /** Last time the player did anything (round start/end) */
  lastActive: number;
  /** Timestamp of the currently running round, if any */
  playStart?: number;
  lockedUntil?: number;
}

function load(): PlaySession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlaySession) : null;
  } catch {
    return null;
  }
}

function save(session: PlaySession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

/** Mark the start of a round. */
export function beginPlay() {
  const s = load() ?? { playedMs: 0, lastActive: 0 };
  s.playStart = Date.now();
  s.lastActive = Date.now();
  save(s);
}

/** Bank the current round's elapsed time. Idempotent. */
export function endPlay() {
  const s = load();
  if (!s?.playStart) return;
  s.playedMs += Date.now() - s.playStart;
  s.playStart = undefined;
  s.lastActive = Date.now();
  save(s);
}

export type PlayCheck = 'play' | 'warn' | 'locked';

/** Gate checked before starting a round (Android: checkBeforeStart). */
export function checkBeforeStart(): PlayCheck {
  const now = Date.now();
  const s = load() ?? { playedMs: 0, lastActive: now };

  if (s.lockedUntil) {
    if (now < s.lockedUntil) {
      save(s);
      return 'locked';
    }
    // lock expired → clear and reset the counter
    s.lockedUntil = undefined;
    s.playedMs = 0;
  }

  if (now - s.lastActive >= RESET_IDLE_MS) {
    s.playedMs = 0;
  }

  if (s.playedMs >= LOCK_MS) {
    s.lockedUntil = now + LOCK_DURATION_MS;
    save(s);
    return 'locked';
  }

  save(s);
  return s.playedMs >= WARNING_MS ? 'warn' : 'play';
}

export function isLocked(): boolean {
  const s = load();
  if (!s?.lockedUntil) return false;
  if (Date.now() < s.lockedUntil) return true;
  // lock expired → clear and reset the counter
  s.lockedUntil = undefined;
  s.playedMs = 0;
  save(s);
  return false;
}

export function getLockRemainingMinutes(): number {
  const s = load();
  if (!s?.lockedUntil) return 0;
  return Math.max(0, Math.ceil((s.lockedUntil - Date.now()) / 60000));
}

/** Dev bypass — clears everything. */
export function resetSession() {
  localStorage.removeItem(STORAGE_KEY);
}
