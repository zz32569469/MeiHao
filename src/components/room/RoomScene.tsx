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
  monitor: "外接螢幕",
  hobby: "興趣收藏",
  wip: "筆電",
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

// 筆電規格——2026-07-26 以 Win32 WMI 實機掃描填入
const PC_SPECS: [string, string][] = [
  ["機型", "MSI Katana 15 B13VFK"],
  ["CPU", "Intel Core i5-13420H（8 核 / 12 緒）"],
  ["GPU", "GeForce RTX 4060 Laptop 8GB"],
  ["RAM", "32GB DDR5-5600（16GB×2）"],
  ["儲存", "2TB NVMe SSD（1TB×2, Gen4）"],
];

// 外接螢幕那組周邊（螢幕型號實機掃描，鍵鼠由使用者提供）
const PERIPHERALS: [string, string][] = [
  ["螢幕", "MSI G255F"],
  ["鍵盤", "HyperX Alloy Core"],
  ["滑鼠", "Logitech G502"],
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

  // ── 家具細節輔助（畫在可見面上，讓純色塊看起來像家具） ──────
  // 橫向凹槽：橫跨 右(+x) 與 前(+y) 面（抽屜分隔線）
  const grooveH = (x: number, y: number, w: number, d: number, zL: number) => {
    const a = pr(x + w, y, zL);
    const b = pr(x + w, y + d, zL);
    const c = pr(x, y + d, zL);
    return `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`;
  };
  // 前(+y)面上的直向凹槽（衣櫃對開門縫）
  const grooveV = (xPos: number, yFront: number, z0: number, z1: number) => {
    const a = pr(xPos, yFront, z0);
    const b = pr(xPos, yFront, z1);
    return `${a.x},${a.y} ${b.x},${b.y}`;
  };
  const groove = (key: string, points: string) => (
    <polyline key={key} points={points} fill="none" stroke="#000" strokeOpacity={0.22} strokeWidth={1.4} />
  );
  // 圓把手（給 3D 座標，可指定顏色；白櫃用粉紅）
  const knob = (key: string, x: number, y: number, z: number, color = "#000", op = 0.34) => {
    const p = pr(x, y, z);
    return <circle key={key} cx={p.x} cy={p.y} r={2.6} fill={color} fillOpacity={op} />;
  };
  // 橢圓凹槽把手：沿某方向畫一段圓頭粗線（藥丸狀）。dir=[dx,dy,dz] 是把手長軸方向。
  const pull = (key: string, x: number, y: number, z: number, dx: number, dy: number, dz: number) => {
    const a = pr(x - dx / 2, y - dy / 2, z - dz / 2);
    const b = pr(x + dx / 2, y + dy / 2, z + dz / 2);
    return <polyline key={key} points={`${a.x},${a.y} ${b.x},${b.y}`} fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth={5} strokeLinecap="round" />;
  };
  // 面上的直線凹槽（門縫/框線），給兩個 3D 端點
  const line3 = (key: string, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, op = 0.22) => {
    const a = pr(x0, y0, z0);
    const b = pr(x1, y1, z1);
    return <polyline key={key} points={`${a.x},${a.y} ${b.x},${b.y}`} fill="none" stroke="#000" strokeOpacity={op} strokeWidth={1.4} />;
  };
  // 凹格：把層架 +x 面上的一格挖進去（後壁 + 四內壁，用面明暗做透視，不加陰影特效）。
  // xF=前緣開口、xB=格子後壁，物品坐在 floor（z0）上、靠後擺就有「放進去」的立體感。
  const recess = (key: string, xF: number, xB: number, y0: number, y1: number, z0: number, z1: number) => (
    <g key={key}>
      {/* 後壁 */}
      <polygon points={pts(pr(xB, y0, z0), pr(xB, y1, z0), pr(xB, y1, z1), pr(xB, y0, z1))} fill="var(--accent-dim)" style={{ filter: "brightness(0.5)" }} />
      {/* 上內壁 */}
      <polygon points={pts(pr(xB, y0, z1), pr(xB, y1, z1), pr(xF, y1, z1), pr(xF, y0, z1))} fill="var(--accent-dim)" style={{ filter: "brightness(0.44)" }} />
      {/* 兩側內壁 */}
      <polygon points={pts(pr(xB, y0, z0), pr(xB, y0, z1), pr(xF, y0, z1), pr(xF, y0, z0))} fill="var(--accent-dim)" style={{ filter: "brightness(0.58)" }} />
      <polygon points={pts(pr(xB, y1, z0), pr(xB, y1, z1), pr(xF, y1, z1), pr(xF, y1, z0))} fill="var(--accent-dim)" style={{ filter: "brightness(0.54)" }} />
      {/* 底板（物品坐這） */}
      <polygon points={pts(pr(xB, y0, z0), pr(xB, y1, z0), pr(xF, y1, z0), pr(xF, y0, z0))} fill="var(--accent-dim)" style={{ filter: "brightness(0.66)" }} />
    </g>
  );

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
      {/* 門板內框 */}
      <polygon points={wallR(0.25, 0.95, 0.25, 1.9)} fill="none" stroke="#000" strokeOpacity={0.18} strokeWidth={1.4} />
      {/* 門把 */}
      {knob("door-k", 0.32, 0, 1.05)}
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

  // 衣櫃（高，對開門，氣氛擺設）
  add(
    "wardrobe",
    5.4,
    <g>
      <IsoCuboid origin={{ x: 3.9, y: 0, z: 0 }} size={{ x: 2.1, y: 0.9, z: 2.7 }} color="var(--accent-dim)" />
      {/* 對開門縫 */}
      {groove("wd-v", grooveV(4.95, 0.9, 0.1, 2.6))}
      {/* 門把 */}
      {knob("wd-k1", 4.75, 0.9, 1.35)}
      {knob("wd-k2", 5.15, 0.9, 1.35)}
    </g>,
  );

  // 白色四層小櫃子（4 抽，氣氛擺設）
  add(
    "dresser",
    7.15,
    <g>
      <IsoCuboid origin={{ x: 6.2, y: 0, z: 0 }} size={{ x: 1.1, y: 0.8, z: 1.4 }} color="var(--surface)" />
      {[0.35, 0.7, 1.05].map((z) => groove(`dr-g${z}`, grooveH(6.2, 0, 1.1, 0.8, z)))}
      {/* 抽屜面板框 */}
      {[
        [0.06, 0.29],
        [0.41, 0.64],
        [0.76, 0.99],
        [1.11, 1.34],
      ].map(([z0, z1], i) => (
        <polygon key={`dr-f${i}`} points={pts(pr(6.32, 0.8, z0), pr(7.18, 0.8, z0), pr(7.18, 0.8, z1), pr(6.32, 0.8, z1))} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={1.2} />
      ))}
      {[0.175, 0.525, 0.875, 1.225].map((z) => knob(`dr-k${z}`, 6.75, 0.8, z, "#cf9aa8", 0.9))}
    </g>,
  );

  // 高木櫃 → 作品集（下方大抽屜＋橢圓拉手、上方對開門櫃）
  add(
    "works",
    9.3,
    <g {...hotspotProps("works")}>
      <IsoCuboid origin={{ x: 7.5, y: 0, z: 0 }} size={{ x: 2.5, y: 1.1, z: 2.5 }} color="var(--accent-dim)" hovered={hovered === "works"} />
      {/* 下方 3 大抽屜（橢圓凹槽拉手） */}
      {[0.53, 1.06, 1.6].map((z) => groove(`wk-g${z}`, grooveH(7.5, 0, 2.5, 1.1, z)))}
      {[0.27, 0.8, 1.33].map((z) => pull(`wk-p${z}`, 8.75, 1.1, z, 0.55, 0, 0))}
      {/* 上方對開門櫃 */}
      {line3("wk-door", 8.75, 1.1, 1.66, 8.75, 1.1, 2.42)}
      <polygon points={pts(pr(7.72, 1.1, 1.74), pr(8.62, 1.1, 1.74), pr(8.62, 1.1, 2.38), pr(7.72, 1.1, 2.38))} fill="none" stroke="#000" strokeOpacity={0.18} strokeWidth={1.4} />
      <polygon points={pts(pr(8.88, 1.1, 1.74), pr(9.78, 1.1, 1.74), pr(9.78, 1.1, 2.38), pr(8.88, 1.1, 2.38))} fill="none" stroke="#000" strokeOpacity={0.18} strokeWidth={1.4} />
      {knob("wk-dk1", 8.62, 1.1, 2.02)}
      {knob("wk-dk2", 8.88, 1.1, 2.02)}
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

  // 掛包包的地方（左牆掛桿 + 吊著的背包，貼牆不突出）
  add(
    "rack",
    1.4,
    <g>
      {/* 牆上掛桿 */}
      <IsoCuboid origin={{ x: 0, y: 0.8, z: 1.58 }} size={{ x: 0.06, y: 0.96, z: 0.07 }} color="var(--line)" />
      {/* 黑色後背包 */}
      <IsoCuboid origin={{ x: 0.04, y: 0.92, z: 0.64 }} size={{ x: 0.28, y: 0.38, z: 0.88 }} color="var(--ink)" />
      {/* 背包前袋分線 */}
      {line3("rack-bp", 0.32, 0.92, 1.0, 0.32, 1.3, 1.0)}
      {/* 背包背帶（掛上桿） */}
      {line3("rack-st1", 0.32, 1.0, 1.52, 0.32, 1.0, 1.62, 0.4)}
      {line3("rack-st2", 0.32, 1.22, 1.52, 0.32, 1.22, 1.62, 0.4)}
      {/* 棕色側背包（較小） */}
      <IsoCuboid origin={{ x: 0.04, y: 1.38, z: 0.92 }} size={{ x: 0.22, y: 0.3, z: 0.58 }} color="#a9805a" />
      {/* 側背包背帶 */}
      {line3("rack-st3", 0.26, 1.52, 1.5, 0.26, 1.52, 1.62, 0.4)}
    </g>,
  );

  // ── 地板 ─────────────────────────────────────────
  // 筆電桌底座（依平面圖）：一側抽屜櫃(4抽) + 另一側開放腳空間 + 上方寬抽屜
  add(
    "deskbase",
    4.2,
    <g>
      <IsoCuboid origin={{ x: 0.2, y: 3.0, z: 0 }} size={{ x: 1.4, y: 1.8, z: 1.05 }} color="var(--accent)" />
      {/* 桌面下緣 */}
      {groove("desk-top", grooveH(0.2, 3.0, 1.4, 1.8, 0.92))}
      {/* 抽屜櫃（y3.05–3.55，4 抽疊起，圓把手） */}
      {line3("desk-ped-v", 1.6, 3.58, 0, 1.6, 3.58, 0.92)}
      {[0.23, 0.46, 0.69].map((z) => line3(`desk-ped-h${z}`, 1.6, 3.05, z, 1.6, 3.55, z))}
      {[0.11, 0.34, 0.57, 0.8].map((z) => knob(`desk-ped-k${z}`, 1.6, 3.3, z))}
      {/* 開放腳空間（y3.65–4.75）：平面暗色開口，不做透視凹陷 */}
      <polygon points={pts(pr(1.6, 3.65, 0.04), pr(1.6, 4.75, 0.04), pr(1.6, 4.75, 0.72), pr(1.6, 3.65, 0.72))} fill="#000" fillOpacity={0.26} />
      {/* 上方寬抽屜（腳空間上緣，圓把手） */}
      {line3("desk-pencil-h", 1.6, 3.65, 0.74, 1.6, 4.75, 0.74)}
      {knob("desk-pencil-k", 1.6, 4.2, 0.83)}
    </g>,
  );

  // 層架（有凹格） → 興趣收藏（貼左牆，格子開口朝 +x 面）
  add(
    "hobby",
    4.3,
    <g {...hotspotProps("hobby")}>
      <IsoCuboid origin={{ x: 0.2, y: 3.0, z: 1.05 }} size={{ x: 0.5, y: 1.8, z: 1.9 }} color="var(--accent-dim)" hovered={hovered === "hobby"} />
      {/* 凹格（依平面圖：3 排。前緣 0.7 挖進到後壁 0.42） */}
      {(
        [
          // 上排 3 格
          [3.05, 3.58, 2.4, 2.86],
          [3.68, 4.14, 2.4, 2.86],
          [4.24, 4.75, 2.4, 2.86],
          // 中排：寬左 + 小右
          [3.05, 4.02, 1.76, 2.28],
          [4.12, 4.75, 1.76, 2.28],
          // 下排：小左 + 寬中 + 小右
          [3.05, 3.5, 1.14, 1.64],
          [3.6, 4.3, 1.14, 1.64],
          [4.4, 4.75, 1.14, 1.64],
        ] as const
      ).map(([y0, y1, z0, z1], i) => recess(`cb${i}`, 0.7, 0.42, y0, y1, z0, z1))}
      {/* 各格小物件（貼近後壁、左右置中；頂端被格框稍微裁到沒關係） */}
      {/* 上排 */}
      <IsoCuboid origin={{ x: 0.43, y: 3.17, z: 2.4 }} size={{ x: 0.05, y: 0.28, z: 0.32 }} color="var(--surface)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 3.79, z: 2.4 }} size={{ x: 0.12, y: 0.24, z: 0.26 }} color="var(--ink)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 4.42, z: 2.4 }} size={{ x: 0.1, y: 0.14, z: 0.34 }} color="var(--surface)" hovered={hovered === "hobby"} />
      {/* 中排 */}
      <IsoCuboid origin={{ x: 0.43, y: 3.32, z: 1.76 }} size={{ x: 0.12, y: 0.18, z: 0.36 }} color="var(--status)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 3.6, z: 1.76 }} size={{ x: 0.12, y: 0.18, z: 0.38 }} color="#5f7391" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 4.36, z: 1.76 }} size={{ x: 0.12, y: 0.14, z: 0.38 }} color="var(--surface)" hovered={hovered === "hobby"} />
      {/* 下排 */}
      <IsoCuboid origin={{ x: 0.43, y: 3.17, z: 1.14 }} size={{ x: 0.14, y: 0.2, z: 0.3 }} color="#a9805a" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 3.76, z: 1.14 }} size={{ x: 0.05, y: 0.14, z: 0.38 }} color="var(--accent-strong)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 3.9, z: 1.14 }} size={{ x: 0.05, y: 0.14, z: 0.34 }} color="var(--status)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 4.04, z: 1.14 }} size={{ x: 0.05, y: 0.14, z: 0.38 }} color="var(--accent-dim)" hovered={hovered === "hobby"} />
      <IsoCuboid origin={{ x: 0.43, y: 4.49, z: 1.14 }} size={{ x: 0.12, y: 0.16, z: 0.24 }} color="var(--ink)" hovered={hovered === "hobby"} />
    </g>,
  );

  // 筆電（MSI Katana，螢幕面朝左牆；小巧精緻、看得出來就好）→ 筆電規格 + 進行中作品
  add(
    "wip",
    5.05,
    <g {...hotspotProps("wip")}>
      {/* 鍵盤底座（短一點、寬一點點） */}
      <IsoCuboid origin={{ x: 0.82, y: 3.62, z: 1.05 }} size={{ x: 0.5, y: 0.56, z: 0.06 }} color="var(--ink)" hovered={hovered === "wip"} />
      {/* 鍵盤區（頂面暗色，簡單就好） */}
      <polygon points={pts(pr(0.92, 3.68, 1.111), pr(1.2, 3.68, 1.111), pr(1.2, 4.12, 1.111), pr(0.92, 4.12, 1.111))} fill="#000" fillOpacity={0.4} />
      {/* 觸控板 */}
      <polygon points={pts(pr(1.22, 3.82, 1.112), pr(1.3, 3.82, 1.112), pr(1.3, 3.98, 1.112), pr(1.22, 3.98, 1.112))} fill="#fff" fillOpacity={0.1} stroke="#000" strokeOpacity={0.2} strokeWidth={0.8} />
      {/* 螢幕蓋（面朝牆 -x） */}
      <IsoCuboid origin={{ x: 0.82, y: 3.62, z: 1.11 }} size={{ x: 0.06, y: 0.56, z: 0.4 }} color="var(--ink)" hovered={hovered === "wip"} />
      {/* 蓋背 MSI 標記 */}
      {(() => {
        const p = pr(0.88, 3.9, 1.31);
        return <circle cx={p.x} cy={p.y} r={2.4} fill="#c0392b" />;
      })()}
    </g>,
  );

  // msi 外接螢幕（電腦推車，含外接鍵盤/滑鼠） → 即時動態
  add(
    "monitor",
    5.6,
    <g {...hotspotProps("monitor")}>
      <IsoCuboid origin={{ x: 1.8, y: 2.4, z: 0 }} size={{ x: 2.0, y: 0.8, z: 1.0 }} color="var(--surface)" hovered={hovered === "monitor"} />
      {/* 推車層板線 */}
      {groove("mon-g", grooveH(1.8, 2.4, 2.0, 0.8, 0.45))}
      {/* 螢幕在桌子後緣 */}
      <IsoCuboid origin={{ x: 2.2, y: 2.45, z: 1.0 }} size={{ x: 0.9, y: 0.12, z: 0.78 }} color="var(--ink)" hovered={hovered === "monitor"} />
      {/* 螢幕發光畫面（+y 面）+ 程式碼線條 */}
      <polygon
        points={pts(pr(2.28, 2.57, 1.1), pr(3.02, 2.57, 1.1), pr(3.02, 2.57, 1.68), pr(2.28, 2.57, 1.68))}
        fill="#26333f"
      />
      {[
        [1.58, 2.85],
        [1.5, 2.74],
        [1.42, 2.96],
        [1.34, 2.66],
        [1.26, 2.9],
      ].map(([z, xEnd], i) => {
        const a = pr(2.34, 2.57, z);
        const b = pr(xEnd, 2.57, z);
        return <polyline key={`sc${i}`} points={`${a.x},${a.y} ${b.x},${b.y}`} fill="none" stroke={i % 2 ? "#6f9ec4" : "#9ec9a8"} strokeOpacity={0.85} strokeWidth={1.4} />;
      })}
      {/* 動漫滑鼠墊（桌面 z=1.0） */}
      <polygon points={pts(pr(2.0, 2.85, 1.0), pr(3.62, 2.85, 1.0), pr(3.62, 3.18, 1.0), pr(2.0, 3.18, 1.0))} fill="var(--blossom)" />
      {/* 外接鍵盤 + 滑鼠在滑鼠墊上 */}
      <IsoCuboid origin={{ x: 2.1, y: 2.9, z: 1.0 }} size={{ x: 1.1, y: 0.28, z: 0.05 }} color="var(--ink)" hovered={hovered === "monitor"} />
      <IsoCuboid origin={{ x: 3.35, y: 2.95, z: 1.0 }} size={{ x: 0.18, y: 0.28, z: 0.06 }} color="var(--ink)" hovered={hovered === "monitor"} />
      {/* 水瓶 + 面紙盒（桌面後緣） */}
      <IsoCuboid origin={{ x: 1.92, y: 2.5, z: 1.0 }} size={{ x: 0.15, y: 0.15, z: 0.44 }} color="var(--surface)" />
      <IsoCuboid origin={{ x: 3.36, y: 2.5, z: 1.0 }} size={{ x: 0.32, y: 0.2, z: 0.16 }} color="var(--surface)" />
      {(() => {
        const p = pr(2.65, 2.57, 1.55);
        return <circle cx={p.x} cy={p.y} r={4} fill={STATUS_META[presence.status].color} />;
      })()}
    </g>,
  );

  // 木質扶手椅（面朝外接螢幕＝-y，椅背在靠鏡頭的 +y 側；我們主要看到木椅背）
  add(
    "chair",
    6.5,
    <g>
      {/* 椅腳（後腳先畫、前腳後畫） */}
      <IsoCuboid origin={{ x: 2.5, y: 3.72, z: 0 }} size={{ x: 0.09, y: 0.09, z: 0.48 }} color="var(--accent-dim)" />
      <IsoCuboid origin={{ x: 3.11, y: 3.72, z: 0 }} size={{ x: 0.09, y: 0.09, z: 0.48 }} color="var(--accent-dim)" />
      <IsoCuboid origin={{ x: 2.5, y: 4.29, z: 0 }} size={{ x: 0.09, y: 0.09, z: 0.48 }} color="var(--accent-dim)" />
      <IsoCuboid origin={{ x: 3.11, y: 4.29, z: 0 }} size={{ x: 0.09, y: 0.09, z: 0.48 }} color="var(--accent-dim)" />
      {/* 椅面框 */}
      <IsoCuboid origin={{ x: 2.48, y: 3.7, z: 0.48 }} size={{ x: 0.72, y: 0.68, z: 0.1 }} color="var(--accent)" />
      {/* 灰坐墊 */}
      <IsoCuboid origin={{ x: 2.54, y: 3.76, z: 0.58 }} size={{ x: 0.6, y: 0.56, z: 0.08 }} color="var(--muted)" />
      {/* 兩側扶手 */}
      <IsoCuboid origin={{ x: 2.48, y: 3.86, z: 0.66 }} size={{ x: 0.1, y: 0.46, z: 0.12 }} color="var(--accent)" />
      <IsoCuboid origin={{ x: 3.1, y: 3.86, z: 0.66 }} size={{ x: 0.1, y: 0.46, z: 0.12 }} color="var(--accent)" />
      {/* 灰背墊（在木背框前一點點） */}
      <IsoCuboid origin={{ x: 2.56, y: 4.22, z: 0.66 }} size={{ x: 0.58, y: 0.06, z: 0.52 }} color="var(--muted)" />
      {/* 木椅背框（近鏡頭、最後畫） */}
      <IsoCuboid origin={{ x: 2.46, y: 4.29, z: 0.55 }} size={{ x: 0.74, y: 0.11, z: 0.74 }} color="var(--accent)" />
    </g>,
  );

  // 床（淺木框：底座 + 床頭板 + 床尾板，藍格紋床墊；頭靠右牆側）
  add(
    "bed",
    11.0,
    <g>
      {/* 木底座（比床墊大一圈，露出木框） */}
      <IsoCuboid origin={{ x: 4.7, y: 2.7, z: 0 }} size={{ x: 5.0, y: 2.2, z: 0.32 }} color="var(--accent)" />
      {/* 床尾板（遠端、矮） */}
      <IsoCuboid origin={{ x: 4.7, y: 2.7, z: 0 }} size={{ x: 0.2, y: 2.2, z: 0.62 }} color="var(--accent)" />
      {/* 床墊 */}
      <IsoCuboid origin={{ x: 4.9, y: 2.82, z: 0.32 }} size={{ x: 4.62, y: 1.96, z: 0.5 }} color="#6f7d94" />
      {/* 床單格紋（頂面 z=0.82） */}
      {[6.1, 7.3, 8.5].map((gx) => {
        const a = pr(gx, 2.82, 0.82);
        const b = pr(gx, 4.78, 0.82);
        return <polyline key={`bx${gx}`} points={`${a.x},${a.y} ${b.x},${b.y}`} fill="none" stroke="#000" strokeOpacity={0.13} strokeWidth={1} />;
      })}
      {[3.4, 4.0, 4.6].map((gy) => {
        const a = pr(4.9, gy, 0.82);
        const b = pr(9.52, gy, 0.82);
        return <polyline key={`by${gy}`} points={`${a.x},${a.y} ${b.x},${b.y}`} fill="none" stroke="#000" strokeOpacity={0.13} strokeWidth={1} />;
      })}
      {/* 腳邊摺被 */}
      <IsoCuboid origin={{ x: 4.9, y: 2.85, z: 0.82 }} size={{ x: 0.85, y: 1.9, z: 0.16 }} color="#7f8ca6" />
      {/* 枕頭 */}
      <IsoCuboid origin={{ x: 8.5, y: 3.0, z: 0.82 }} size={{ x: 0.85, y: 1.5, z: 0.22 }} color="#adb8cd" />
      {/* 床頭板（近端、略高於床墊） */}
      <IsoCuboid origin={{ x: 9.5, y: 2.7, z: 0 }} size={{ x: 0.2, y: 2.2, z: 1.0 }} color="var(--accent)" />
    </g>,
  );

  // 小櫃子（床頭櫃，2 抽） → 聯絡我（在床頭後方，故深度需小於床，讓床蓋過重疊處）
  add(
    "contact",
    10.6,
    <g {...hotspotProps("contact")}>
      <IsoCuboid origin={{ x: 8.8, y: 1.9, z: 0 }} size={{ x: 1.2, y: 0.9, z: 0.95 }} color="var(--accent-dim)" hovered={hovered === "contact"} />
      {groove("ct-g", grooveH(8.8, 1.9, 1.2, 0.9, 0.5))}
      {pull("ct-p1", 9.4, 2.8, 0.26, 0.42, 0, 0)}
      {pull("ct-p2", 9.4, 2.8, 0.72, 0.42, 0, 0)}
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
        {/* 地板磁磚縫（畫在地板之後、家具之前，會被家具蓋住） */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gx) => {
          const a = pr(gx, 0, 0);
          const b = pr(gx, ROOM_D, 0);
          return <polyline key={`fx${gx}`} points={`${a.x},${a.y} ${b.x},${b.y}`} fill="none" stroke="#000" strokeOpacity={0.09} strokeWidth={1} />;
        })}
        {[1, 2, 3, 4].map((gy) => {
          const a = pr(0, gy, 0);
          const b = pr(ROOM_W, gy, 0);
          return <polyline key={`fy${gy}`} points={`${a.x},${a.y} ${b.x},${b.y}`} fill="none" stroke="#000" strokeOpacity={0.09} strokeWidth={1} />;
        })}
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

            {open === "monitor" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-xs tracking-wide text-muted uppercase">即時動態</h3>
                  <DiscordPresenceCard />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-xs tracking-wide text-muted uppercase">周邊</h3>
                  <dl className="border-2 border-line bg-bg">
                    {PERIPHERALS.map(([k, v], i) => (
                      <div
                        key={k}
                        className={`flex justify-between gap-4 px-4 py-2 font-mono text-sm ${i > 0 ? "border-t border-line" : ""}`}
                      >
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

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
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-xs tracking-wide text-muted uppercase">筆電規格</h3>
                  <dl className="border-2 border-line bg-bg">
                    {PC_SPECS.map(([k, v], i) => (
                      <div
                        key={k}
                        className={`flex justify-between gap-4 px-4 py-2 font-mono text-sm ${i > 0 ? "border-t border-line" : ""}`}
                      >
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-xs tracking-wide text-muted uppercase">進行中作品</h3>
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
                </div>
              </div>
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
