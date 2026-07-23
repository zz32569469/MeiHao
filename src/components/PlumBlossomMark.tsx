import { buildBlossomCells, type BlossomRole } from "@/lib/plumBlossomCells";

const DEFAULT_UNIT = 3;

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

export default function PlumBlossomMark({
  className,
  unit = DEFAULT_UNIT,
}: {
  className?: string;
  unit?: number;
}) {
  const width = (MAX_X - MIN_X + 1) * unit;
  const height = (MAX_Y - MIN_Y + 1) * unit;
  const boxShadow = CELLS.map(
    ([x, y, role]) => `${(x - MIN_X) * unit}px ${(y - MIN_Y) * unit}px 0 0 ${ROLE_COLOR[role]}`,
  ).join(", ");

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", position: "relative", width, height }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: unit,
          height: unit,
          background: "transparent",
          boxShadow,
        }}
      />
    </span>
  );
}
