"use client";

/* eslint-disable @next/next/no-img-element */
import { useDiscordPresence, STATUS_META } from "./useDiscordPresence";

export default function DiscordPresenceCard() {
  const p = useDiscordPresence();
  const meta = STATUS_META[p.status];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 border-2 border-line bg-bg p-4">
        {p.avatarUrl ? (
          <img
            src={p.avatarUrl}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 flex-none border-2 border-line"
          />
        ) : (
          <span className="h-12 w-12 flex-none border-2 border-line bg-surface" />
        )}
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-2 font-bold text-ink">
            {p.name}
            <span className="inline-block h-2.5 w-2.5" style={{ background: meta.color }} />
            <span className="font-mono text-xs font-normal text-muted">{meta.label}</span>
          </span>
          {p.customStatus && <span className="text-sm text-muted">{p.customStatus}</span>}
          {p.game ? (
            <span className="text-sm text-muted">
              正在遊玩 <span className="text-accent">{p.game}</span>
              {p.detail && <span className="text-xs"> · {p.detail}</span>}
            </span>
          ) : (
            <span className="text-sm text-muted">目前沒有在玩遊戲</span>
          )}
        </div>
      </div>

      {!p.live && (
        <p className="border-2 border-dashed border-line p-3 font-mono text-xs text-muted">
          目前是示範資料，正在連線取得即時狀態⋯
        </p>
      )}
    </div>
  );
}
