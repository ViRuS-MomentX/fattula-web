"use client";

import { useEffect, useState } from "react";

const SIZES = [
  { id: "s", label: "Мелкий", scale: 0.92 },
  { id: "m", label: "Обычный", scale: 1 },
  { id: "l", label: "Крупный", scale: 1.15 },
  { id: "xl", label: "Очень крупный", scale: 1.3 },
] as const;

const KEY = "fattula:text-size";

/** A-/A+ for post text. The choice is kept in this browser. */
export default function ReadingControls() {
  const [index, setIndex] = useState(1);

  useEffect(() => {
    try {
      const saved = SIZES.findIndex((s) => s.id === localStorage.getItem(KEY));
      if (saved >= 0) setIndex(saved);
    } catch {
      /* no storage: default size */
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--prose-scale", String(SIZES[index].scale));
  }, [index]);

  // Leaving the post restores the default size for the rest of the site.
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--prose-scale");
    },
    [],
  );

  const change = (delta: number) => {
    const next = Math.min(SIZES.length - 1, Math.max(0, index + delta));
    setIndex(next);
    try {
      localStorage.setItem(KEY, SIZES[next].id);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="reading-controls" role="group" aria-label="Размер текста">
      <button type="button" className="chip" onClick={() => change(-1)} disabled={index === 0} aria-label="Уменьшить текст">
        А−
      </button>
      <span className="reading-controls__label" aria-live="polite">
        {SIZES[index].label}
      </span>
      <button
        type="button"
        className="chip"
        onClick={() => change(1)}
        disabled={index === SIZES.length - 1}
        aria-label="Увеличить текст"
      >
        А+
      </button>
    </div>
  );
}
