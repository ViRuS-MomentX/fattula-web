import { ogImage } from "@/lib/og";

export const dynamic = "force-static";

export function GET() {
  return ogImage({ title: "Посты и проекты", subtitle: "Что делаю, как делаю и что из этого вышло" });
}
