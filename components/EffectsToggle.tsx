"use client";

import { useEffect, useState } from "react";

export const FX_KEY = "fattula:fx";

/** A calm mode: switches off motion, the custom cursor and glass shapes. */
export default function EffectsToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(document.documentElement.dataset.fx !== "off");
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) delete document.documentElement.dataset.fx;
    else document.documentElement.dataset.fx = "off";
    try {
      localStorage.setItem(FX_KEY, next ? "on" : "off");
    } catch {
      /* storage unavailable: lasts until reload */
    }
  };

  return (
    <button type="button" className="fx-toggle" role="switch" aria-checked={on} onClick={toggle}>
      <span className="fx-toggle__track" aria-hidden="true">
        <span className="fx-toggle__thumb" />
      </span>
      Эффекты и анимации
    </button>
  );
}
