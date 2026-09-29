"use client";

import { useEffect, useRef } from "react";

/**
 * Drag sideways on the element to spin its content around the Y axis.
 * Releasing keeps the spin going with inertia until friction stops it.
 * Writes the angle to the `--drag` custom property.
 */
export function useSpin<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let angle = 0;
    let velocity = 0;
    let lastX = 0;
    let dragging = false;
    let frame = 0;

    const apply = () => el.style.setProperty("--drag", `${angle.toFixed(1)}deg`);
    let last = 0;
    // Time-based, so the spin feels the same at any frame rate.
    const coast = (now: number) => {
      const k = last ? Math.min(4, (now - last) / 16.7) : 1;
      last = now;
      velocity *= Math.pow(0.95, k);
      if (Math.abs(velocity) < 0.4) {
        // Ease back to facing forward once the spin is slow.
        const target = Math.round(angle / 360) * 360;
        angle += (target - angle) * (1 - Math.pow(0.88, k));
        velocity = 0;
        apply();
        if (Math.abs(target - angle) > 0.2) frame = requestAnimationFrame(coast);
        else {
          angle = target;
          apply();
        }
        return;
      }
      angle += velocity * k;
      apply();
      frame = requestAnimationFrame(coast);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      cancelAnimationFrame(frame);
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.9;
      angle += velocity;
      apply();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      delete el.dataset.dragging;
      last = 0;
      frame = requestAnimationFrame(coast);
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return ref;
}
