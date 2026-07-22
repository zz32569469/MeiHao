export type BlossomRole = "core" | "rim" | "main";

const BASE_RADIUS = 5.2;
const AMPLITUDE = 1.4;
const CORE_RADIUS = 1.4;

function isFilled(dx: number, dy: number): boolean {
  const r = Math.sqrt(dx * dx + dy * dy);
  const theta = Math.atan2(-dy, dx);
  const radius = BASE_RADIUS + AMPLITUDE * Math.cos(5 * (theta - Math.PI / 2));
  return r <= radius;
}

// Pixel cells for the site's plum blossom mark: a 5-lobed polar curve
// (r <= base + amplitude*cos(5*theta)) so petals form one connected
// silhouette instead of 5 separate blobs, plus a rim pass to darken
// boundary pixels for edge definition. Shared by PlumBlossomMark,
// icon.tsx (favicon), and opengraph-image.tsx so the mark stays
// pixel-identical everywhere it appears.
export function buildBlossomCells(): [number, number, BlossomRole][] {
  const range = Math.ceil(BASE_RADIUS + AMPLITUDE) + 1;
  const filled = new Set<string>();

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (isFilled(dx, dy)) filled.add(`${dx},${dy}`);
    }
  }

  const cells: [number, number, BlossomRole][] = [];
  filled.forEach((key) => {
    const [dx, dy] = key.split(",").map(Number);
    const r = Math.sqrt(dx * dx + dy * dy);
    let role: BlossomRole;
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
