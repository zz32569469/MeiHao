"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import IsoCuboid from "./IsoCuboid";
import { project } from "./iso";
import GameShowcase from "@/components/games/GameShowcase";
import DiscordPresenceCard from "./DiscordPresenceCard";
import { useDiscordPresence, STATUS_META } from "./useDiscordPresence";

const ROOM_W = 8;
const ROOM_D = 7;
const WALL_H = 3.6;

type HotspotId = "monitor" | "hobby" | "wip" | "works" | "contact" | "about";

const HOTSPOT_LABEL: Record<HotspotId, string> = {
  monitor: "即時動態",
  hobby: "興趣收藏",
  wip: "進行中作品",
  works: "作品集",
  contact: "聯絡我",
  about: "關於我",
};

// 熱點按鈕列的順序（含電燈開關這個直接切換、不開面板的特例）
const HOTSPOT_ORDER: HotspotId[] = ["monitor", "hobby", "wip", "works", "contact", "about"];

const HOBBY_ITEMS = [
  { name: "鋼彈模型（範例一）", built: "年份待補", note: "之後補上這隻的入手／組裝時間與心得。" },
  { name: "鋼彈模型（範例二）", built: "年份待補", note: "待補。" },
  { name: "鋼彈模型（範例三）", built: "年份待補", note: "待補。" },
];

const WIP_ITEMS = [
  {
    title: "個人網站・房間導覽版",
    status: "進行中",
    note: "把整個作品集做成可互動的房間，正在建家具與互動熱點。",
  },
  { title: "（下一個嘗試）", status: "構想中", note: "待補。" },
];

// ── 主題切換（跟 ThemeToggle 同一套 useSyncExternalStore） ──────────────
function themeSubscribe(cb: () => void) {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributeFilter: ["class"] });
  return () => o.disconnect();
}
function themeSnapshot() {
  return document.documentElement.classList.contains("dark");
}
function themeServerSnapshot() {
  return false;
}
function toggleTheme() {
  const dark = document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", !dark);
  localStorage.setItem("theme", !dark ? "dark" : "light");
}

