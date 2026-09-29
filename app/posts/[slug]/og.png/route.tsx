import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { ogImage } from "@/lib/og";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return ogImage({
    title: post.title,
    subtitle: `${formatDate(post.date)}, ${post.readingMinutes} мин чтения`,
  });
}
