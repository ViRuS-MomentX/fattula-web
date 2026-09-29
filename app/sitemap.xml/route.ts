import { getPosts, getProjects } from "@/lib/content";
import { SITE } from "@/lib/format";

export const dynamic = "force-static";

export function GET() {
  const pages = [
    { path: "/", date: undefined },
    { path: "/posts/", date: undefined },
    { path: "/projects/", date: undefined },
    { path: "/projects/archive/", date: undefined },
    ...getPosts().map((p) => ({ path: `/posts/${p.slug}/`, date: p.date })),
    ...[...getProjects(), ...getProjects({ archived: true })].map((p) => ({
      path: `/projects/${p.slug}/`,
      date: p.date,
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((p) => `  <url><loc>${SITE.url}${p.path}</loc>${p.date ? `<lastmod>${p.date}</lastmod>` : ""}</url>`)
  .join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
