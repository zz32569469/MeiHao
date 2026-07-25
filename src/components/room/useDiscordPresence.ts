"use client";

import { useEffect, useState } from "react";

// 一次性設定：加入 discord.gg/lanyard 後，把 Discord 使用者 ID 填進來，
// 卡片就會自動從示範資料切換成即時狀態。留空 = 用下面的 MOCK。
export const DISCORD_USER_ID = "";

export type PresenceStatus = "online" | "idle" | "dnd" | "offline";

export type Presence = {
  status: PresenceStatus;
  game: string | null;
  detail: string | null;
  live: boolean;
};

const MOCK: Presence = {
  status: "online",
  game: "FINAL FANTASY XIV",
  detail: "在艾歐澤亞冒險中",
  live: false,
};

type LanyardActivity = { type: number; name?: string; details?: string; state?: string };

export const STATUS_META: Record<PresenceStatus, { label: string; color: string }> = {
  online: { label: "線上", color: "#3ba55d" },
  idle: { label: "閒置", color: "#faa81a" },
  dnd: { label: "勿擾", color: "#ed4245" },
  offline: { label: "離線", color: "#747f8d" },
};

export function useDiscordPresence(): Presence {
  const [presence, setPresence] = useState<Presence>(MOCK);

  useEffect(() => {
    if (!DISCORD_USER_ID) return; // 還沒設定 ID，維持示範資料
    let active = true;

    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (!json.success || !active) return;
        const d = json.data;
        const playing = (d.activities as LanyardActivity[] | undefined)?.find((a) => a.type === 0);
        setPresence({
          status: d.discord_status as PresenceStatus,
          game: playing?.name ?? null,
          detail: playing?.details ?? playing?.state ?? null,
          live: true,
        });
      } catch {
        // 抓不到就保留前一次的資料，不顯示壞掉的樣子
      }
    };

    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return presence;
}
