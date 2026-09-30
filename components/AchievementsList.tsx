"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, CHANGED_EVENT, readUnlocked } from "@/lib/achievements";

export default function AchievementsList() {
  const [have, setHave] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setHave(readUnlocked());
    sync();
    window.addEventListener(CHANGED_EVENT, sync);
    return () => window.removeEventListener(CHANGED_EVENT, sync);
  }, []);

  return (
    <div className="achievements">
      <p className="site-footer__title">
        Достижения <span className="achievements__count">{have.length} из {ACHIEVEMENTS.length}</span>
      </p>
      <ul>
        {ACHIEVEMENTS.map((a) => {
          const done = have.includes(a.id);
          return (
            <li key={a.id} data-done={done || undefined}>
              <span aria-hidden="true">{done ? "★" : "☆"}</span>
              <span>
                {done ? a.title : "???"}
                <small>{a.hint}</small>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
