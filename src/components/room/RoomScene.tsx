"use client";

import { useState } from "react";
import IsoCuboid from "./IsoCuboid";
import { project, pointsAttr } from "./iso";
import GameShowcase from "@/components/games/GameShowcase";

const ROOM_W = 6;
const ROOM_D = 6;
const WALL_H = 3.4;

type HotspotId = "about" | "projects" | "contact";

const HOTSPOTS: { id: HotspotId; label: string }[] = [
  { id: "about", label: "關於我" },
  { id: "projects", label: "作品集" },
  { id: "contact", label: "聯絡我" },
];

export default function RoomScene() {
  const [hovered, setHovered] = useState<HotspotId | null>(null);
  const [open, setOpen] = useState<HotspotId | null>(null);

  const floor = pointsAttr([
    project({ x: 0, y: 0, z: 0 }),
    project({ x: ROOM_W, y: 0, z: 0 }),
    project({ x: ROOM_W, y: ROOM_D, z: 0 }),
    project({ x: 0, y: ROOM_D, z: 0 }),
  ]);
  const leftWall = pointsAttr([
    project({ x: 0, y: 0, z: 0 }),
    project({ x: 0, y: ROOM_D, z: 0 }),
    project({ x: 0, y: ROOM_D, z: WALL_H }),
    project({ x: 0, y: 0, z: WALL_H }),
  ]);
  const backWall = pointsAttr([
    project({ x: 0, y: 0, z: 0 }),
    project({ x: ROOM_W, y: 0, z: 0 }),
    project({ x: ROOM_W, y: 0, z: WALL_H }),
    project({ x: 0, y: 0, z: WALL_H }),
  ]);

  const activeLabel = HOTSPOTS.find((h) => h.id === open)?.label;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="-280 -200 560 480" className="w-full max-w-2xl">
        <polygon points={backWall} fill="var(--surface)" style={{ filter: "brightness(0.9)" }} />
        <polygon points={leftWall} fill="var(--surface)" style={{ filter: "brightness(0.78)" }} />
        <polygon points={floor} fill="var(--line)" style={{ filter: "brightness(0.75)" }} />

        {/* 書桌＋螢幕 → 關於我 */}
        <g
          onMouseEnter={() => setHovered("about")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setOpen("about")}
          className="cursor-pointer"
        >
          <IsoCuboid
            origin={{ x: 1, y: 3.4, z: 0 }}
            size={{ x: 2, y: 1, z: 0.7 }}
            color="var(--accent)"
            hovered={hovered === "about"}
          />
          <IsoCuboid
            origin={{ x: 1.7, y: 3.5, z: 0.7 }}
            size={{ x: 0.6, y: 0.12, z: 0.5 }}
            color="var(--ink)"
            hovered={hovered === "about"}
          />
        </g>

        {/* 書櫃 → 作品集 */}
        <g
          onMouseEnter={() => setHovered("projects")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setOpen("projects")}
          className="cursor-pointer"
        >
          <IsoCuboid
            origin={{ x: 4.3, y: 0.3, z: 0 }}
            size={{ x: 1.2, y: 0.6, z: 2.6 }}
            color="var(--accent-dim)"
            hovered={hovered === "projects"}
          />
        </g>

        {/* 邊桌＋盆栽 → 聯絡我 */}
        <g
          onMouseEnter={() => setHovered("contact")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setOpen("contact")}
          className="cursor-pointer"
        >
          <IsoCuboid
            origin={{ x: 0.4, y: 0.6, z: 0 }}
            size={{ x: 0.8, y: 0.8, z: 0.6 }}
            color="var(--accent)"
            hovered={hovered === "contact"}
          />
          <IsoCuboid
            origin={{ x: 0.55, y: 0.75, z: 0.6 }}
            size={{ x: 0.5, y: 0.5, z: 0.5 }}
            color="var(--blossom)"
            hovered={hovered === "contact"}
          />
        </g>
      </svg>

      <div className="flex flex-wrap justify-center gap-3 font-mono text-xs tracking-wide text-muted">
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            type="button"
            onMouseEnter={() => setHovered(h.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setOpen(h.id)}
            className={`border-2 px-3 py-1.5 uppercase ${
              hovered === h.id ? "border-accent text-ink" : "border-line hover:text-ink"
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto border-2 border-line bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-ink">{activeLabel}</h2>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="關閉"
                className="border-2 border-line px-2 py-1 font-mono text-xs text-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            {open === "about" && (
              <p className="text-muted">
                愛玩遊戲的軟體工程師，正在學習使用 AI 做自己想做的事情。自我介紹還在整理，之後會補上。
              </p>
            )}
            {open === "projects" && <GameShowcase />}
            {open === "contact" && (
              <ul className="flex flex-col gap-2 font-mono text-sm">
                <li>
                  <a href="mailto:zz32569469@gmail.com" className="text-accent hover:text-accent-strong">
                    [ EMAIL ] zz32569469@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/zz32569469"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-strong"
                  >
                    [ GITHUB ] github.com/zz32569469
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
