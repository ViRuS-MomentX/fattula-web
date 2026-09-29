"use client";

import { useEffect, useRef, useState } from "react";

const R = 20;
const C = 2 * Math.PI * R;

/** Floating "back to top" button with a ring that fills as the page scrolls. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      setVisible(doc.scrollTop > window.innerHeight * 1.2);
      ringRef.current?.setAttribute("stroke-dashoffset", String(C * (1 - progress)));
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
  }, []);

  const toTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <button
      type="button"
      className="to-top"
      data-visible={visible}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label="Наверх"
      onClick={toTop}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={R} className="to-top__track" />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={R}
          className="to-top__ring"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
        <path d="M24 31V17m-6 6 6-6 6 6" className="to-top__arrow" />
      </svg>
    </button>
  );
}
