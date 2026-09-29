"use client";

import { useEffect, useRef } from "react";

type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number; hue: number };

/**
 * Tiny sparks drift off the pointer while it moves over the hero.
 * Mount it inside a `position: relative` section; it fills that section.
 */
export default function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

    const sparks: Spark[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;
    let running = false;
    let lastX = 0;
    let lastY = 0;

    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--lilac").trim() || "#d8c3ff";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.02;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02;
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.hue > 0.7 ? "#ffc4a3" : accent;
        ctx.beginPath();
        // four-point star
        const r = s.size * s.life;
        ctx.moveTo(s.x, s.y - r * 2);
        ctx.quadraticCurveTo(s.x, s.y, s.x + r * 2, s.y);
        ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + r * 2);
        ctx.quadraticCurveTo(s.x, s.y, s.x - r * 2, s.y);
        ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - r * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (sparks.length) frame = requestAnimationFrame(draw);
      else running = false;
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      if (Math.hypot(x - lastX, y - lastY) < 14) return;
      lastX = x;
      lastY = y;
      for (let i = 0; i < 2; i++) {
        sparks.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 0.6 - 0.2,
          life: 1,
          size: 1.5 + Math.random() * 2.5,
          hue: Math.random(),
        });
      }
      if (sparks.length > 80) sparks.splice(0, sparks.length - 80);
      if (!running) {
        running = true;
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="sparkle-trail" aria-hidden="true" />;
}
