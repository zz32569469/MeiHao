import Link from "next/link";
import type { ReactNode } from "react";

export default function GamePageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <Link
        href="/projects"
        className="w-fit font-mono text-xs tracking-wide text-accent hover:text-accent-strong"
      >
        ← 回作品集
      </Link>
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-wide">{title}</h1>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
      <div className="flex justify-center border-2 border-line bg-surface p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
}
