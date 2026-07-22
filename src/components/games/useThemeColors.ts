"use client";

import { useEffect, useRef } from "react";

const CSS_VARS = {
  bg: "--bg",
  surface: "--surface",
  ink: "--ink",
  muted: "--muted",
  line: "--line",
  accent: "--accent",
  accentStrong: "--accent-strong",
  accentDim: "--accent-dim",
  status: "--status",
  onAccent: "--on-accent",
  blossom: "--blossom",
  blossomDim: "--blossom-dim",
} as const;

type ColorKey = keyof typeof CSS_VARS;
export type ThemeColors = Record<ColorKey, string>;

const FALLBACK: ThemeColors = {
  bg: "#16130f",
  surface: "#1f1a14",
  ink: "#e8ddc7",
  muted: "#9a8c74",
  line: "#3a3022",
  accent: "#c8752e",
  accentStrong: "#e8933f",
  accentDim: "#6b4420",
  status: "#a4432f",
  onAccent: "#16130f",
  blossom: "#b99490",
  blossomDim: "#8f716d",
};

export function useThemeColors() {
  const ref = useRef<ThemeColors>({ ...FALLBACK });

  useEffect(() => {
    function read() {
      const style = getComputedStyle(document.documentElement);
      (Object.keys(CSS_VARS) as ColorKey[]).forEach((key) => {
        const value = style.getPropertyValue(CSS_VARS[key]).trim();
        if (value) ref.current[key] = value;
      });
    }
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return ref;
}
