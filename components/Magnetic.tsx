"use client";

import { useEffect } from "react";

const PULL = 0.25;
const MAX = 8;

/** Buttons lean slightly toward the pointer while it hovers over them. */
export default function Magnetic() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    let current: HTMLElement | null = null;

    const reset = (el: HTMLElement | null) => el?.style.removeProperty("--mag");
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".button, .chip, .search-trigger");
      if (el !== current) {
        reset(current);
        current = el ?? null;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width / 2)) * PULL));
      const dy = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top + r.height / 2)) * PULL));
      el.style.setProperty("--mag", `${dx.toFixed(1)}px, ${dy.toFixed(1)}px`);
    };
    const onLeave = () => {
      reset(current);
      current = null;
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return null;
}
