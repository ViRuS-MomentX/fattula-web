"use client";

import { useEffect, useRef, useState } from "react";
import { ITEMS } from "./showcase-items";
import { useSpin } from "./useSpin";

const SEEN_KEY = "fattula:showcase-seen";

/**
 * Scroll-driven showcase: the stage sticks to the viewport while the section
 * scrolls past, and each slice of the scroll shows the next item.
 */
export default function ItemsShowcase() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useSpin<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const count = ITEMS.length;
  const wasComplete = useRef(false);
  const [seen, setSeen] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [complete, setComplete] = useState(false);

  // Restore the collection from this browser before anything is saved.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        const known = saved.filter((n) => ITEMS.some((it) => it.name === n));
        // A finished collection restored from storage is not a new achievement.
        wasComplete.current = known.length === ITEMS.length;
        setSeen(known);
      }
    } catch {
      /* no storage: the collection lives for this visit */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      const raw = progress * count;
      const index = Math.min(count - 1, Math.floor(raw));
      root.style.setProperty("--local", (raw - index).toFixed(3));
      setActive(index);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [count]);

  const jumpTo = (i: number) => {
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const travel = root.offsetHeight - window.innerHeight;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + ((i + 0.5) / count) * travel, behavior: smooth ? "smooth" : "auto" });
  };

  const item = ITEMS[active];

  // An item counts as collected once it has been on stage.
  useEffect(() => {
    if (!loaded) return;
    setSeen((prev) => (prev.includes(item.name) ? prev : [...prev, item.name]));
  }, [loaded, item.name]);

  useEffect(() => {
    if (!loaded || seen.length === 0) return;
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    } catch {
      /* ignore */
    }
  }, [loaded, seen]);

  useEffect(() => {
    if (!loaded) return;
    const done = seen.length === count;
    // Only celebrate the moment the last item is collected, not on every visit.
    if (done && !wasComplete.current && seen.length > 0) {
      setComplete(true);
      setTimeout(() => setComplete(false), 4000);
    }
    wasComplete.current = done;
  }, [loaded, seen, count]);

  return (
    <section
      ref={rootRef}
      className="showcase"
      aria-labelledby="showcase-heading"
      style={{ "--count": count, "--glow": item.glow } as React.CSSProperties}
    >
      <div className="showcase__sticky">
        <div className="showcase__text">
          <h2 className="section-title" id="showcase-heading">
            Вещи из любимых миров
          </h2>
          <div className="showcase__caption" key={active} aria-live="polite">
            <p className="showcase__source">
              {item.source}
              <span className="tag">{item.kind}</span>
            </p>
            <h3 className="showcase__name">{item.name}</h3>
            <p className="showcase__fact">{item.fact}</p>
          </div>
          <a href="#after-showcase" className="showcase__skip">
            Пропустить подборку
          </a>
          <p className="showcase__counter">
            {active + 1} из {count}. {active === count - 1 ? "Это последний" : "Листайте дальше"}
            <span className="showcase__collected">
              {" "}
              Собрано: {seen.length} из {count}
            </span>
          </p>
        </div>

        <div className="showcase__stage" aria-hidden="true" ref={stageRef} title="Потяните, чтобы покрутить">
          <div className="showcase__orb" />
          {ITEMS.map((it, i) => (
            <div
              key={it.name}
              className="showcase__item"
              data-state={i === active ? "active" : i < active ? "past" : "next"}
            >
              <div className="showcase__spin">{it.art}</div>
            </div>
          ))}
        </div>

        <ol className="showcase__index" aria-label="Все предметы">
          {ITEMS.map((it, i) => (
            <li key={it.name}>
              <button
                type="button"
                aria-current={i === active ? "true" : undefined}
                data-seen={seen.includes(it.name) || undefined}
                onClick={() => jumpTo(i)}
              >
                {it.source}
              </button>
            </li>
          ))}
        </ol>
      </div>
      {complete && (
        <p className="toast" role="status">
          Коллекция собрана: вы увидели все {count} предметов
        </p>
      )}
    </section>
  );
}
