"use client";

import Link from "next/link";
import { useState } from "react";
import { formatShortDate, plural } from "@/lib/format";
import type { Post } from "@/lib/content";

type Item = Omit<Post, "html">;

export default function PostList({ posts }: { posts: Item[] }) {
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));
  const [tag, setTag] = useState<string | null>(null);
  const shown = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  const years = new Map<string, Item[]>();
  for (const post of shown) {
    const year = post.date.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), post]);
  }

  return (
    <>
      {tags.length > 1 && (
        <div className="chips" role="group" aria-label="Фильтр по теме">
          <button type="button" className="chip" aria-pressed={tag === null} onClick={() => setTag(null)}>
            Все темы
          </button>
          {tags.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {[...years].map(([year, items]) => (
        <section key={year} className="year" aria-labelledby={`year-${year}`}>
          <h2 className="year__label" id={`year-${year}`}>
            {year}
          </h2>
          <ol className="post-list">
            {items.map((p) => (
              <li key={p.slug} className="post-row">
                <time className="post-row__date" dateTime={p.date}>
                  {formatShortDate(p.date)}
                </time>
                <div>
                  <h3 className="post-row__title">
                    <Link href={`/posts/${p.slug}`} className="stretched">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="post-row__excerpt">{p.excerpt}</p>
                  <p className="meta">
                    <span>
                      {p.readingMinutes} {plural(p.readingMinutes, "минута", "минуты", "минут")} чтения
                    </span>
                    {p.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
