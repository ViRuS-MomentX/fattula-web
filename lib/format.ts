const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export const formatDate = (iso: string) =>
  dateFmt.format(new Date(iso)).replace(/\s*г\.$/, "");

export const formatShortDate = (iso: string) =>
  shortFmt.format(new Date(iso)).replace(".", "");

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Base path for GitHub Pages (e.g. "/fattula-web"); empty on a root domain. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative URL with the base path. next/link does this itself. */
export const withBase = (url: string) =>
  url.startsWith("/") && !url.startsWith("//") ? BASE_PATH + url : url;

/**
 * Links shown in the footer under "Контакты". Empty by default, so the column
 * stays hidden until the owner adds their own, for example:
 *   { label: "Telegram", href: "https://t.me/username" },
 *   { label: "GitHub", href: "https://github.com/username" },
 *   { label: "Почта", href: "mailto:name@example.com" },
 */
export const CONTACTS: { label: string; href: string }[] = [];

export const SITE = {
  name: "fattula",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fattula.vercel.app",
  description: "Посты и проекты fattula: что делаю, как делаю и что из этого вышло.",
};
