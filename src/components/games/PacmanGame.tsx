"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useThemeColors } from "./useThemeColors";
import TouchDpad, { type Direction } from "./TouchDpad";

const MAZE_ROWS = [
  "#############",
  "#...#...#...#",
  "#.#.#.#.#.#.#",
  "#...........#",
  "#.#.#####.#.#",
  "#...........#",
  "#.#.#.#.#.#.#",
  "#...#...#...#",
  "#############",
];

const COLS = MAZE_ROWS[0].length;
const ROWS = MAZE_ROWS.length;
const CELL = 24;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;
const PLAYER_INTERVAL = 200;
const GHOST_INTERVAL = 400;

type Point = { x: number; y: number };

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const ALL_DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

const PLAYER_START: Point = { x: 6, y: 7 };
const GHOST_STARTS: { pos: Point; dir: Direction }[] = [
  { pos: { x: 6, y: 3 }, dir: "up" },
  { pos: { x: 6, y: 5 }, dir: "down" },
];

function isWall(x: number, y: number): boolean {
  if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return true;
  return MAZE_ROWS[y][x] === "#";
}

function buildDots(): boolean[][] {
  return MAZE_ROWS.map((row, y) =>
    row
      .split("")
      .map((ch, x) => ch !== "#" && !(x === PLAYER_START.x && y === PLAYER_START.y)),
  );
}

function countDots(dots: boolean[][]): number {
  return dots.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
}

function initialState() {
  const dots = buildDots();
  return {
    player: { ...PLAYER_START },
    direction: "left" as Direction,
    pending: "left" as Direction,
    ghosts: GHOST_STARTS.map((g) => ({ pos: { ...g.pos }, dir: g.dir })),
    dots,
    dotsLeft: countDots(dots),
    playerAcc: 0,
    ghostAcc: 0,
    over: false,
    won: false,
  };
}

type GameState = ReturnType<typeof initialState>;

export default function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = useThemeColors();
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const stateRef = useRef(initialState());

  const reset = useCallback(() => {
    stateRef.current = initialState();
    setScore(0);
    setStatus("playing");
  }, []);

  const setDirection = useCallback(
    (dir: Direction) => {
      const s = stateRef.current;
      if (s.over || s.won) {
        reset();
        return;
      }
      s.pending = dir;
    },
    [reset],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = WIDTH + "px";
    canvas.style.height = HEIGHT + "px";
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const keyMap: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };

    function handleKey(e: KeyboardEvent) {
      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        setDirection(dir);
      }
    }
    window.addEventListener("keydown", handleKey);

    function movePlayer(s: GameState) {
      const wantVec = VECTORS[s.pending];
      if (!isWall(s.player.x + wantVec.x, s.player.y + wantVec.y)) {
        s.direction = s.pending;
      }
      const vec = VECTORS[s.direction];
      if (!isWall(s.player.x + vec.x, s.player.y + vec.y)) {
        s.player.x += vec.x;
        s.player.y += vec.y;
      }
      if (s.dots[s.player.y][s.player.x]) {
        s.dots[s.player.y][s.player.x] = false;
        s.dotsLeft -= 1;
        setScore((prev) => prev + 1);
        if (s.dotsLeft <= 0) {
          s.won = true;
          setStatus("won");
        }
      }
    }

    function moveGhosts(s: GameState) {
      s.ghosts.forEach((ghost) => {
        const options = ALL_DIRECTIONS.filter((dir) => {
          const v = VECTORS[dir];
          return !isWall(ghost.pos.x + v.x, ghost.pos.y + v.y);
        });
        const nonReverse = options.filter((dir) => dir !== OPPOSITE[ghost.dir]);
        const pool = nonReverse.length > 0 ? nonReverse : options;

        let choice: Direction;
        if (Math.random() < 0.25) {
          choice = pool[Math.floor(Math.random() * pool.length)];
        } else {
          choice = pool.reduce((best, dir) => {
            const v = VECTORS[dir];
            const dist =
              Math.abs(ghost.pos.x + v.x - s.player.x) + Math.abs(ghost.pos.y + v.y - s.player.y);
            const bv = VECTORS[best];
            const bestDist =
              Math.abs(ghost.pos.x + bv.x - s.player.x) + Math.abs(ghost.pos.y + bv.y - s.player.y);
            return dist < bestDist ? dir : best;
          }, pool[0]);
        }

        ghost.dir = choice;
        const v = VECTORS[choice];
        ghost.pos.x += v.x;
        ghost.pos.y += v.y;
      });
    }

    let raf = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = now - last;
      last = now;
      const s = stateRef.current;
      const c = colors.current;

      if (!s.over && !s.won) {
        s.playerAcc += dt;
        while (s.playerAcc >= PLAYER_INTERVAL) {
          s.playerAcc -= PLAYER_INTERVAL;
          movePlayer(s);
        }

        s.ghostAcc += dt;
        while (s.ghostAcc >= GHOST_INTERVAL) {
          s.ghostAcc -= GHOST_INTERVAL;
          moveGhosts(s);
        }

        if (s.ghosts.some((g) => g.pos.x === s.player.x && g.pos.y === s.player.y)) {
          s.over = true;
          setStatus("lost");
        }
      }

      context.fillStyle = c.bg;
      context.fillRect(0, 0, WIDTH, HEIGHT);

      context.fillStyle = c.line;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (MAZE_ROWS[y][x] === "#") context.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }

      context.fillStyle = c.muted;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (s.dots[y][x]) {
            context.beginPath();
            context.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 2.5, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      context.fillStyle = c.status;
      s.ghosts.forEach((ghost) => {
        context.fillRect(ghost.pos.x * CELL + 3, ghost.pos.y * CELL + 3, CELL - 6, CELL - 6);
      });

      context.fillStyle = c.accent;
      context.beginPath();
      context.arc(s.player.x * CELL + CELL / 2, s.player.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
      context.fill();

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", handleKey);
      cancelAnimationFrame(raf);
    };
  }, [colors, setDirection]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex w-full justify-between font-mono text-xs tracking-wide text-muted"
        style={{ maxWidth: WIDTH }}
      >
        <span>DOTS {score}</span>
        <span>
          {status === "won" ? "STATUS · 過關" : status === "lost" ? "STATUS · GAME OVER" : "STATUS · 進行中"}
        </span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="max-w-full border-2 border-line" />
        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/80 font-mono text-sm">
            <p className={`font-bold ${status === "won" ? "text-accent" : "text-status"}`}>
              {status === "won" ? "全部吃完了！" : "GAME OVER"}
            </p>
            <button
              type="button"
              onClick={reset}
              className="border-2 border-accent bg-accent px-3 py-1 text-xs font-bold text-on-accent"
            >
              重新開始
            </button>
          </div>
        )}
      </div>
      <p className="font-mono text-xs text-muted">方向鍵 / WASD：移動</p>
      <TouchDpad onDirection={setDirection} />
    </div>
  );
}
