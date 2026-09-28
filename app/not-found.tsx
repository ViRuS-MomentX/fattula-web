import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page not-found">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1 className="page-title">Такой страницы нет</h1>
      <p className="page-sub">
        Возможно, ссылка устарела. Откройте <Link href="/posts">посты</Link>, <Link href="/projects">проекты</Link> или
        нажмите <kbd>Ctrl</kbd> + <kbd>K</kbd>, чтобы найти нужное.
      </p>
    </div>
  );
}
