import Scramble from "@/components/Scramble";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";

export default function NotFound() {
  return (
    <div className="page not-found">
      <div className="not-found__code">
        <Wordmark word="404" as="p" />
      </div>
      <h1 className="page-title">
          <Scramble text="Такой страницы нет" />
        </h1>
      <p className="page-sub">
        Возможно, ссылка устарела. Откройте <Link href="/posts">посты</Link>, <Link href="/projects">проекты</Link> или
        нажмите <span className="nowrap"><kbd>Ctrl</kbd> + <kbd>K</kbd>,</span> чтобы найти нужное.
      </p>
    </div>
  );
}
