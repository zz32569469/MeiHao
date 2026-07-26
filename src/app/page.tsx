import Image from "next/image";
import RoomScene from "@/components/room/RoomScene";
import { BASE_PATH } from "@/lib/site-config";

export default function Home() {
  return (
    <div
      id="home"
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-10"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 flex-none overflow-hidden border-[3px] border-accent">
          <Image src={`${BASE_PATH}/avatar.jpg`} alt="MeihAO" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-serif text-3xl font-bold tracking-wide sm:text-4xl">MeihAO</h1>
          <p className="max-w-xl text-muted">
            愛玩遊戲的軟體工程師，正在學習使用 AI 做自己想做的事情。
          </p>
          <p className="font-mono text-xs tracking-wide text-muted">
            點房間裡的家具，或畫面下方的按鈕，開始逛逛。
          </p>
        </div>
      </header>

      <RoomScene />
    </div>
  );
}
