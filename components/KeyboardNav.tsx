"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* Uses e.code, so shortcuts work with both Latin and Cyrillic layouts. */
const GOTO: Record<string, { href: string; label: string; key: string }> = {
  KeyH: { href: "/", label: "Главная", key: "H" },
  KeyP: { href: "/posts", label: "Посты", key: "P" },
  KeyR: { href: "/projects", label: "Проекты", key: "R" },
};

export default function KeyboardNav() {
  const router = useRouter();
  const [help, setHelp] = useState(false);
  const pendingG = useRef(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Escape" && help) return setHelp(false);
      if (e.key === "?" || (e.shiftKey && e.code === "Slash")) {
        e.preventDefault();
        return setHelp((v) => !v);
      }
      if (e.code === "KeyG") {
        pendingG.current = Date.now();
        return;
      }
      const target = GOTO[e.code];
      if (target && Date.now() - pendingG.current < 1000) {
        pendingG.current = 0;
        setHelp(false);
        router.push(target.href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [help, router]);

  useEffect(() => {
    if (help) closeRef.current?.focus();
  }, [help]);

  if (!help) return null;

  return (
    <div className="palette-backdrop" onMouseDown={() => setHelp(false)}>
      <div
        className="shortcuts"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="shortcuts__head">
          <h2 id="shortcuts-title">Горячие клавиши</h2>
          <button ref={closeRef} type="button" className="chip" onClick={() => setHelp(false)}>
            Закрыть
          </button>
        </div>
        <dl className="shortcuts__list">
          <div>
            <dt><kbd>Ctrl</kbd> <kbd>K</kbd> или <kbd>/</kbd></dt>
            <dd>Поиск по сайту</dd>
          </div>
          {Object.values(GOTO).map((g) => (
            <div key={g.href}>
              <dt><kbd>G</kbd> затем <kbd>{g.key}</kbd></dt>
              <dd>Перейти: {g.label}</dd>
            </div>
          ))}
          <div>
            <dt><kbd>?</kbd></dt>
            <dd>Показать или скрыть эту подсказку</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
