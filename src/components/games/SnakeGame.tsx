"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useThemeColors } from "./useThemeColors";
import TouchDpad, { type Direction } from "./TouchDpad";

const COLS = 20;
const ROWS = 20;
const CELL = 16;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

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

function randomFood(snake: Point[]): Point {
  let point: Point;
  do {
    point = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === point.x && s.y === point.y));
  return point;
}

function initialState() {
  const snake: Point[] = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  return {
    snake,
    direction: "right" as Direction,
    pending: "right" as Direction,
    food: randomFood(snake),
    interval: 140,
    acc: 0,
    over: false,
  };
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = useThemeColors();
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const stateRef = useRef(initialState());

  const reset = useCallback(() => {
    stateRef.current = initialState();
    setScore(0);
    setGameOver(false);
  }, []);

  const setDirection = useCallback(
    (dir: Direction) => {
      const s = stateRef.current;
      if (s.over) {
        reset();
        return;
      }
      if (OPPOSITE[dir] === s.direction) return;
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

    let raf = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = now - last;
      last = now;
      const s = stateRef.current;
      const c = colors.current;

      if (!s.over) {
        s.acc += dt;
        while (s.acc >= s.interval) {
          s.acc -= s.interval;
          s.direction = s.pending;
          const vec = VECTORS[s.direction];
          const head = s.snake[0];
          const newHead = { x: head.x + vec.x, y: head.y + vec.y };

          const hitWall = newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS;
          const hitSelf = s.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y);

          if (hitWall || hitSelf) {
            s.over = true;
            setGameOver(true);
            setBest((b) => Math.max(b, s.snake.length - 3));
            break;
          }

          s.snake.unshift(newHead);
          if (newHead.x === s.food.x && newHead.y === s.food.y) {
            s.food = randomFood(s.snake);
            s.interval = Math.max(70, 140 - (s.snake.length - 3) * 4);
            setScore(s.snake.length - 3);
          } else {
            s.snake.pop();
          }
        }
      }

      context.fillStyle = c.bg;
      context.fillRect(0, 0, WIDTH, HEIGHT);

      context.fillStyle = c.status;
      context.fillRect(s.food.x * CELL + 2, s.food.y * CELL + 2, CELL - 4, CELL - 4);

      s.snake.forEach((seg, i) => {
        context.fillStyle = i === 0 ? c.accent : c.accentDim;
        context.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      });

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
      <div className="flex w-full justify-between font-mono text-xs tracking-wide text-muted" style={{ maxWidth: WIDTH }}>
        <span>SCORE {score}</span>
        <span>BEST {best}</span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="max-w-full border-2 border-line" />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/80 font-mono text-sm">
            <p className="font-bold text-status">GAME OVER</p>
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
