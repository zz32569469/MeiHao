const PIXELS = [
  // top petal
  [12, 0, "var(--blossom)"],
  [9, 3, "var(--blossom)"],
  [15, 3, "var(--blossom-dim)"],
  [12, 3, "var(--blossom-dim)"],
  [12, 6, "var(--blossom)"],
  // upper-right petal
  [21, 6, "var(--blossom-dim)"],
  [18, 6, "var(--blossom)"],
  [24, 6, "var(--blossom-dim)"],
  [21, 3, "var(--blossom)"],
  [21, 9, "var(--blossom-dim)"],
  // lower-right petal
  [21, 18, "var(--blossom-dim)"],
  [18, 18, "var(--blossom)"],
  [24, 18, "var(--blossom-dim)"],
  [21, 15, "var(--blossom-dim)"],
  [21, 21, "var(--blossom)"],
  // lower-left petal
  [3, 18, "var(--blossom)"],
  [0, 18, "var(--blossom-dim)"],
  [6, 18, "var(--blossom-dim)"],
  [3, 15, "var(--blossom-dim)"],
  [3, 21, "var(--blossom)"],
  // upper-left petal
  [3, 6, "var(--blossom-dim)"],
  [0, 6, "var(--blossom)"],
  [6, 6, "var(--blossom-dim)"],
  [3, 3, "var(--blossom)"],
  [3, 9, "var(--blossom-dim)"],
  // center stamen
  [12, 12, "var(--accent-dim)"],
  [15, 12, "var(--accent-dim)"],
  [9, 12, "var(--accent-dim)"],
  [12, 9, "var(--accent-dim)"],
  [12, 15, "var(--accent-dim)"],
] as const;

const PIXEL_SIZE = 3;
const WIDTH = Math.max(...PIXELS.map(([x]) => x)) + PIXEL_SIZE;
const HEIGHT = Math.max(...PIXELS.map(([, y]) => y)) + PIXEL_SIZE;

export default function PlumBlossomMark({ className }: { className?: string }) {
  const boxShadow = PIXELS.map(([x, y, color]) => `${x}px ${y}px 0 0 ${color}`).join(", ");

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        width: WIDTH,
        height: HEIGHT,
        background: "transparent",
        boxShadow,
      }}
    />
  );
}
