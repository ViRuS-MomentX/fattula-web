"use client";

import { useEffect, useRef, useState } from "react";

/** Click an image inside `.prose` to see it full screen. Esc or a click closes it. */
export default function Lightbox() {
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".prose img"));
    const open = (e: Event) => {
      const img = e.currentTarget as HTMLImageElement;
      setImage({ src: img.currentSrc || img.src, alt: img.alt });
    };
    imgs.forEach((img) => {
      img.classList.add("zoomable");
      img.tabIndex = 0;
      img.addEventListener("click", open);
      img.addEventListener("keydown", (e) => (e as KeyboardEvent).key === "Enter" && open(e));
    });
    return () => imgs.forEach((img) => img.removeEventListener("click", open));
  }, []);

  useEffect(() => {
    if (!image) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setImage(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image]);

  if (!image) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.alt || "Изображение"} onClick={() => setImage(null)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} />
      <button ref={closeRef} type="button" className="chip lightbox__close">
        Закрыть
      </button>
    </div>
  );
}
