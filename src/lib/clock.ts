import { useSyncExternalStore } from "react";

/**
 * One shared one-second ticker. It runs only while a component is subscribed,
 * so a page with no elapsed-time cells keeps no timer alive.
 * Selectors must return primitives so unchanged values do not re-render.
 */
let now = Date.now();
let timer: number | undefined;
const listeners = new Set<() => void>();

const tick = () => {
  now = Date.now();
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  // Refresh before the first read so a late mount does not show a stale time.
  now = Date.now();
  listeners.add(listener);
  if (timer === undefined) timer = window.setInterval(tick, 1000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
};

export const useClockValue = <T extends string | number | boolean>(select: (current: number) => T): T =>
  useSyncExternalStore(subscribe, () => select(now));
