import type { Metadata } from "next";
import RoomScene from "@/components/room/RoomScene";

// Prototype route, not linked from the site yet — keep it out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RoomPrototypePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <div>
        <span className="inline-flex w-fit items-center gap-2 border-2 border-accent px-2.5 py-1 font-mono text-xs tracking-wide text-accent uppercase before:h-1.5 before:w-1.5 before:bg-status before:content-['']">
          PROTOTYPE · 測試中
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-wide">房間導覽（試做版）</h1>
        <p className="mt-2 max-w-xl text-muted">
          點房間裡的家具，或用下面的按鈕，感受一下「逛房間」瀏覽網站的手感。家具目前都是程式碼畫的幾何色塊，還不是最終美術——先測互動感覺，喜歡再投入正式版。
        </p>
      </div>
      <RoomScene />
    </div>
  );
}
