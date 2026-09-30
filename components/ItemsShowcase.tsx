"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ITEMS, type ShowcaseItem } from "./showcase-items";
import { useSpin } from "./useSpin";
import { sounds } from "@/lib/sound";
import { unlock } from "@/lib/achievements";

const SEEN_KEY = "fattula:showcase-seen";

function Slide({ item, index, count }: { item: ShowcaseItem; index: number; count: number }) {
  const artRef = useSpin<HTMLDivElement>();
  return (
    <div
      className="carousel__slide"
      role="group"
      aria-roledescription="слайд"
      aria-label={`${index + 1} из ${count}: ${item.name}`}
      style={{ "--glow": item.glow } as React.CSSProperties}
    >
      <div className="carousel__text">
        <p className="carousel__source">
          {item.source}
          <span className="tag">{item.kind}</span>
        </p>
        <h3 className="carousel__name">{item.name}</h3>
        <p className="carousel__fact">{item.fact}</p>
      </div>
      <div className="carousel__art" ref={artRef} aria-hidden="true" title="Потяните, чтобы покрутить">
        <div className="carousel__orb" />
        <div className="carousel__spin">{item.art}</div>
      </div>
    </div>
  );
}

/**
 * Horizontal carousel of items. The page scrolls normally; items change by
 * swiping, the arrow buttons, the dots or the left/right keys. Slides tilt
 * and fade as they pass, and an item counts as collected once it is centred.
 */
export default function ItemsShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const count = ITEMS.length;
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [complete, setComplete] = useState(false);
  const wasComplete = useRef(false);
  const heardCount = useRef<number | null>(null);

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

  // Track scroll: find the centred slide and give every slide its offset.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    let frame = 0;

    const update = () => {
      frame = 0;
      const width = track.clientWidth || 1;
      const pos = track.scrollLeft / width;
      slides.forEach((slide, i) => {
        const offset = Math.max(-1, Math.min(1, i - pos));
        slide.style.setProperty("--o", offset.toFixed(3));
        slide.style.setProperty("--a", Math.abs(offset).toFixed(3));
      });
      setActive(Math.min(count - 1, Math.max(0, Math.round(pos))));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    track.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [count]);

  const item = ITEMS[active];

  useEffect(() => {
    sectionRef.current?.style.setProperty("--glow", item.glow);
  }, [item.glow]);

  // An item counts as collected once it has stayed centred for a moment, so
  // flying past it with a long swipe or a dot click does not collect it.
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(
      () => setSeen((prev) => (prev.includes(item.name) ? prev : [...prev, item.name])),
      450,
    );
    return () => clearTimeout(timer);
  }, [loaded, item.name]);

  // A blip whenever a new item joins the collection. The first pass after
  // loading only records the count, so opening the page stays silent.
  useEffect(() => {
    if (!loaded) return;
    if (heardCount.current !== null && seen.length > heardCount.current) sounds.collect();
    heardCount.current = seen.length;
  }, [loaded, seen.length]);

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
      unlock("collector");
      setTimeout(() => setComplete(false), 4000);
    }
    wasComplete.current = done;
  }, [loaded, seen, count]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = Math.min(count - 1, Math.max(0, i));
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: next * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
    },
    [count],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const target: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: count - 1,
    };
    if (e.key in target) {
      e.preventDefault();
      goTo(target[e.key]);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="carousel"
      aria-labelledby="showcase-heading"
      style={{ "--glow": ITEMS[0].glow } as React.CSSProperties}
    >
      <div className="carousel__head">
        <h2 className="section-title" id="showcase-heading">
          Вещи из любимых миров
        </h2>
        <p className="carousel__collected" aria-live="polite">
          Собрано: {seen.length} из {count}
        </p>
      </div>

      <div className="carousel__frame">
        <div
          className="carousel__track"
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-roledescription="карусель"
          aria-label="Предметы из игр и сериалов. Листайте стрелками влево и вправо."
          onKeyDown={onKeyDown}
        >
          {ITEMS.map((it, i) => (
            <Slide key={it.name} item={it} index={i} count={count} />
          ))}
        </div>

        <button
          type="button"
          className="carousel__arrow carousel__arrow--prev"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Предыдущий предмет"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className="carousel__arrow carousel__arrow--next"
          onClick={() => goTo(active + 1)}
          disabled={active === count - 1}
          aria-label="Следующий предмет"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <ol className="carousel__dots" aria-label="Все предметы">
        {ITEMS.map((it, i) => (
          <li key={it.name}>
            <button
              type="button"
              aria-label={`${it.name}, ${it.source}`}
              aria-current={i === active ? "true" : undefined}
              data-seen={seen.includes(it.name) || undefined}
              onClick={() => goTo(i)}
            />
          </li>
        ))}
      </ol>

      <p className="sr-only" aria-live="polite">
        {item.name}, {item.source}. {active + 1} из {count}.
      </p>

      {complete && (
        <p className="toast" role="status">
          Коллекция собрана: вы увидели все {count} предметов
        </p>
      )}
    </section>
  );
}
