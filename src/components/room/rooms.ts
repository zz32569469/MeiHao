import type { ComponentType } from "react";
import RoomScene from "./RoomScene";

// 房間時間軸：每間房間 = 一個時間膠囊（日期＋當時擺設凍結保存）。
// 未來搬家：在最前面 unshift 一筆，並為那間房間建一個 Scene 元件即可。
export type RoomEntry = {
  id: string;
  label: string; // 定位/名稱，例如「起點」
  period: string; // 日期範圍
  Scene: ComponentType;
};

export const ROOMS: RoomEntry[] = [
  {
    id: "2026",
    label: "起點 · v1",
    period: "2026.01 – 至今",
    Scene: RoomScene,
  },
];
