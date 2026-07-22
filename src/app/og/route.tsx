import { ImageResponse } from "next/og";
import { buildBlossomCells, type BlossomRole } from "@/lib/plumBlossomCells";

export const dynamic = "force-static";

const SIZE = { width: 1200, height: 630 };
const TEXT = "陳梅豪個人作品集";
const PIXEL = 10;

const BLOSSOM_COLOR: Record<BlossomRole, string> = {
  core: "#e8933f",
  rim: "#8f716d",
  main: "#c8752e",
};

async function loadNotoSerifTC(text: string, weight: number) {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@${weight}&text=${encodeURIComponent(text)}`,
    {
      headers: {
        // satori (used by next/og) can't parse woff2; this old Chrome UA
        // makes Google Fonts fall back to serving ttf instead.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
      },
    },
  );
  const css = await cssRes.text();
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error("Noto Serif TC font URL not found in Google Fonts response");
  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

export async function GET() {
  const fontData = await loadNotoSerifTC(TEXT, 700);

  const cells = buildBlossomCells();
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const markWidth = (maxX - minX + 1) * PIXEL;
  const markHeight = (maxY - minY + 1) * PIXEL;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "#16130f",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: markWidth,
            height: markHeight,
          }}
        >
          {cells.map(([x, y, role], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                position: "absolute",
                left: (x - minX) * PIXEL,
                top: (y - minY) * PIXEL,
                width: PIXEL,
                height: PIXEL,
                background: BLOSSOM_COLOR[role],
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Noto Serif TC",
              fontSize: 96,
              fontWeight: 700,
              color: "#e8ddc7",
              letterSpacing: 4,
            }}
          >
            陳梅豪
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Noto Serif TC",
              fontSize: 36,
              color: "#9a8c74",
            }}
          >
            個人作品集
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        {
          name: "Noto Serif TC",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
