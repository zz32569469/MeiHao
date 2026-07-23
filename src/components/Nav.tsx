"use client";

import { useEffect, useState } from "react";
import PlumBlossomMark from "./PlumBlossomMark";
import ThemeToggle from "./ThemeToggle";

const sections = [
  { id: "home", label: "首頁" },
  { id: "about", label: "自我介紹" },
  { id: "projects", label: "作品集" },
];

// 抓「頂端已經捲過這條線的區塊」而非重疊區間，短區塊（如自我介紹）才不會被跳過
const ACTIVE_LINE_PX = 100;

export default function Nav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      ticking = false;
      let current = sections[0].id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_LINE_PX) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
