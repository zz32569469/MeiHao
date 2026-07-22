import { buildBlossomCells, type BlossomRole } from "@/lib/plumBlossomCells";

const UNIT = 3;

const ROLE_COLOR: Record<BlossomRole, string> = {
  core: "var(--accent-dim)",
  rim: "var(--blossom-dim)",
  main: "var(--blossom)",
};

const CELLS = buildBlossomCells();
const MIN_X = Math.min(...CELLS.map(([x]) => x));
const MIN_Y = Math.min(...CELLS.map(([, y]) => y));
const MAX_X = Math.max(...CELLS.map(([x]) => x));
const MAX_Y = Math.max(...CELLS.map(([, y]) => y));
const WIDTH = (MAX_X - MIN_X + 1) * UNIT;
const HEIGHT = (MAX_Y - MIN_Y + 1) * UNIT;

const BOX_SHADOW = CELLS.map(
  ([x, y, role]) =>
    `${(x - MIN_X) * UNIT}px ${(y - MIN_Y) * UNIT}px 0 0 ${ROLE_COLOR[role]}`,
).join(", ");

export default function PlumBlossomMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", position: "relative", width: WIDTH, height: HEIGHT }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: UNIT,
          height: UNIT,
          background: "transparent",
          boxShadow: BOX_SHADOW,
        }}
      />
    </span>
  );
}
