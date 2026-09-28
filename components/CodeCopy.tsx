"use client";

import { useEffect } from "react";

/** Adds a "Копировать" button to every code block inside `.prose`. */
export default function CodeCopy() {
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLPreElement>(".prose pre"));
    const buttons = blocks.map((pre) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-button";
      button.textContent = "Копировать";
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector("code")?.textContent ?? pre.textContent ?? "");
          button.textContent = "Скопировано";
        } catch {
          button.textContent = "Не удалось скопировать";
        }
        setTimeout(() => (button.textContent = "Копировать"), 1800);
      });
      pre.append(button);
      return button;
    });
    return () => buttons.forEach((b) => b.remove());
  }, []);
  return null;
}
