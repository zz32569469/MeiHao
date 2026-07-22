import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-24">
      <p className="text-sm text-neutral-400">你好，我是</p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        你的名字
      </h1>
      <p className="max-w-xl text-lg text-neutral-300">
        一句話介紹自己在做什麼，例如：軟體工程師，專注於遊戲開發與互動體驗。
      </p>
      <div className="flex gap-4 pt-4">
        <Link
          href="/projects"
          className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-300"
        >
          看作品集
        </Link>
        <Link
          href="/about"
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium hover:border-neutral-500"
        >
          關於我
        </Link>
      </div>
    </section>
  );
}
