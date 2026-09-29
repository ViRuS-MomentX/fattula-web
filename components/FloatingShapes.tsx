"use client";

import { useEffect, useRef } from "react";

/** Glassy shapes drifting around the hero, shifted by the pointer at different depths. */
export default function FloatingShapes() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="shapes" ref={ref} aria-hidden="true">
      <div className="shape shape--ring" style={{ "--depth": 1.4 } as React.CSSProperties} />
      <div className="shape shape--cube" style={{ "--depth": 0.8 } as React.CSSProperties}>
        <span />
        <span />
        <span />
      </div>
      <div className="shape shape--blob" style={{ "--depth": 2 } as React.CSSProperties} />
      <div className="shape shape--pill" style={{ "--depth": 1.1 } as React.CSSProperties} />
    </div>
  );
}
