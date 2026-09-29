"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='option'], .zoomable, input, .showcase__stage";

/** A dot that follows the pointer exactly and a ring that trails it softly. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches)
      return;
    document.documentElement.classList.add("has-cursor");
    let x = -100, y = -100, rx = -100, ry = -100, frame = 0;

    // The ring trails the dot. The loop only runs while it is still catching
    // up, so an idle page does no per-frame work.
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.current?.style.setProperty("translate", `${rx}px ${ry}px`);
      frame = Math.hypot(x - rx, y - ry) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      // After entering the window (or on the first move) the ring starts under
      // the dot instead of flying in from the corner.
      if (x < 0) {
        rx = e.clientX;
        ry = e.clientY;
      }
      x = e.clientX;
      y = e.clientY;
      dot.current?.style.setProperty("translate", `${x}px ${y}px`);
      const hot = (e.target as Element | null)?.closest?.(INTERACTIVE);
      ring.current?.toggleAttribute("data-hot", Boolean(hot));
      wake();
    };
    const onDown = () => ring.current?.setAttribute("data-down", "");
    const onUp = () => ring.current?.removeAttribute("data-down");
    const onLeave = () => {
      x = y = -100;
      dot.current?.style.setProperty("translate", "-100px -100px");
      ring.current?.style.setProperty("translate", "-100px -100px");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
