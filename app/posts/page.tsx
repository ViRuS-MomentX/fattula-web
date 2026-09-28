import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getPosts } from "@/lib/content";
import { plural, withBase } from "@/lib/format";

export const metadata: Metadata = { title: "Посты" };

export default function PostsPage() {
  const posts = getPosts().map(({ html: _html, ...rest }) => rest);

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Посты</h1>
        <p className="page-sub">
          {posts.length} {plural(posts.length, "пост", "поста", "постов")}. Подписаться можно через{" "}
          <a href={withBase("/rss.xml")}>RSS-ленту</a>.
        </p>
      </header>
      {posts.length ? (
        <PostList posts={posts} />
      ) : (
        <p className="empty">Постов пока нет. Добавьте Markdown-файл в папку content/posts.</p>
      )}
    </div>
  );
}
