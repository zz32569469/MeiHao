"use client";

import { useState } from "react";
import DinoGame from "./DinoGame";
import SnakeGame from "./SnakeGame";
import PacmanGame from "./PacmanGame";

const GAMES = [
  { key: "dino", label: "小恐龍", Component: DinoGame },
  { key: "snake", label: "貪食蛇", Component: SnakeGame },
  { key: "pacman", label: "小精靈", Component: PacmanGame },
] as const;

type GameKey = (typeof GAMES)[number]["key"];

export default function GameShowcase() {
  const [active, setActive] = useState<GameKey>("dino");
  const ActiveGame = GAMES.find((game) => game.key === active)!.Component;

  return (
    <article className="flex flex-col gap-4 border-2 border-line bg-surface p-5">
      <span className="inline-flex w-fit items-center gap-2 border-2 border-accent px-2.5 py-1 font-mono text-xs tracking-wide text-accent uppercase before:h-1.5 before:w-1.5 before:bg-status before:content-['']">
        STATUS · 製作中
      </span>

      <div>
        <h2 className="font-serif font-bold text-ink">小遊戲試玩</h2>
        <p className="mt-1 text-sm text-muted">
          還沒有正式作品，先放三個自己刻的小遊戲練手，選一個玩玩看。
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GAMES.map((game) => (
          <button
            key={game.key}
            type="button"
            onClick={() => setActive(game.key)}
            className={`border-2 px-3 py-1.5 font-mono text-xs tracking-wide uppercase ${
              active === game.key
                ? "border-accent bg-accent text-on-accent"
                : "border-line text-muted hover:text-ink"
            }`}
          >
            {game.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-1">
        <ActiveGame key={active} />
      </div>
    </article>
  );
}
