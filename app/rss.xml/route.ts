import { getPosts, getProjects } from "@/lib/content";
import { SITE } from "@/lib/format";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = [
    ...getPosts().map((p) => ({ ...p, url: `${SITE.url}/posts/${p.slug}/`, category: "Пост" })),
    ...getProjects().map((p) => ({ ...p, url: `${SITE.url}/projects/${p.slug}/`, category: "Проект" })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${escape(SITE.description)}</description>
    <language>ru</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${escape(i.title)}</title>
      <link>${i.url}</link>
      <guid>${i.url}</guid>
      <category>${i.category}</category>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <description>${escape(i.excerpt)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
