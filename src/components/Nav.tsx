"use client";

import PlumBlossomMark from "./PlumBlossomMark";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header
      className="fixed z-40 flex items-center gap-2 border-2 border-line bg-bg px-2.5 py-1.5"
      style={{ top: "calc(var(--frame-margin) + 0.75rem)", right: "0.75rem" }}
    >
      <button
        type="button"
        aria-label="回頂端"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center"
      >
        <PlumBlossomMark unit={2} />
      </button>
      <ThemeToggle />
    </header>
  );
}
