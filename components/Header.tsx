"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "./Icons";

const TABS = [
  { href: "/", label: "Главная" },
  { href: "/posts", label: "Посты" },
  { href: "/projects", label: "Проекты" },
];

export const OPEN_PALETTE_EVENT = "fattula:open-palette";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="logo" aria-label="fattula, на главную">
          <span className="logo__mark" aria-hidden="true" />
          fattula
        </Link>

        <nav className="tabs" aria-label="Разделы сайта">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="tabs__item"
              aria-current={isActive(tab.href) ? "page" : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="search-trigger"
          onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
          aria-label="Поиск по сайту (Ctrl+K)"
        >
          <SearchIcon />
          <span className="search-trigger__label">Поиск</span>
          <kbd className="search-trigger__kbd">Ctrl K</kbd>
        </button>
      </div>
    </header>
  );
}
