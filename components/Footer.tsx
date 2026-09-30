import Link from "next/link";
import { CONTACTS, withBase } from "@/lib/format";
import { RssIcon } from "./Icons";
import AccentPicker from "./AccentPicker";
import ThemeToggle from "./ThemeToggle";
import EffectsToggle from "./EffectsToggle";
import SoundToggle from "./SoundToggle";
import AchievementsList from "./AchievementsList";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav className="site-footer__col" aria-label="Разделы">
          <p className="site-footer__title">Разделы</p>
          <Link href="/">Главная</Link>
          <Link href="/posts">Посты</Link>
          <Link href="/projects">Проекты</Link>
          <Link href="/projects/archive">Архив проектов</Link>
        </nav>
        <div className="site-footer__col">
          <p className="site-footer__title">Подписка</p>
          <a href={withBase("/rss.xml")}>
            <RssIcon size={16} />
            RSS-лента
          </a>
        </div>
        {CONTACTS.length > 0 && (
          <div className="site-footer__col">
            <p className="site-footer__title">Контакты</p>
            {CONTACTS.map((c) => (
              <a key={c.href} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                {c.label}
              </a>
            ))}
          </div>
        )}
        <div className="site-footer__col">
          <p className="site-footer__title">Оформление</p>
          <ThemeToggle />
          <AccentPicker />
          <EffectsToggle />
          <SoundToggle />
        </div>
        <div className="site-footer__col">
          <AchievementsList />
        </div>
        <div className="site-footer__col site-footer__hint">
          <p className="site-footer__title">Подсказка</p>
          <p>
            Нажмите <kbd>?</kbd>, чтобы увидеть горячие клавиши, или <kbd>Ctrl</kbd> + <kbd>K</kbd> для поиска.
          </p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <p>fattula, {new Date().getFullYear()}</p>
      </div>
      <p className="site-footer__word" aria-hidden="true">
        fattula
      </p>
    </footer>
  );
}
