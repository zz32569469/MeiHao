"use client";

import { useState } from "react";

export const EMAIL = "zz32569469@gmail.com";

// 點一下複製地址，不開啟郵件軟體；一定會給回饋，不會點了沒反應。
export default function EmailCopy({ className = "" }: { className?: string }) {
  const [msg, setMsg] = useState<string | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setMsg("已複製");
    } catch {
      setMsg("請手動選取複製");
    }
    window.setTimeout(() => setMsg(null), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="複製 Email 地址"
      className={`cursor-pointer text-left ${className}`}
    >
      <span className="text-muted">[ EMAIL ]</span>{" "}
      <span className="text-accent hover:text-accent-strong">{EMAIL}</span>
      <span aria-live="polite" className="ml-2 text-muted">
        {msg}
      </span>
    </button>
  );
}
