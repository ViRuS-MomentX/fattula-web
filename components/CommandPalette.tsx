"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/lib/content";
import { withBase } from "@/lib/format";
import { unlock } from "@/lib/achievements";
import { OPEN_PALETTE_EVENT } from "./Header";
import { ClockIcon, CompassIcon, PostsIcon, ProjectsIcon, SearchIcon } from "./Icons";

const PAGES: SearchItem[] = [
  { href: "/", title: "Главная", hint: "Раздел", keywords: "домой старт" },
  { href: "/posts", title: "Все посты", hint: "Раздел", keywords: "блог статьи заметки" },
  { href: "/projects", title: "Все проекты", hint: "Раздел", keywords: "работы портфолио" },
  { href: "/projects/archive", title: "Архив проектов", hint: "Раздел", keywords: "старые завершённые" },
  { href: "/rss.xml", title: "RSS-лента", hint: "Подписка", keywords: "подписаться rss feed" },
];

const norm = (s: string) => s.toLowerCase().replaceAll("ё", "е");

const GROUPS = ["Недавнее", "Посты", "Проекты", "Разделы"] as const;
type Group = (typeof GROUPS)[number];

const groupOf = (item: SearchItem): Group =>
  item.hint === "Недавнее"
    ? "Недавнее"
    : item.hint === "Пост"
      ? "Посты"
      : item.hint.startsWith("Проект")
        ? "Проекты"
        : "Разделы";

const GROUP_ICON = { Недавнее: ClockIcon, Посты: PostsIcon, Проекты: ProjectsIcon, Разделы: CompassIcon };

const RECENT_KEY = "fattula:recent";
const readRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
};
const saveRecent = (href: string) => {
  try {
    const next = [href, ...readRecent().filter((h) => h !== href)].slice(0, 4);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: recent items are only a convenience */
  }
};

export default function CommandPalette({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const all = useMemo(() => [...items, ...PAGES], [items]);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) {
      const recentItems = recent
        .map((href) => all.find((i) => i.href === href))
        .filter((i): i is SearchItem => Boolean(i))
        .map((i) => ({ ...i, hint: "Недавнее" }));
      return [...recentItems, ...all.filter((i) => !recent.includes(i.href))];
    }
    return all
      .map((item) => {
        const title = norm(item.title);
        const score = title.startsWith(q)
          ? 3
          : title.includes(q)
            ? 2
            : norm(item.keywords).includes(q)
              ? 1
              : 0;
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort(
        (a, b) =>
          GROUPS.indexOf(groupOf(a.item)) - GROUPS.indexOf(groupOf(b.item)) || b.score - a.score,
      )
      .map((r) => r.item);
  }, [all, query, recent]);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setRecent(readRecent());
    setOpen(true);
    unlock("search");
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, [open, show, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    setOpen(false);
    saveRecent(item.href);
    if (item.href.endsWith(".xml")) window.location.href = withBase(item.href);
    else router.push(item.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    document
      .getElementById(`palette-option-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div className="palette-backdrop" onMouseDown={close}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Поиск по сайту"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="palette__field">
          <SearchIcon size={20} />
          <input
            ref={inputRef}
            className="palette__input"
            placeholder="Найти пост, проект или раздел"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results.length ? `palette-option-${active}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="palette__esc">Esc</kbd>
        </div>

        {results.length ? (
          <ul className="palette__list" id="palette-list" role="listbox">
            {results.map((item, i) => {
              const group = groupOf(item);
              const Icon = GROUP_ICON[group];
              const first = i === 0 || groupOf(results[i - 1]) !== group;
              return (
                <Fragment key={item.href + group}>
                  {first && (
                    <li className="palette__group" role="presentation">
                      {group}
                    </li>
                  )}
                  <li
                    id={`palette-option-${i}`}
                    role="option"
                    aria-selected={i === active}
                    className="palette__option"
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(item)}
                  >
                    <Icon />
                    <span className="palette__title">{item.title}</span>
                    {group === "Проекты" && item.hint !== "Проект" && (
                      <span className="palette__hint">{item.hint}</span>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ul>
        ) : (
          <p className="palette__empty">
            По запросу «{query}» ничего нет. Попробуйте другое слово или откройте{" "}
            <button type="button" className="link-button" onClick={() => go(PAGES[1])}>
              все посты
            </button>
            .
          </p>
        )}

        <p className="palette__help">
          <span><kbd>↑</kbd> <kbd>↓</kbd> выбрать</span>
          <span><kbd>Enter</kbd> открыть</span>
        </p>
      </div>
    </div>
  );
}
