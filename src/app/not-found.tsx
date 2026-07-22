import Link from "next/link";
import PlumBlossomMark from "@/components/PlumBlossomMark";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24">
      <span className="inline-flex w-fit items-center gap-2 border-2 border-status px-2.5 py-1 font-mono text-xs tracking-wide text-status uppercase before:h-1.5 before:w-1.5 before:bg-status before:content-['']">
        STATUS · 404
      </span>
      <div className="py-2 opacity-70">
        <PlumBlossomMark className="scale-150" />
      </div>
      <h1 className="font-serif text-4xl font-bold tracking-wide sm:text-5xl">
        這裡沒有花
      </h1>
      <p className="max-w-xl text-lg text-muted">
        你要找的頁面不存在，可能是連結打錯了，或這裡本來就還沒長出東西。
      </p>
      <Link
        href="/"
        className="border-2 border-accent bg-accent px-5 py-2.5 text-sm font-bold text-on-accent hover:bg-accent-strong hover:border-accent-strong"
      >
        回首頁
      </Link>
    </section>
  );
}
