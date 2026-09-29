"use client";

import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sound";

const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
const COLORS = ["#a97cff", "#d8c3ff", "#7c4dff", "#e36fd8", "#ffc4a3"];

/** ↑↑↓↓←→←→BA: a burst of purple confetti and a short message. */
export default function Konami() {
  const [toast, setToast] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      pos = e.code === CODE[pos] ? pos + 1 : e.code === CODE[0] ? 1 : 0;
      if (pos === CODE.length) {
        pos = 0;
        celebrate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const celebrate = () => {
    sounds.win();
    setToast(true);
    setTimeout(() => setToast(false), 3200);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const pieces = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 16 - 6,
      size: 5 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() > 0.6,
    }));

    const start = performance.now();
    const tick = (now: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of pieces) {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (now - start < 3500) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    requestAnimationFrame(tick);
  };

  return (
    <>
      <canvas ref={canvasRef} className="confetti" aria-hidden="true" />
      {toast && (
        <p className="toast" role="status">
          Код Konami принят. +30 жизней
        </p>
      )}
    </>
  );
}
