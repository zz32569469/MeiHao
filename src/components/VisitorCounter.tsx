"use client";

import { useEffect, useState } from "react";

const COUNTER_KEY = "meihao-personal-site-visits";
const DIGITS = 6;

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://countapi.mileshilliard.com/api/v1/hit/${COUNTER_KEY}`)
      .then((res) => res.json())
      .then((data) => setCount(Number(data.value)))
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;

  const digits = String(count).padStart(DIGITS, "0").split("");

  return (
    <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-muted">
      <span>訪客數</span>
      <div className="flex gap-0.5">
        {digits.map((digit, i) => (
          <span
            key={i}
            className="flex h-5 w-4 items-center justify-center border border-line bg-surface text-ink tabular-nums"
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
}
