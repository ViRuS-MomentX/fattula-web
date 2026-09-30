"use client";

import { unlock } from "@/lib/achievements";
import { useEffect, useState } from "react";

export const THEME_KEY = "fattula:theme";

/** Dark (default) or light lavender. Remembered in this browser. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const choose = (next: "dark" | "light") => {
    setTheme(next);
    unlock("theme");
    if (next === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f6f2fc" : "#150c21");
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable: lasts until reload */
    }
  };

  return (
    <div className="theme-toggle" role="group" aria-label="Тема оформления">
      <button type="button" aria-pressed={theme === "dark"} onClick={() => choose("dark")}>
        Тёмная
      </button>
      <button type="button" aria-pressed={theme === "light"} onClick={() => choose("light")}>
        Светлая
      </button>
    </div>
  );
}
