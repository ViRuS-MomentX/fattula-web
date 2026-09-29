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

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.current?.style.setProperty("translate", `${rx}px ${ry}px`);
      frame = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.current?.style.setProperty("translate", `${x}px ${y}px`);
      const hot = (e.target as Element | null)?.closest?.(INTERACTIVE);
      ring.current?.toggleAttribute("data-hot", Boolean(hot));
    };
    const onDown = () => ring.current?.setAttribute("data-down", "");
    const onUp = () => ring.current?.removeAttribute("data-down");
    const onLeave = () => {
      x = y = -100;
      dot.current?.style.setProperty("translate", "-100px -100px");
    };

    frame = requestAnimationFrame(loop);
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
