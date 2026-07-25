export type Vec3 = { x: number; y: number; z: number };

// 2:1 isometric projection — x/y are floor-plane grid units, z is height.
export const TILE_W = 80;
export const TILE_H = 40;
export const UNIT_H = 40;

export function project({ x, y, z }: Vec3) {
  return {
    x: (x - y) * (TILE_W / 2),
    y: (x + y) * (TILE_H / 2) - z * UNIT_H,
  };
}

export function pointsAttr(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}
