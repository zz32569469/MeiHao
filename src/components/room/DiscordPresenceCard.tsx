"use client";

import { useDiscordPresence, STATUS_META } from "./useDiscordPresence";

export default function DiscordPresenceCard() {
  const p = useDiscordPresence();
  const meta = STATUS_META[p.status];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 border-2 border-line bg-bg p-4">
        <span className="mt-1 inline-block h-3 w-3 flex-none" style={{ background: meta.color }} />
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm text-ink">Discord · {meta.label}</span>
          {p.game ? (
            <span className="text-sm text-muted">
              正在遊玩 <span className="text-accent">{p.game}</span>
            </span>
          ) : (
            <span className="text-sm text-muted">目前沒有在玩遊戲</span>
          )}
          {p.detail && <span className="text-xs text-muted">{p.detail}</span>}
        </div>
      </div>

      {!p.live && (
        <p className="border-2 border-dashed border-line p-3 font-mono text-xs text-muted">
          目前是示範資料。加入 <span className="text-accent">discord.gg/lanyard</span>{" "}
          並把你的 Discord 使用者 ID 給我，這裡就會換成你的即時上線狀態與正在玩的遊戲。
        </p>
      )}
    </div>
  );
}
