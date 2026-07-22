"use client";

export type Direction = "up" | "down" | "left" | "right";

export default function TouchDpad({
  onDirection,
}: {
  onDirection: (dir: Direction) => void;
}) {
  const btn =
    "flex h-12 w-12 items-center justify-center border-2 border-line bg-surface text-lg font-bold text-ink select-none active:bg-accent active:text-on-accent sm:hidden";

  return (
    <div className="mx-auto mt-2 grid w-fit grid-cols-3 grid-rows-3 gap-1 sm:hidden">
      <div />
      <button type="button" className={btn} onClick={() => onDirection("up")} aria-label="上">
        ↑
      </button>
      <div />
      <button type="button" className={btn} onClick={() => onDirection("left")} aria-label="左">
        ←
      </button>
      <div />
      <button type="button" className={btn} onClick={() => onDirection("right")} aria-label="右">
        →
      </button>
      <div />
      <button type="button" className={btn} onClick={() => onDirection("down")} aria-label="下">
        ↓
      </button>
      <div />
    </div>
  );
}
