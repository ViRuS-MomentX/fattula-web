"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [label, setLabel] = useState("Поделиться");

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* the person closed the share sheet: fall back to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setLabel("Ссылка скопирована");
    } catch {
      setLabel("Не удалось скопировать ссылку");
    }
    setTimeout(() => setLabel("Поделиться"), 2000);
  };

  return (
    <button type="button" className="chip share-button" onClick={share} aria-live="polite">
      {label}
    </button>
  );
}
