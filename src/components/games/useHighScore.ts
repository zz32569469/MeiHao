"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emit() {
  listeners.forEach((callback) => callback());
}

function readStored(key: string): number {
  const raw = localStorage.getItem(key);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function getServerSnapshot() {
  return 0;
}

// localStorage read only happens client-side; getServerSnapshot keeps the
// build-time render at 0 so hydration doesn't fight the real stored value
// (same trick as ThemeToggle's useSyncExternalStore).
export function useHighScore(key: string) {
  const best = useSyncExternalStore(subscribe, () => readStored(key), getServerSnapshot);

  const reportScore = useCallback(
    (score: number) => {
      if (score > readStored(key)) {
        localStorage.setItem(key, String(score));
        emit();
      }
    },
    [key],
  );

  return [best, reportScore] as const;
}
