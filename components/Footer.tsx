import Link from "next/link";
import { withBase } from "@/lib/format";
import { RssIcon } from "./Icons";
import AccentPicker from "./AccentPicker";

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
        <div className="site-footer__col">
          <p className="site-footer__title">Оттенок</p>
          <AccentPicker />
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
