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
      { rootMargin: "-96px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="fixed z-40 flex items-center gap-2 border-2 border-line bg-bg px-2.5 py-1.5"
      style={{ top: "calc(var(--frame-margin) + 0.75rem)", right: "0.75rem" }}
    >
      <a
        href="#home"
        aria-label="MeihAO - 回首頁"
        className="flex items-center"
        onClick={() => setActive("home")}
      >
        <PlumBlossomMark unit={2} />
      </a>
      <ul className="flex gap-0.5 text-xs">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => setActive(section.id)}
                className={`border-2 border-transparent border-b-[3px] px-2 py-1 ${
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
    </header>
  );
}
