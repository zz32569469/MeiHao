"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "自我介紹" },
  { href: "/projects", label: "作品集" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-800">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          柚
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    active
                      ? "text-neutral-100"
                      : "text-neutral-400 hover:text-neutral-100"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
