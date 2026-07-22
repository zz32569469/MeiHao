"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useThemeColors } from "./useThemeColors";

const WIDTH = 600;
const HEIGHT = 200;
const GROUND_Y = 160;
const GRAVITY = 1800;
const JUMP_VELOCITY = -650;
const JUMP_CUT_MULTIPLIER = 0.45;
const PLAYER_SIZE = 24;
const PLAYER_X = 60;

type Obstacle = { x: number; width: number; height: number };

function initialState() {
  return {
    playerY: GROUND_Y - PLAYER_SIZE,
    velocity: 0,
    grounded: true,
    obstacles: [] as Obstacle[],
    speed: 260,
    distance: 0,
    score: 0,
    spawnTimer: 1,
    over: false,
  };
}

export default function DinoGame() {
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

  const startJump = useCallback(() => {
    const s = stateRef.current;
    if (s.over) {
      reset();
      return;
    }
    if (s.grounded) {
      s.velocity = JUMP_VELOCITY;
      s.grounded = false;
    }
  }, [reset]);

  const endJump = useCallback(() => {
    const s = stateRef.current;
    if (!s.over && s.velocity < 0) {
      s.velocity *= JUMP_CUT_MULTIPLIER;
    }
  }, []);

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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        startJump();
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        endJump();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let raf = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = stateRef.current;
      const c = colors.current;

      if (!s.over) {
        s.velocity += GRAVITY * dt;
        s.playerY += s.velocity * dt;
        if (s.playerY >= GROUND_Y - PLAYER_SIZE) {
          s.playerY = GROUND_Y - PLAYER_SIZE;
          s.velocity = 0;
          s.grounded = true;
        }

        s.distance += s.speed * dt;
        s.speed = 260 + Math.min(220, s.distance * 0.02);

        s.spawnTimer -= dt;
        if (s.spawnTimer <= 0) {
          s.spawnTimer = 0.9 + Math.random() * 1.1;
          const h = 20 + Math.random() * 20;
          s.obstacles.push({ x: WIDTH + 10, width: 14 + Math.random() * 10, height: h });
        }

        s.obstacles.forEach((o) => (o.x -= s.speed * dt));
        s.obstacles = s.obstacles.filter((o) => o.x + o.width > 0);

        for (const o of s.obstacles) {
          const hit =
            PLAYER_X < o.x + o.width &&
            PLAYER_X + PLAYER_SIZE > o.x &&
            s.playerY < GROUND_Y &&
            s.playerY + PLAYER_SIZE > GROUND_Y - o.height;
          if (hit) {
            s.over = true;
            setGameOver(true);
            setBest((b) => Math.max(b, s.score));
          }
        }

        const newScore = Math.floor(s.distance / 10);
        if (newScore !== s.score) {
          s.score = newScore;
          setScore(newScore);
        }
      }

      context.clearRect(0, 0, WIDTH, HEIGHT);
      context.fillStyle = c.line;
      context.fillRect(0, GROUND_Y, WIDTH, 2);

      context.fillStyle = c.ink;
      context.fillRect(PLAYER_X, s.playerY, PLAYER_SIZE, PLAYER_SIZE);

      context.fillStyle = c.accent;
      s.obstacles.forEach((o) => {
        context.fillRect(o.x, GROUND_Y - o.height, o.width, o.height);
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(raf);
    };
  }, [colors, startJump, endJump]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full justify-between font-mono text-xs tracking-wide text-muted" style={{ maxWidth: WIDTH }}>
        <span>SCORE {score}</span>
        <span>BEST {best}</span>
      </div>
      <div
        className="relative touch-none"
        onPointerDown={() => startJump()}
        onPointerUp={() => endJump()}
        onPointerLeave={() => endJump()}
        onPointerCancel={() => endJump()}
      >
        <canvas ref={canvasRef} className="max-w-full border-2 border-line" />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/80 font-mono text-sm">
            <p className="font-bold text-status">GAME OVER</p>
            <p className="text-muted">點擊畫面或按空白鍵重新開始</p>
          </div>
        )}
      </div>
      <p className="font-mono text-xs text-muted">空白鍵 / ↑ / 點擊畫面：跳躍</p>
    </div>
  );
}
