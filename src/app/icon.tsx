import { ImageResponse } from "next/og";
import { buildBlossomCells, type BlossomRole } from "@/lib/plumBlossomCells";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const PIXEL = 2;

const COLOR: Record<BlossomRole, string> = {
  core: "#6b4420",
  rim: "#8f716d",
  main: "#b99490",
};

export default function Icon() {
  const cells = buildBlossomCells();
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
