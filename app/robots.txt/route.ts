import { SITE } from "@/lib/format";

export const dynamic = "force-static";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
