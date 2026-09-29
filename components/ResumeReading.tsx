"use client";

import { useEffect, useState } from "react";

const key = (slug: string) => `fattula:read:${slug}`;

/**
 * Remembers how far a post was read. Coming back to a half-read post offers
 * a button that scrolls to the same place.
 */
export default function ResumeReading({ slug }: { slug: string }) {
  const [saved, setSaved] = useState<number | null>(null);

  useEffect(() => {
    try {
      const value = Number(localStorage.getItem(key(slug)));
      if (value > 0.1 && value < 0.9) setSaved(value);
    } catch {
      /* storage unavailable: nothing to resume */
    }

    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        if (max <= 0) return;
        const ratio = doc.scrollTop / max;
        if (ratio > 0.1) setSaved(null);
        try {
          localStorage.setItem(key(slug), ratio >= 0.9 ? "1" : ratio.toFixed(3));
        } catch {
          /* ignore */
        }
      }, 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [slug]);

  if (saved === null) return null;

  const resume = () => {
    const doc = document.documentElement;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: saved * (doc.scrollHeight - doc.clientHeight), behavior: smooth ? "smooth" : "auto" });
    setSaved(null);
  };

  return (
    <div className="resume" role="status">
      <span>Вы прочитали {Math.round(saved * 100)}% этого поста.</span>
      <button type="button" className="button button--primary" onClick={resume}>
        Продолжить с места, где остановились
      </button>
      <button type="button" className="chip" onClick={() => setSaved(null)}>
        Читать сначала
      </button>
    </div>
  );
}
