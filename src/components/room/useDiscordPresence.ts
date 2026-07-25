"use client";

import { useEffect, useState } from "react";

// 已加入 discord.gg/lanyard，填入使用者 ID 後卡片顯示即時狀態。
export const DISCORD_USER_ID = "377075673203736576";

export type PresenceStatus = "online" | "idle" | "dnd" | "offline";

export type Presence = {
  status: PresenceStatus;
  name: string;
  avatarUrl: string | null;
  customStatus: string | null;
  game: string | null;
  detail: string | null;
  live: boolean;
};

const MOCK: Presence = {
  status: "online",
  name: "MeihAO",
  avatarUrl: null,
  customStatus: null,
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
    if (!DISCORD_USER_ID) return; // 沒設定 ID，維持示範資料
    let active = true;

    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (!json.success || !active) return;
        const d = json.data;
        const activities = (d.activities as LanyardActivity[] | undefined) ?? [];
        const playing = activities.find((a) => a.type === 0);
        const custom = activities.find((a) => a.type === 4);
        const user = d.discord_user;
        setPresence({
          status: d.discord_status as PresenceStatus,
          name: user?.global_name || user?.username || "Discord",
          avatarUrl: user?.avatar
            ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${user.avatar}.png?size=80`
            : null,
          customStatus: custom?.state ?? null,
          game: playing?.name ?? null,
          detail: playing?.details ?? playing?.state ?? null,
          live: true,
        });
      } catch {
        // 抓不到就保留前一次資料，不顯示壞掉的樣子
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
