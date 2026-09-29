"use client";

import { useEffect } from "react";

/** Adds a "#" link to every h2 in `.prose`; clicking it copies a link to that section. */
export default function HeadingAnchors() {
  useEffect(() => {
    const heads = Array.from(document.querySelectorAll<HTMLHeadingElement>(".prose h2[id]"));
    const links = heads.map((h) => {
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.className = "heading-anchor";
      a.textContent = "#";
      a.setAttribute("aria-label", `Ссылка на раздел «${h.textContent}»`);
      a.addEventListener("click", async () => {
        const url = `${location.origin}${location.pathname}#${h.id}`;
        try {
          await navigator.clipboard.writeText(url);
          a.dataset.copied = "true";
          setTimeout(() => delete a.dataset.copied, 1500);
        } catch {
          /* copying is a bonus: the link still scrolls to the section */
        }
      });
      h.append(a);
      return a;
    });
    return () => links.forEach((a) => a.remove());
  }, []);
  return null;
}
