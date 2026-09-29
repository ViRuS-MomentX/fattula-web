"use client";

import { useEffect, useState } from "react";

export const ACCENTS = [
  { id: "violet", label: "Фиалка", color: "#a97cff" },
  { id: "lavender", label: "Лаванда", color: "#c3a6ff" },
  { id: "orchid", label: "Орхидея", color: "#d86be0" },
  { id: "indigo", label: "Индиго", color: "#7f79ff" },
] as const;

export const ACCENT_KEY = "fattula:accent";

/** Lets a visitor pick their shade of purple; remembered in this browser. */
export default function AccentPicker() {
  const [accent, setAccent] = useState<string>("violet");

  useEffect(() => {
    setAccent(document.documentElement.dataset.accent ?? "violet");
  }, []);

  const choose = (id: string) => {
    setAccent(id);
    document.documentElement.dataset.accent = id;
    try {
      localStorage.setItem(ACCENT_KEY, id);
    } catch {
      /* storage unavailable: the choice lasts until the page reloads */
    }
  };

  return (
    <div className="accent-picker" role="group" aria-label="Оттенок сайта">
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          className="accent-picker__swatch"
          style={{ "--swatch": a.color } as React.CSSProperties}
          aria-pressed={accent === a.id}
          aria-label={a.label}
          title={a.label}
          onClick={() => choose(a.id)}
        />
      ))}
    </div>
  );
}
