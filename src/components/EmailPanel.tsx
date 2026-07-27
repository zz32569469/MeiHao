"use client";

import { useState } from "react";

export const EMAIL = "zz32569469@gmail.com";

// 頁尾的 EMAIL：點開小面板顯示地址，沿用房間熱點面板的外框樣式，不開啟郵件軟體。
export default function EmailPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-accent hover:text-accent-strong"
      >
        [ EMAIL ]
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm border-2 border-line bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-ink">Email</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="關閉"
                className="cursor-pointer border-2 border-line px-2 py-1 font-mono text-xs text-muted hover:text-ink"
              >
                ✕
              </button>
            </div>
            <p className="select-all font-mono text-sm text-ink">{EMAIL}</p>
          </div>
        </div>
      )}
    </>
  );
}
