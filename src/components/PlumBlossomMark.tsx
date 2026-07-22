type Role = "core" | "rim" | "main";

const BASE_RADIUS = 5.2;
const AMPLITUDE = 1.4;
const CORE_RADIUS = 1.4;
const UNIT = 3;

function isFilled(dx: number, dy: number): boolean {
  const r = Math.sqrt(dx * dx + dy * dy);
  const theta = Math.atan2(-dy, dx);
  const radius = BASE_RADIUS + AMPLITUDE * Math.cos(5 * (theta - Math.PI / 2));
  return r <= radius;
}

function buildCells(): [number, number, Role][] {
  const range = Math.ceil(BASE_RADIUS + AMPLITUDE) + 1;
  const filled = new Set<string>();

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (isFilled(dx, dy)) filled.add(`${dx},${dy}`);
    }
  }

  const cells: [number, number, Role][] = [];
  filled.forEach((key) => {
    const [dx, dy] = key.split(",").map(Number);
    const r = Math.sqrt(dx * dx + dy * dy);
    let role: Role;
    if (r <= CORE_RADIUS) {
      role = "core";
    } else {
      const neighbors: [number, number][] = [
        [dx + 1, dy],
        [dx - 1, dy],
        [dx, dy + 1],
        [dx, dy - 1],
      ];
      const isRim = neighbors.some(([nx, ny]) => !filled.has(`${nx},${ny}`));
      role = isRim ? "rim" : "main";
    }
    cells.push([dx, dy, role]);
  });

  return cells;
}

const ROLE_COLOR: Record<Role, string> = {
  core: "var(--accent-dim)",
  rim: "var(--blossom-dim)",
  main: "var(--blossom)",
};

const CELLS = buildCells();
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
