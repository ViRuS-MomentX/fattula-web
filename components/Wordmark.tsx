"use client";

import { useEffect, useRef } from "react";

const MIN = 200;
const MAX = 900;

/**
 * The hero wordmark. Each letter gets heavier and brighter the closer the
 * pointer (or finger) is. Letters sit in fixed-width boxes measured at the
 * heaviest weight, so the word never shifts while the weight changes.
 */
export default function Wordmark({ word = "fattula", as: Tag = "h1" }: { word?: string; as?: "h1" | "p" }) {
  const rootRef = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>(".wordmark__letter"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setLetter = (el: HTMLSpanElement, t: number) => {
      el.style.setProperty("--w", String(Math.round(MIN + (MAX - MIN) * t)));
      el.style.setProperty("--t", t.toFixed(3));
    };

    const lockWidths = () => {
      letters.forEach((el) => {
        el.style.width = "";
        el.style.setProperty("--w", String(MAX));
      });
      const widths = letters.map((el) => el.getBoundingClientRect().width);
      letters.forEach((el, i) => (el.style.width = `${widths[i]}px`));
    };

    let centers: number[][] = [];
    const measure = () => {
      lockWidths();
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
    };

    const rest = () => letters.forEach((el) => setLetter(el, 0.28));

    let frame = 0;
    let pointer: [number, number] | null = null;
    const render = () => {
      frame = 0;
      if (!pointer) return rest();
      const radius = Math.max(140, root.getBoundingClientRect().width / 3.2);
      letters.forEach((el, i) => {
        const [cx, cy] = centers[i];
        const d = Math.hypot(pointer![0] - cx, pointer![1] - cy);
        const t = Math.max(0, 1 - d / radius);
        setLetter(el, 0.12 + 0.88 * t * t * (3 - 2 * t));
      });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      pointer = [e.clientX, e.clientY];
      queue();
    };
    const onLeave = () => {
      pointer = null;
      queue();
    };
    const onResize = () => {
      measure();
      queue();
    };

    let intro: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      measure();
      if (reduce) {
        letters.forEach((el) => setLetter(el, 0.72));
        return;
      }
      // One page-load moment: a wave of weight runs across the word once.
      root.classList.add("wordmark--intro");
      intro = setTimeout(() => {
        root.classList.remove("wordmark--intro");
        rest();
      }, 1700);
      rest();
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onResize, { passive: true });
    };

    window.addEventListener("resize", onResize);
    document.fonts.ready.then(start);

    return () => {
      clearTimeout(intro);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Tag
      className="wordmark"
      ref={rootRef}
      aria-label={Tag === "h1" ? word : undefined}
      aria-hidden={Tag === "p" ? true : undefined}
    >
      {word.split("").map((ch, i) => (
        <span
          key={i}
          className="wordmark__letter"
          aria-hidden="true"
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </Tag>
  );
}
