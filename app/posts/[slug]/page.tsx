import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReadingProgress from "@/components/ReadingProgress";
import CodeCopy from "@/components/CodeCopy";
import Toc from "@/components/Toc";
import ShareButton from "@/components/ShareButton";
import { BackIcon } from "@/components/Icons";
import { getPost, getPosts } from "@/lib/content";
import { formatDate, plural } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: `/posts/${post.slug}/og.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const posts = getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];

  return (
    <div className="page article-layout">
      <ReadingProgress />
      <CodeCopy />
      <article className="article">
      <Link href="/posts" className="back-link">
        <BackIcon size={16} />
        Все посты
      </Link>
      <header className="article__head">
        <h1 className="article__title">{post.title}</h1>
        <p className="meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>
            {post.readingMinutes} {plural(post.readingMinutes, "минута", "минуты", "минут")} чтения
          </span>
          {post.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </p>
        <p>
          <ShareButton title={post.title} />
        </p>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

      {(newer || older) && (
        <nav className="pager" aria-label="Другие посты">
          {older && (
            <Link href={`/posts/${older.slug}`} className="pager__link spot">
              <span className="pager__hint">Предыдущий пост</span>
              {older.title}
            </Link>
          )}
          {newer && (
            <Link href={`/posts/${newer.slug}`} className="pager__link pager__link--next spot">
              <span className="pager__hint">Следующий пост</span>
              {newer.title}
            </Link>
          )}
        </nav>
      )}
      </article>
      <aside className="article-aside">
        <Toc headings={post.headings} />
      </aside>
    </div>
  );
}
