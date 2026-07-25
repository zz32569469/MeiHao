import { project, pointsAttr, type Vec3 } from "./iso";

type Props = {
  origin: Vec3;
  size: Vec3;
  color: string;
  hovered?: boolean;
};

// Renders a grid-aligned box as 3 visible faces (top/right/front) of an
// isometric cube — same shade for all 3, just brightness-shifted per face
// so it still reads as a cube under any theme color.
export default function IsoCuboid({ origin, size, color, hovered = false }: Props) {
  const { x, y, z } = origin;
  const { x: w, y: d, z: h } = size;

  const b100 = project({ x: x + w, y, z });
  const b010 = project({ x, y: y + d, z });
  const b110 = project({ x: x + w, y: y + d, z });
  const t000 = project({ x, y, z: z + h });
  const t100 = project({ x: x + w, y, z: z + h });
  const t010 = project({ x, y: y + d, z: z + h });
  const t110 = project({ x: x + w, y: y + d, z: z + h });

  const stroke = hovered ? "var(--accent-strong)" : "none";
  const strokeWidth = hovered ? 2 : 0;

  return (
    <g style={{ transition: "filter 0.15s ease" }}>
      <polygon
        points={pointsAttr([t000, t100, t110, t010])}
        fill={color}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ filter: hovered ? "brightness(1.15)" : "brightness(1)" }}
      />
      <polygon
        points={pointsAttr([b100, b110, t110, t100])}
        fill={color}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ filter: hovered ? "brightness(0.95)" : "brightness(0.75)" }}
      />
      <polygon
        points={pointsAttr([b010, b110, t110, t010])}
        fill={color}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ filter: hovered ? "brightness(0.75)" : "brightness(0.55)" }}
      />
    </g>
  );
}
