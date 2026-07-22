import Image from "next/image";
import Link from "next/link";
import { BASE_PATH } from "@/lib/site-config";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-24 sm:flex-row sm:items-start">
      <div className="relative h-24 w-24 flex-none overflow-hidden border-[3px] border-accent sm:h-28 sm:w-28">
        <Image src={`${BASE_PATH}/avatar.jpg`} alt="陳梅豪" fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 border-2 border-accent px-2.5 py-1 font-mono text-xs tracking-wide text-accent uppercase before:h-1.5 before:w-1.5 before:bg-status before:content-['']">
          STATUS · 你好，我是
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-wide sm:text-5xl">
          陳梅豪
        </h1>
        <p className="max-w-xl text-lg text-muted">
          一句話介紹自己在做什麼，例如：軟體工程師，專注於遊戲開發與互動體驗。
        </p>
        <div className="flex gap-4 pt-4">
          <Link
            href="/projects"
            className="border-2 border-accent bg-accent px-5 py-2.5 text-sm font-bold text-on-accent hover:bg-accent-strong hover:border-accent-strong"
          >
            看作品集
          </Link>
          <Link
            href="/about"
            className="border-2 border-accent px-5 py-2.5 text-sm font-bold text-accent hover:bg-surface"
          >
            關於我
          </Link>
        </div>
      </div>
    </section>
  );
}
