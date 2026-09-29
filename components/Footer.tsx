import Link from "next/link";
import { withBase } from "@/lib/format";
import { RssIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          fattula, {new Date().getFullYear()}
          <span className="site-footer__hint"> Нажмите <kbd>?</kbd>, чтобы увидеть горячие клавиши.</span>
        </p>
        <nav className="site-footer__links" aria-label="Дополнительно">
          <Link href="/projects/archive">Архив проектов</Link>
          <a href={withBase("/rss.xml")}>
            <RssIcon size={16} />
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
