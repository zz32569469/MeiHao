"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FlameMark from "./FlameMark";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "自我介紹" },
  { href: "/projects", label: "作品集" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-line bg-bg">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-wide">
          <FlameMark className="mt-[-2px] h-7 w-5" />
          柚
        </Link>
        <ul className="flex gap-1 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`border-2 border-transparent border-b-[3px] px-3 py-2 ${
                    active
                      ? "border-line border-b-accent bg-surface text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
