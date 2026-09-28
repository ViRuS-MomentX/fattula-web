import Link from "next/link";
import { RssIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>fattula, {new Date().getFullYear()}</p>
        <nav className="site-footer__links" aria-label="Дополнительно">
          <Link href="/projects/archive">Архив проектов</Link>
          <a href="/rss.xml">
            <RssIcon size={16} />
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
