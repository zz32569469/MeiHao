import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

type Role = "core" | "rim" | "main";

const BASE_RADIUS = 5.2;
const AMPLITUDE = 1.4;
const CORE_RADIUS = 1.4;
const PIXEL = 2;

const COLOR: Record<Role, string> = {
  core: "#6b4420",
  rim: "#8f716d",
  main: "#b99490",
};

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

export default function Icon() {
  const cells = buildCells();
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const contentWidth = (maxX - minX + 1) * PIXEL;
  const contentHeight = (maxY - minY + 1) * PIXEL;
  const offsetX = Math.round((size.width - contentWidth) / 2);
  const offsetY = Math.round((size.height - contentHeight) / 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          position: "relative",
        }}
      >
        {cells.map(([x, y, role], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              position: "absolute",
              left: offsetX + (x - minX) * PIXEL,
              top: offsetY + (y - minY) * PIXEL,
              width: PIXEL,
              height: PIXEL,
              background: COLOR[role],
            }}
          />
        ))}
      </div>
    ),
    { ...size },
  );
}
