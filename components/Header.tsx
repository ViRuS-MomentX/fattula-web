"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HomeIcon, PostsIcon, ProjectsIcon, SearchIcon } from "./Icons";

const TABS = [
  { href: "/", label: "Главная", Icon: HomeIcon },
  { href: "/posts", label: "Посты", Icon: PostsIcon },
  { href: "/projects", label: "Проекты", Icon: ProjectsIcon },
];

export const OPEN_PALETTE_EVENT = "fattula:open-palette";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header" data-scrolled={scrolled}>
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
              <tab.Icon />
              <span>{tab.label}</span>
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
