import type { Metadata } from "next";
import Link from "next/link";
import Cover from "@/components/Cover";
import CoverMorph from "@/components/CoverMorph";
import PostList from "@/components/PostList";
import { getPosts } from "@/lib/content";
import { formatDate, plural, withBase } from "@/lib/format";

export const metadata: Metadata = { title: "Посты" };

export default function PostsPage() {
  const posts = getPosts().map(({ html: _html, ...rest }) => rest);
  const [featured, ...rest] = posts;

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Посты</h1>
        <p className="page-sub">
          {posts.length} {plural(posts.length, "пост", "поста", "постов")}. Подписаться можно через{" "}
          <a href={withBase("/rss.xml")}>RSS-ленту</a>.
        </p>
      </header>

      {featured ? (
        <>
          <article className="featured-post spot">
            <div className="featured-post__text">
              <p className="featured-post__label">Свежий пост</p>
              <h2 className="featured-post__title">
                <Link href={`/posts/${featured.slug}`} className="stretched">
                  {featured.title}
                </Link>
              </h2>
              <p className="featured-post__excerpt">{featured.excerpt}</p>
              <p className="meta">
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                <span>
                  {featured.readingMinutes} {plural(featured.readingMinutes, "минута", "минуты", "минут")} чтения
                </span>
                {featured.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </p>
            </div>
            <div className="featured-post__cover">
              <CoverMorph id={featured.slug}>
                <Cover seed={featured.slug} src={featured.cover} />
              </CoverMorph>
            </div>
          </article>
          {rest.length > 0 && <PostList posts={rest} />}
        </>
      ) : (
        <p className="empty">Постов пока нет. Добавьте Markdown-файл в папку content/posts.</p>
      )}
    </div>
  );
}
