"use client";

import { useState } from "react";
import { ROOMS } from "./rooms";

export default function RoomGallery() {
  // 預設顯示最新那間（清單第一筆）
  const [activeId, setActiveId] = useState(ROOMS[0].id);
  const active = ROOMS.find((room) => room.id === activeId) ?? ROOMS[0];
  const Scene = active.Scene;

  return (
    <div className="flex flex-col gap-5">
      {/* 房間時間軸 */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-wide text-muted uppercase">房間時間軸</span>
        <div className="flex flex-wrap gap-2">
          {ROOMS.map((room) => {
            const isActive = room.id === active.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setActiveId(room.id)}
                aria-pressed={isActive}
                className={`flex flex-col items-start border-2 px-3 py-1.5 text-left ${
                  isActive ? "border-accent bg-surface" : "border-line hover:text-ink"
                }`}
              >
                <span className="font-mono text-xs text-muted">{room.period}</span>
                <span className={`text-sm font-bold ${isActive ? "text-ink" : "text-muted"}`}>
                  {room.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 目前這間 */}
      <Scene key={active.id} />
    </div>
  );
}
