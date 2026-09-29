"use client";

import { useEffect, useState } from "react";

const WORD = ["KeyF", "KeyA", "KeyT", "KeyT", "KeyU", "KeyL", "KeyA"];
const DURATION = 6000;

/** Type "fattula" (any layout) or click the logo five times fast: party. */
export default function PartyMode() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let pos = 0;
    let clicks: number[] = [];
    let timer: ReturnType<typeof setTimeout>;

    const start = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clearTimeout(timer);
      document.documentElement.dataset.party = "";
      setOn(true);
      timer = setTimeout(() => {
        delete document.documentElement.dataset.party;
        setOn(false);
      }, DURATION);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA"].includes(t.tagName)) return;
      pos = e.code === WORD[pos] ? pos + 1 : e.code === WORD[0] ? 1 : 0;
      if (pos === WORD.length) {
        pos = 0;
        start();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.(".logo")) return;
      const now = Date.now();
      clicks = [...clicks.filter((c) => now - c < 2000), now];
      if (clicks.length >= 5) {
        e.preventDefault();
        clicks = [];
        start();
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return on ? (
    <p className="toast toast--party" role="status">
      Режим вечеринки на 6 секунд
    </p>
  ) : null;
}
