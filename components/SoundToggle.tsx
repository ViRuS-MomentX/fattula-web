"use client";

import { useEffect, useState } from "react";
import { SOUND_KEY, sounds } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      setOn(localStorage.getItem(SOUND_KEY) === "on");
    } catch {
      /* no storage: stays off */
    }
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (next) sounds.collect(); // a short confirmation blip
  };

  return (
    <button type="button" className="fx-toggle" role="switch" aria-checked={on} onClick={toggle}>
      <span className="fx-toggle__track" aria-hidden="true">
        <span className="fx-toggle__thumb" />
      </span>
      Звуки
    </button>
  );
}
