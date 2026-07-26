import Image from "next/image";
import RoomGallery from "@/components/room/RoomGallery";
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
            愛玩遊戲的軟體工程師。人生 build 中，持續整理。
          </p>
          <p className="font-mono text-xs tracking-wide text-muted">
            點家具逛逛。每搬一次家，就在這裡 commit 一間房間。
          </p>
        </div>
      </header>

      <RoomGallery />
    </div>
  );
}
