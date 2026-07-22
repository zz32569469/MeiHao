"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      role="group"
      aria-label="配色模式"
      className="flex border-2 border-line font-mono text-xs tracking-wide"
    >
      <button
        type="button"
        onClick={() => setTheme(true)}
        aria-pressed={isDark}
        className={`cursor-pointer px-3 py-1.5 font-bold ${
          isDark ? "bg-accent text-on-accent" : "text-muted hover:text-ink"
        }`}
      >
        暗
      </button>
      <button
        type="button"
        onClick={() => setTheme(false)}
        aria-pressed={!isDark}
        className={`cursor-pointer border-l-2 border-line px-3 py-1.5 font-bold ${
          !isDark ? "bg-accent text-on-accent" : "text-muted hover:text-ink"
        }`}
      >
        亮
      </button>
    </div>
  );
}
