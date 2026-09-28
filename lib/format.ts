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

export const SITE = {
  name: "fattula",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fattula.vercel.app",
  description: "Посты и проекты fattula: что делаю, как делаю и что из этого вышло.",
};
