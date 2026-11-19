/** Fired whenever saved training progress changes, so derived views (achievements) can re-check. */
export const PROGRESS_EVENT = 'gm-progress-updated';

export function notifyProgressUpdated() {
  if (typeof window === 'undefined') return;
  // Deferred: saves can happen inside React state updaters, where listeners must not set state synchronously
  window.setTimeout(() => window.dispatchEvent(new Event(PROGRESS_EVENT)), 0);
}
