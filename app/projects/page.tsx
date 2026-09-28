import type { Metadata } from "next";
import Link from "next/link";
import ProjectList from "@/components/ProjectList";
import { ArchiveIcon } from "@/components/Icons";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Проекты" };

export default function ProjectsPage() {
  const projects = getProjects().map(({ html: _html, ...rest }) => rest);

  return (
    <div className="page">
      <header className="page-head page-head--split">
        <div>
          <h1 className="page-title">Проекты</h1>
          <p className="page-sub">
            Подписаться на <Link href="/posts">посты</Link> и <a href="/rss.xml">RSS-ленту</a>
          </p>
        </div>
        <Link href="/projects/archive" className="button button--icon">
          <ArchiveIcon />
          Архив
        </Link>
      </header>
      {projects.length ? (
        <ProjectList projects={projects} />
      ) : (
        <p className="empty">Проектов пока нет. Добавьте Markdown-файл в папку content/projects.</p>
      )}
    </div>
  );
}
