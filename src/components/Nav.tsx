"use client";

import { useEffect, useState } from "react";
import PlumBlossomMark from "./PlumBlossomMark";
import ThemeToggle from "./ThemeToggle";

const sections = [
  { id: "home", label: "首頁" },
  { id: "about", label: "自我介紹" },
  { id: "projects", label: "作品集" },
];

export default function Nav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="sticky z-40 border-b-2 border-line bg-bg"
      style={{ top: "var(--frame-margin)" }}
    >
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <a href="#home" aria-label="MeihAO - 回首頁" className="flex items-center">
          <PlumBlossomMark />
        </a>
        <ul className="flex gap-1 text-sm">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`border-2 border-transparent border-b-[3px] px-3 py-2 ${
                    isActive
                      ? "border-line border-b-accent bg-surface text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
