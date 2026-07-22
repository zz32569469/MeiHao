"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PlumBlossomMark from "./PlumBlossomMark";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "自我介紹" },
  { href: "/projects", label: "作品集" },
  { href: "/blog", label: "開發紀錄" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-line bg-bg">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" aria-label="陳梅豪 - 回首頁" className="flex items-center">
          <PlumBlossomMark />
        </Link>
        <ul className="flex gap-1 text-sm">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
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
