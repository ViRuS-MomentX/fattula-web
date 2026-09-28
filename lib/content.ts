import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { BASE_PATH } from "./format";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Post = {
  kind: "post";
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  cover?: string;
  readingMinutes: number;
  headings: Heading[];
  html: string;
};

export type Heading = { id: string; text: string };

export type Project = {
  kind: "project";
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  link?: string;
  cover?: string;
  archived: boolean;
  html: string;
};

function readDir(dir: string) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.md$/, ""), data, content };
    });
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

const render = (md: string) =>
  marked
    .parse(md, { async: false })
    .replace(/(href|src)="\/(?!\/)/g, `$1="${BASE_PATH}/`);

/** Gives every h2 an id and returns the list for the table of contents. */
function withHeadings(html: string) {
  const headings: Heading[] = [];
  const out = html.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "");
    const id = slugify(text);
    headings.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, headings };
}

const byDateDesc = (a: { date: string }, b: { date: string }) =>
  b.date.localeCompare(a.date);

export function getPosts(): Post[] {
  return readDir("posts")
    .map(({ slug, data, content }) => ({
      kind: "post" as const,
      slug,
      title: String(data.title),
      excerpt: String(data.excerpt ?? ""),
      date: toDateString(data.date),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      cover: data.cover ? String(data.cover) : undefined,
      readingMinutes: readingMinutes(content),
      ...withHeadings(render(content)),
    }))
    .sort(byDateDesc);
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

export function getProjects({ archived = false } = {}): Project[] {
  return readDir("projects")
    .map(({ slug, data, content }) => ({
      kind: "project" as const,
      slug,
      title: String(data.title),
      excerpt: String(data.excerpt ?? ""),
      date: toDateString(data.date),
      category: String(data.category ?? "Разное"),
      link: data.link ? String(data.link) : undefined,
      cover: data.cover ? String(data.cover) : undefined,
      archived: Boolean(data.archived),
      html: render(content),
    }))
    .filter((p) => p.archived === archived)
    .sort(byDateDesc);
}

export function getProject(slug: string) {
  return [...getProjects(), ...getProjects({ archived: true })].find(
    (p) => p.slug === slug,
  );
}

/** Lightweight index for the command palette (no HTML bodies). */
export function getSearchIndex() {
  const posts = getPosts().map((p) => ({
    href: `/posts/${p.slug}`,
    title: p.title,
    hint: "Пост",
    keywords: [p.excerpt, ...p.tags].join(" "),
  }));
  const projects = [...getProjects(), ...getProjects({ archived: true })].map(
    (p) => ({
      href: `/projects/${p.slug}`,
      title: p.title,
      hint: p.archived ? "Проект в архиве" : "Проект",
      keywords: [p.excerpt, p.category].join(" "),
    }),
  );
  return [...posts, ...projects];
}

export type SearchItem = ReturnType<typeof getSearchIndex>[number];
