const PIXELS = [
  [8, 0, "var(--accent)"],
  [4, 4, "var(--accent)"],
  [8, 4, "var(--accent-strong)"],
  [12, 4, "var(--accent)"],
  [0, 8, "var(--accent)"],
  [4, 8, "var(--accent-strong)"],
  [8, 8, "var(--accent-strong)"],
  [12, 8, "var(--accent-strong)"],
  [16, 8, "var(--accent)"],
  [0, 12, "var(--accent-dim)"],
  [4, 12, "var(--accent)"],
  [8, 12, "var(--accent-strong)"],
  [12, 12, "var(--accent)"],
  [16, 12, "var(--accent-dim)"],
  [4, 16, "var(--accent-dim)"],
  [8, 16, "var(--accent)"],
  [12, 16, "var(--accent-dim)"],
  [8, 20, "var(--accent-dim)"],
  [8, 24, "var(--accent-dim)"],
] as const;

export default function FlameMark({ className }: { className?: string }) {
  const boxShadow = PIXELS.map(([x, y, color]) => `${x}px ${y}px 0 0 ${color}`).join(", ");

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        width: 4,
        height: 4,
        background: "transparent",
        boxShadow,
      }}
    />
  );
}
