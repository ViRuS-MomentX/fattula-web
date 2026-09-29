"use client";

import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sound";

type Orb = { id: number; x: number; y: number; r: number; speed: number; color: string };

const COLORS = ["#a97cff", "#d8c3ff", "#e36fd8", "#7c4dff"];
const ROUND = 20;
const BEST_KEY = "fattula:orb-best";

/** A tiny 404 game: pop the falling orbs before they reach the floor. */
export default function OrbGame() {
  const [playing, setPlaying] = useState(false);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(ROUND);
  const [best, setBest] = useState(0);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const areaRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    } catch {
      /* no storage: best score lives for this visit only */
    }
  }, []);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    let spawnIn = 0;
    const started = last;

    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      const left = ROUND - (now - started) / 1000;
      setTime(Math.max(0, Math.ceil(left)));
      if (left <= 0) {
        setPlaying(false);
        setOrbs([]);
        return;
      }
      spawnIn -= dt;
      setOrbs((list) => {
        const moved = list.map((o) => ({ ...o, y: o.y + o.speed * dt })).filter((o) => o.y < 110);
        if (spawnIn <= 0) {
          spawnIn = 0.35 + Math.random() * 0.4;
          const r = 4 + Math.random() * 4;
          moved.push({
            id: nextId.current++,
            x: r + Math.random() * (100 - 2 * r),
            y: -10,
            r,
            speed: 18 + Math.random() * 22 + (ROUND - left) * 1.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
        return moved;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    if (playing || score === 0 || score <= best) return;
    setBest(score);
    try {
      localStorage.setItem(BEST_KEY, String(score));
    } catch {
      /* ignore */
    }
  }, [playing, score, best]);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setTime(ROUND);
    setOrbs([]);
    setPlaying(true);
  };

  const pop = (orb: Orb) => {
    setOrbs((list) => list.filter((o) => o.id !== orb.id));
    sounds.pop(scoreRef.current);
    scoreRef.current += 1;
    setScore((s) => s + 1);
    const id = orb.id;
    setPops((list) => [...list, { id, x: orb.x, y: orb.y }]);
    setTimeout(() => setPops((list) => list.filter((p) => p.id !== id)), 400);
  };

  return (
    <section className="orb-game" aria-labelledby="orb-game-title">
      <div className="orb-game__head">
        <h2 id="orb-game-title" className="section-title">
          Пока вы здесь: поймайте шарики
        </h2>
        <p className="orb-game__stats" aria-live="polite">
          <span>Счёт: {score}</span>
          <span>Время: {time}</span>
          <span>Рекорд: {best}</span>
        </p>
      </div>
      <div className="orb-game__area" ref={areaRef}>
        {orbs.map((o) => (
          <button
            key={o.id}
            type="button"
            className="orb"
            aria-label="Шарик"
            tabIndex={-1}
            style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.r * 2}%`, background: o.color }}
            onPointerDown={() => pop(o)}
          />
        ))}
        {pops.map((p) => (
          <span key={p.id} className="orb-pop" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-hidden="true">
            +1
          </span>
        ))}
        {!playing && (
          <div className="orb-game__overlay">
            {score > 0 && <p className="orb-game__result">Вы поймали {score}. {score >= best ? "Это новый рекорд!" : `Рекорд: ${best}.`}</p>}
            <button type="button" className="button button--primary" onClick={start}>
              {score > 0 ? "Сыграть ещё" : "Начать игру"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
