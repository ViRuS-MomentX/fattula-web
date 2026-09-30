"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, ACHIEVEMENTS_KEY, CHANGED_EVENT, UNLOCK_EVENT, readUnlocked } from "@/lib/achievements";
import { sounds } from "@/lib/sound";

/** Records unlocked achievements and shows a short toast for each new one. */
export default function Achievements() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onUnlock = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const item = ACHIEVEMENTS.find((a) => a.id === id);
      const have = readUnlocked();
      if (!item || have.includes(id)) return;
      try {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...have, id]));
      } catch {
        /* no storage: the achievement is announced but not kept */
      }
      window.dispatchEvent(new Event(CHANGED_EVENT));
      sounds.collect();
      setToast(item.title);
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 3200);
    };
    window.addEventListener(UNLOCK_EVENT, onUnlock);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(UNLOCK_EVENT, onUnlock);
    };
  }, []);

  return toast ? (
    <p className="toast toast--achievement" role="status">
      <span aria-hidden="true">★</span> Достижение: {toast}
    </p>
  ) : null;
}
