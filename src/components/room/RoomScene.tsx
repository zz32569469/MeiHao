"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import IsoCuboid from "./IsoCuboid";
import { project } from "./iso";
import GameShowcase from "@/components/games/GameShowcase";
import DiscordPresenceCard from "./DiscordPresenceCard";
import { useDiscordPresence, STATUS_META } from "./useDiscordPresence";

// 依使用者手繪平面圖：寬淺的房間，後牆放門/衣櫃/白色小櫃/高木櫃，
// 左牆放吊衣架，右牆放小櫃子，地板中央擺筆電桌/msi 螢幕/床。
// 座標系：gridX 0→W 對應平面圖左→右，gridY 0→D 對應平面圖上（後牆）→下。
const ROOM_W = 10;
const ROOM_D = 5;
const WALL_H = 3.4;

type HotspotId = "monitor" | "hobby" | "wip" | "works" | "contact" | "about";

const HOTSPOT_LABEL: Record<HotspotId, string> = {
  monitor: "即時動態",
  hobby: "興趣收藏",
  wip: "進行中作品",
  works: "作品集",
  contact: "聯絡我",
  about: "關於我",
};

const HOTSPOT_ORDER: HotspotId[] = ["monitor", "hobby", "wip", "works", "contact", "about"];

const HOBBY_ITEMS = [
  { name: "RG 攻擊鋼彈", built: "年份待補", note: "" },
  { name: "HG 鋼彈", built: "年份待補", note: "" },
  { name: "HG 風靈", built: "年份待補", note: "" },
  { name: "RG 紅異端", built: "年份待補", note: "" },
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

  // 後牆（y=0 平面）上的矩形貼片
  const wallR = (x0: number, x1: number, z0: number, z1: number) =>
    pts(pr(x0, 0, z0), pr(x1, 0, z0), pr(x1, 0, z1), pr(x0, 0, z1));

  // 右牆（x=0 平面）上的矩形貼片
  const wallL = (y0: number, y1: number, z0: number, z1: number) =>
    pts(pr(0, y0, z0), pr(0, y1, z0), pr(0, y1, z1), pr(0, y0, z1));

  const hotspotProps = (id: HotspotId) => ({
    className: "cursor-pointer",
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onClick: () => setOpen(id),
  });

  // 每件家具帶一個 depth，小的先畫、大的後畫，讓等角視圖前後遮擋正確。
  const pieces: { key: string; depth: number; node: ReactNode }[] = [];
  const add = (key: string, depth: number, node: ReactNode) => pieces.push({ key, depth, node });

  // 視角：畫「後牆(y=0) + 左牆(x=0)」。gridX=0 貼左牆（筆電桌那面），
  // gridX 往大 = 往右牆（床頭櫃/窗那面，近鏡頭、不畫）；gridY=0 貼後牆。
  // 窗戶在右牆，這個角度看不到，先不放。

  // ── 後牆（y=0） ───────────────────────────────────
  // 門（窄，左緣貼齊左牆角）
  add(
    "door",
    0.6,
    <g>
      <polygon points={wallR(0.1, 1.1, 0, 2.1)} fill="var(--accent-dim)" style={{ filter: "brightness(0.6)" }} />
      <polygon points={wallR(0.1, 1.1, 0, 2.1)} fill="none" stroke="var(--line)" strokeWidth={2} />
    </g>,
  );

  // 電燈開關 → 亮／暗切換（門旁邊）
  add(
    "switch",
    1.65,
    <g
      className="cursor-pointer"
      onMouseEnter={() => setHovered("switch")}
      onMouseLeave={() => setHovered(null)}
      onClick={toggleTheme}
    >
      <polygon
        points={wallR(1.5, 1.8, 1.4, 1.95)}
        fill="var(--surface)"
        stroke={hovered === "switch" ? "var(--accent-strong)" : "var(--line)"}
        strokeWidth={hovered === "switch" ? 3 : 1.5}
      />
      {(() => {
        const p = pr(1.65, 0, isDark ? 1.55 : 1.82);
        return <circle cx={p.x} cy={p.y} r={4} fill={isDark ? "var(--line)" : "var(--accent-strong)"} />;
      })()}
    </g>,
  );

  // 衣櫃（高，氣氛擺設）
  add(
    "wardrobe",
    5.4,
    <IsoCuboid origin={{ x: 3.9, y: 0, z: 0 }} size={{ x: 2.1, y: 0.9, z: 2.7 }} color="var(--accent-dim)" />,
  );

  // 白色四層小櫃子（氣氛擺設）
  add(
    "dresser",
    7.15,
    <IsoCuboid origin={{ x: 6.2, y: 0, z: 0 }} size={{ x: 1.1, y: 0.8, z: 1.4 }} color="var(--surface)" />,
  );

  // 高木櫃 → 作品集（右後角）
  add(
    "works",
    9.3,
    <g {...hotspotProps("works")}>
      <IsoCuboid origin={{ x: 7.5, y: 0, z: 0 }} size={{ x: 2.5, y: 1.1, z: 2.5 }} color="var(--accent-dim)" hovered={hovered === "works"} />
    </g>,
  );

  // ── 左牆（x=0） ───────────────────────────────────
  // 牆上便條 + 星星 → 關於我（書桌那面牆）
  add(
    "about",
    2.4,
    <g {...hotspotProps("about")}>
      <polygon
        points={wallL(2.0, 2.8, 2.0, 2.8)}
        fill="var(--surface)"
        stroke={hovered === "about" ? "var(--accent-strong)" : "var(--line)"}
        strokeWidth={hovered === "about" ? 3 : 1.5}
      />
      {[
        [2.2, 1.85],
        [2.6, 2.25],
        [2.35, 2.95],
      ].map(([sy, sz], i) => {
        const p = pr(0, sy, sz);
        return <circle key={i} cx={p.x} cy={p.y} r={hovered === "about" ? 4 : 3} fill="var(--accent)" />;
      })}
    </g>,
  );

  // 掛包包的地方（壓扁、貼左牆）
  add(
    "rack",
    1.4,
    <g>
      <IsoCuboid origin={{ x: 0, y: 0.9, z: 0 }} size={{ x: 0.15, y: 0.6, z: 2.0 }} color="var(--line)" />
      <IsoCuboid origin={{ x: 0.05, y: 1.05, z: 0.8 }} size={{ x: 0.35, y: 0.5, z: 0.95 }} color="var(--muted)" />
    </g>,
  );

  // ── 地板 ─────────────────────────────────────────
  // 筆電桌底座（氣氛，鋼彈層架與筆電疊在上面）
  add(
    "deskbase",
    4.2,
    <IsoCuboid origin={{ x: 0.2, y: 3.0, z: 0 }} size={{ x: 1.4, y: 1.8, z: 1.05 }} color="var(--accent)" />,
  );

  // 鋼彈層架 → 興趣收藏（貼左牆）
  add(
    "hobby",
    4.3,
    <g {...hotspotProps("hobby")}>
      <IsoCuboid origin={{ x: 0.2, y: 3.0, z: 1.05 }} size={{ x: 0.5, y: 1.8, z: 1.9 }} color="var(--accent-dim)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.3, y: 3.15, z: 1.05 }} size={{ x: 0.24, y: 0.24, z: 0.42 }} color="var(--blossom)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.3, y: 3.75, z: 1.05 }} size={{ x: 0.24, y: 0.24, z: 0.5 }} color="var(--accent-strong)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.3, y: 3.3, z: 2.1 }} size={{ x: 0.22, y: 0.22, z: 0.42 }} color="var(--status)" hovered={hovered === "hobby"} />
    </g>,
  );

  // 筆電 + 文件 → 進行中作品（螢幕面朝左牆）
  add(
    "wip",
    5.05,
    <g {...hotspotProps("wip")}>
      <IsoCuboid origin={{ x: 0.85, y: 3.7, z: 1.05 }} size={{ x: 0.6, y: 0.42, z: 0.05 }} color="var(--ink)" hovered={hovered === "wip"} />
      <IsoCuboid origin={{ x: 0.85, y: 3.7, z: 1.1 }} size={{ x: 0.05, y: 0.42, z: 0.36 }} color="var(--ink)" hovered={hovered === "wip"} />
      <IsoCuboid origin={{ x: 0.95, y: 4.25, z: 1.05 }} size={{ x: 0.35, y: 0.3, z: 0.03 }} color="var(--surface)" hovered={hovered === "wip"} />
    </g>,
  );

  // msi 外接螢幕（電腦推車，含外接鍵盤/滑鼠） → 即時動態
  add(
    "monitor",
    5.6,
    <g {...hotspotProps("monitor")}>
      <IsoCuboid origin={{ x: 1.8, y: 2.4, z: 0 }} size={{ x: 2.0, y: 0.8, z: 1.0 }} color="var(--surface)" hovered={hovered === "monitor"} />
      {/* 螢幕在桌子後緣 */}
      <IsoCuboid origin={{ x: 2.2, y: 2.45, z: 1.0 }} size={{ x: 0.9, y: 0.12, z: 0.78 }} color="var(--ink)" hovered={hovered === "monitor"} />
      {/* 外接鍵盤 + 滑鼠在桌面 */}
      <IsoCuboid origin={{ x: 2.1, y: 2.9, z: 1.0 }} size={{ x: 1.1, y: 0.28, z: 0.05 }} color="var(--ink)" hovered={hovered === "monitor"} />
      <IsoCuboid origin={{ x: 3.35, y: 2.95, z: 1.0 }} size={{ x: 0.18, y: 0.28, z: 0.06 }} color="var(--ink)" hovered={hovered === "monitor"} />
      {(() => {
        const p = pr(2.65, 2.45, 1.5);
        return <circle cx={p.x} cy={p.y} r={5} fill={STATUS_META[presence.status].color} />;
      })()}
    </g>,
  );

  // 床（頭靠右牆側）
  add(
    "bed",
    11.0,
    <g>
      <IsoCuboid origin={{ x: 4.8, y: 2.8, z: 0 }} size={{ x: 4.8, y: 2.0, z: 0.55 }} color="#6f7d94" />
      <IsoCuboid origin={{ x: 8.4, y: 2.95, z: 0.55 }} size={{ x: 0.9, y: 0.6, z: 0.22 }} color="#93a1bd" />
    </g>,
  );

  // 小櫃子（床頭櫃） → 聯絡我（在床頭後方，故深度需小於床，讓床蓋過重疊處）
  add(
    "contact",
    10.6,
    <g {...hotspotProps("contact")}>
      <IsoCuboid origin={{ x: 8.8, y: 1.9, z: 0 }} size={{ x: 1.2, y: 0.9, z: 0.95 }} color="var(--accent-dim)" hovered={hovered === "contact"} />
    </g>,
  );

  pieces.sort((a, b) => a.depth - b.depth);

  const activeLabel = open ? HOTSPOT_LABEL[open] : null;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        viewBox="-240 -175 700 530"
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
                    {item.note && <p className="mt-1 text-sm text-muted">{item.note}</p>}
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