export default function RoomScene() {
  const [hovered, setHovered] = useState<HotspotId | "switch" | null>(null);
  const [open, setOpen] = useState<HotspotId | null>(null);
  const isDark = useSyncExternalStore(themeSubscribe, themeSnapshot, themeServerSnapshot);
  const presence = useDiscordPresence();

  const pr = (x: number, y: number, z: number) => project({ x, y, z });
  const pts = (...arr: { x: number; y: number }[]) => arr.map((p) => `${p.x},${p.y}`).join(" ");

  const floor = pts(pr(0, 0, 0), pr(ROOM_W, 0, 0), pr(ROOM_W, ROOM_D, 0), pr(0, ROOM_D, 0));
  const rightWall = pts(pr(0, 0, 0), pr(ROOM_W, 0, 0), pr(ROOM_W, 0, WALL_H), pr(0, 0, WALL_H));
  const leftWall = pts(pr(0, 0, 0), pr(0, ROOM_D, 0), pr(0, ROOM_D, WALL_H), pr(0, 0, WALL_H));

  // 右牆（y=0 平面）上的矩形貼片
  const wallR = (x0: number, x1: number, z0: number, z1: number) =>
    pts(pr(x0, 0, z0), pr(x1, 0, z0), pr(x1, 0, z1), pr(x0, 0, z1));

  const hotspotProps = (id: HotspotId) => ({
    className: "cursor-pointer",
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onClick: () => setOpen(id),
  });

  // 每件家具帶一個 depth（footprint 中心的 x+y），小的先畫、大的後畫，
  // 讓等角視圖的前後遮擋正確，不用手動排 JSX 順序。
  const pieces: { key: string; depth: number; node: ReactNode }[] = [];
  const add = (key: string, depth: number, node: ReactNode) => pieces.push({ key, depth, node });

  // 窗戶 + 窗簾（右牆貼片，最遠）
  add(
    "window",
    0.1,
    <g>
      <polygon points={wallR(2.2, 4.4, 1.4, 3.0)} fill="var(--surface)" style={{ filter: "brightness(0.7)" }} />
      <polygon points={wallR(2.2, 2.9, 1.4, 3.0)} fill="var(--muted)" style={{ filter: "brightness(0.9)" }} />
      <polygon points={wallR(3.7, 4.4, 1.4, 3.0)} fill="var(--muted)" style={{ filter: "brightness(0.9)" }} />
    </g>,
  );

  // 冷氣（窗戶上方）
  add(
    "ac",
    0.12,
    <IsoCuboid origin={{ x: 2.6, y: 0, z: 3.05 }} size={{ x: 1.3, y: 0.3, z: 0.35 }} color="var(--surface)" />,
  );

  // 牆上便條 + 星星 → 關於我
  add(
    "about",
    0.2,
    <g {...hotspotProps("about")}>
      <polygon
        points={wallR(0.5, 1.5, 2.2, 3.0)}
        fill="var(--surface)"
        stroke={hovered === "about" ? "var(--accent-strong)" : "var(--line)"}
        strokeWidth={hovered === "about" ? 3 : 1.5}
      />
      {[
        [0.75, 2.05],
        [1.25, 2.45],
        [0.95, 3.15],
      ].map(([sx, sz], i) => {
        const p = pr(sx, 0, sz);
        return <circle key={i} cx={p.x} cy={p.y} r={hovered === "about" ? 4 : 3} fill="var(--accent)" />;
      })}
    </g>,
  );

  // 電燈開關 → 亮／暗切換（不開面板，直接 toggle）
  add(
    "switch",
    0.15,
    <g
      className="cursor-pointer"
      onMouseEnter={() => setHovered("switch")}
      onMouseLeave={() => setHovered(null)}
      onClick={toggleTheme}
    >
      <polygon
        points={wallR(4.7, 5.0, 1.5, 2.0)}
        fill="var(--surface)"
        stroke={hovered === "switch" ? "var(--accent-strong)" : "var(--line)"}
        strokeWidth={hovered === "switch" ? 3 : 1.5}
      />
      {(() => {
        // 亮色模式 = 開燈（發光的琥珀點），暗色模式 = 關燈（暗點）
        const p = pr(4.85, 0, isDark ? 1.62 : 1.88);
        return <circle cx={p.x} cy={p.y} r={4} fill={isDark ? "var(--line)" : "var(--accent-strong)"} />;
      })()}
    </g>,
  );

  // 書桌 + 層架（鋼彈/公仔） → 興趣收藏
  add(
    "hobby",
    2.2,
    <g {...hotspotProps("hobby")}>
      <IsoCuboid
        origin={{ x: 0, y: 0.9, z: 0 }}
        size={{ x: 1.3, y: 1.6, z: 1.05 }}
        color="var(--accent)"
        hovered={hovered === "hobby"}
      />
      <IsoCuboid
        origin={{ x: 0, y: 0.9, z: 1.05 }}
        size={{ x: 0.5, y: 1.6, z: 1.95 }}
        color="var(--accent-dim)"
        hovered={hovered === "hobby"}
      />
      {/* 層架上的模型 */}
      <IsoCuboid origin={{ x: 0.12, y: 1.0, z: 1.05 }} size={{ x: 0.24, y: 0.24, z: 0.42 }} color="var(--blossom)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.12, y: 1.55, z: 1.05 }} size={{ x: 0.24, y: 0.24, z: 0.5 }} color="var(--accent-strong)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.12, y: 1.15, z: 2.1 }} size={{ x: 0.22, y: 0.22, z: 0.42 }} color="var(--status)" hovered={hovered === "hobby"} />
    </g>,
  );

  // 筆電 + 文件（桌前） → 進行中作品
  add(
    "wip",
    2.95,
    <g {...hotspotProps("wip")}>
      <IsoCuboid origin={{ x: 0.6, y: 1.95, z: 1.05 }} size={{ x: 0.55, y: 0.38, z: 0.05 }} color="var(--ink)" hovered={hovered === "wip"} />
      <IsoCuboid origin={{ x: 0.6, y: 1.95, z: 1.1 }} size={{ x: 0.55, y: 0.05, z: 0.34 }} color="var(--ink)" hovered={hovered === "wip"} />
      {/* 桌上文件 */}
      <IsoCuboid origin={{ x: 0.75, y: 2.4, z: 1.05 }} size={{ x: 0.35, y: 0.28, z: 0.03 }} color="var(--surface)" hovered={hovered === "wip"} />
    </g>,
  );

  // 電腦推車 + MSI 螢幕 → 即時動態
  add(
    "monitor",
    4.15,
    <g {...hotspotProps("monitor")}>
      <IsoCuboid origin={{ x: 0, y: 3.1, z: 0 }} size={{ x: 1.0, y: 1.1, z: 1.05 }} color="var(--surface)" hovered={hovered === "monitor"} />
      <IsoCuboid origin={{ x: 0.15, y: 3.35, z: 1.05 }} size={{ x: 0.7, y: 0.12, z: 0.78 }} color="var(--ink)" hovered={hovered === "monitor"} />
      {/* 螢幕上的即時狀態小點 */}
      {(() => {
        const p = pr(0.5, 3.35, 1.55);
        return (
          <>
            <circle cx={p.x} cy={p.y} r={5} fill={STATUS_META[presence.status].color} />
            {presence.game && (
              <text x={p.x + 10} y={p.y + 4} fontSize={11} fontFamily="monospace" fill="var(--on-accent)">
                ●
              </text>
            )}
          </>
        );
      })()}
    </g>,
  );

  // 床（地板，窗前）— 氣氛擺設
  add(
    "bed",
    4.9,
    <g>
      <IsoCuboid origin={{ x: 1.7, y: 0.6, z: 0 }} size={{ x: 2.6, y: 2.8, z: 0.55 }} color="#6f7d94" />
      <IsoCuboid origin={{ x: 1.85, y: 0.75, z: 0.55 }} size={{ x: 0.95, y: 0.55, z: 0.22 }} color="#93a1bd" />
    </g>,
  );

  // 床頭櫃 → 聯絡我
  add(
    "contact",
    5.4,
    <g {...hotspotProps("contact")}>
      <IsoCuboid origin={{ x: 4.5, y: 0, z: 0 }} size={{ x: 1.0, y: 0.9, z: 0.95 }} color="var(--accent-dim)" hovered={hovered === "contact"} />
    </g>,
  );

  // 吊衣架 — 氣氛擺設
  add(
    "rack",
    5.8,
    <g>
      <IsoCuboid origin={{ x: 0.1, y: 4.9, z: 0 }} size={{ x: 0.7, y: 0.12, z: 2.1 }} color="var(--line)" />
      <IsoCuboid origin={{ x: 0, y: 4.75, z: 0.6 }} size={{ x: 0.9, y: 0.9, z: 1.35 }} color="var(--muted)" />
    </g>,
  );

  // 高抽屜櫃（作品集，上面不放東西）
  add(
    "works",
    7.0,
    <g {...hotspotProps("works")}>
      <IsoCuboid origin={{ x: 5.9, y: 0, z: 0 }} size={{ x: 1.3, y: 1.0, z: 2.5 }} color="var(--accent-dim)" hovered={hovered === "works"} />
    </g>,
  );

  pieces.sort((a, b) => a.depth - b.depth);

  const activeLabel = open ? HOTSPOT_LABEL[open] : null;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        viewBox="-300 -170 660 520"
        preserveAspectRatio="xMidYMid meet"
        className="h-[75vh] max-h-[780px] w-full max-w-[1400px]"
      >
        <polygon points={rightWall} fill="var(--surface)" style={{ filter: "brightness(0.9)" }} />
        <polygon points={leftWall} fill="var(--surface)" style={{ filter: "brightness(0.78)" }} />
        <polygon points={floor} fill="var(--line)" style={{ filter: "brightness(0.72)" }} />
        {pieces.map((p) => (
          <g key={p.key}>{p.node}</g>
        ))}
      </svg>

      <div className="flex flex-wrap justify-center gap-2 font-mono text-xs tracking-wide text-muted">
        {HOTSPOT_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setOpen(id)}
            className={`border-2 px-3 py-1.5 uppercase ${
              hovered === id ? "border-accent text-ink" : "border-line hover:text-ink"
            }`}
          >
            {HOTSPOT_LABEL[id]}
          </button>
        ))}
        <button
          type="button"
          onMouseEnter={() => setHovered("switch")}
          onMouseLeave={() => setHovered(null)}
          onClick={toggleTheme}
          className={`border-2 px-3 py-1.5 uppercase ${
            hovered === "switch" ? "border-accent text-ink" : "border-line hover:text-ink"
          }`}
        >
          亮／暗切換
        </button>
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

            {open === "monitor" && <DiscordPresenceCard />}

            {open === "hobby" && (
              <ul className="flex flex-col gap-4">
                {HOBBY_ITEMS.map((item) => (
                  <li key={item.name} className="border-2 border-line bg-bg p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-ink">{item.name}</span>
                      <span className="font-mono text-xs text-muted">{item.built}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </li>
                ))}
              </ul>
            )}

            {open === "wip" && (
              <ul className="flex flex-col gap-4">
                {WIP_ITEMS.map((item) => (
                  <li key={item.title} className="border-2 border-line bg-bg p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-ink">{item.title}</span>
                      <span className="border border-accent px-1.5 py-0.5 font-mono text-xs text-accent">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </li>
                ))}
              </ul>
            )}

            {open === "works" && <GameShowcase />}

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

            {open === "about" && (
              <p className="text-muted">
                愛玩遊戲的軟體工程師，正在學習使用 AI 做自己想做的事情。自我介紹還在整理，之後會補上。
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
