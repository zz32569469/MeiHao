"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  life: number;
  maxLife: number;
  colorIndex: 0 | 1;
};

type ContentRect = { left: number; right: number; top: number; bottom: number } | null;

const MAX_PETALS = 90;
const SIZES = [3, 4, 5];
const FRAME_BREAKPOINT = 1280;

export default function PetalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let colors: [string, string] = ["#ab8683", "#8c6b68"];
    function readColors() {
      const style = getComputedStyle(document.documentElement);
      colors = [
        style.getPropertyValue("--blossom").trim() || colors[0],
        style.getPropertyValue("--blossom-dim").trim() || colors[1],
      ];
    }
    readColors();

    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributeFilter: ["class"] });

    // On wide screens (matching the CSS --frame-margin breakpoint), the site
    // sits in a margin frame and petals should stay confined to that margin
    // instead of falling over the readable content column. Below the
    // breakpoint there's no frame, so this is a no-op (contentRect stays
    // null and everywhere counts as "margin", i.e. the original behavior).
    let contentRect: ContentRect = null;

    function readContentRect() {
      if (window.innerWidth < FRAME_BREAKPOINT) {
        contentRect = null;
        return;
      }
      const frameMargin = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--frame-margin"),
      ) || 0;
      const navEl = document.querySelector("header nav");
      const navRect = navEl?.getBoundingClientRect();
      const left = navRect ? navRect.left : (window.innerWidth - 768) / 2;
      const right = navRect ? navRect.right : left + 768;
      contentRect = { left, right, top: frameMargin, bottom: window.innerHeight - frameMargin };
    }

    function inMargin(x: number, y: number) {
      if (!contentRect) return true;
      return (
        x < contentRect.left || x > contentRect.right || y < contentRect.top || y > contentRect.bottom
      );
    }

    let dpr = window.devicePixelRatio || 1;
    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      readContentRect();
    }
    resize();
    window.addEventListener("resize", resize);

    let petals: Petal[] = [];

    function spawn(x: number, y: number, count: number) {
      for (let i = 0; i < count; i++) {
        if (petals.length >= MAX_PETALS) petals.shift();
        petals.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 0.6 + 0.4,
          size: SIZES[Math.floor(Math.random() * SIZES.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.1,
          life: 0,
          maxLife: 90 + Math.random() * 60,
          colorIndex: Math.random() < 0.6 ? 0 : 1,
        });
      }
    }

    function spawnAmbient() {
      const w = window.innerWidth;
      if (!contentRect) {
        spawn(Math.random() * w, -10, 1);
        return;
      }
      const roll = Math.random();
      if (roll < 0.5) {
        spawn(Math.random() * w, -10, 1);
      } else if (roll < 0.75) {
        spawn(Math.random() * contentRect.left, -10, 1);
      } else {
        spawn(contentRect.right + Math.random() * (w - contentRect.right), -10, 1);
      }
    }

    let lastSpawn = 0;
    function handlePointerMove(e: PointerEvent) {
      if (!inMargin(e.clientX, e.clientY)) return;
      const now = performance.now();
      if (now - lastSpawn < 60) return;
      lastSpawn = now;
      spawn(e.clientX, e.clientY, 1);
    }
    function handlePointerDown(e: PointerEvent) {
      if (!inMargin(e.clientX, e.clientY)) return;
      spawn(e.clientX, e.clientY, 8);
    }

    if (!reduceMotion) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerdown", handlePointerDown);
    }

    let ambientTimer = 0;
    let raf = 0;

    function tick() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      ambientTimer++;
      if (ambientTimer > 240) {
        ambientTimer = 0;
        spawnAmbient();
      }

      petals = petals.filter((p) => p.life < p.maxLife);
      petals.forEach((p) => {
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.05) * 0.3;
        p.y += p.vy;
        p.angle += p.spin;
        p.vy += 0.002;

        if (!inMargin(p.x, p.y)) return;

        const fadeIn = Math.min(1, p.life / 10);
        const fadeOut = Math.min(1, (p.maxLife - p.life) / 20);
        const alpha = Math.max(0, Math.min(fadeIn, fadeOut));

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.angle);
        ctx!.globalAlpha = alpha * 0.85;
        ctx!.fillStyle = colors[p.colorIndex];
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx!.restore();
      });

      raf = requestAnimationFrame(tick);
    }

    if (!reduceMotion) {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      themeObserver.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
