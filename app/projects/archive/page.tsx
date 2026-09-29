import Scramble from "@/components/Scramble";
import type { Metadata } from "next";
import Link from "next/link";
import ProjectList from "@/components/ProjectList";
import { BackIcon } from "@/components/Icons";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Архив проектов" };

export default function ArchivePage() {
  const projects = getProjects({ archived: true }).map(({ html: _html, ...rest }) => rest);

  return (
    <div className="page">
      <Link href="/projects" className="back-link">
        <BackIcon size={16} />
        Текущие проекты
      </Link>
      <header className="page-head">
        <h1 className="page-title">
          <Scramble text="Архив" />
        </h1>
        <p className="page-sub">Завершённые и старые проекты. Они больше не обновляются, но остаются здесь для истории.</p>
      </header>
      {projects.length ? (
        <ProjectList projects={projects} />
      ) : (
        <p className="empty">
          В архиве пусто. Чтобы отправить проект сюда, добавьте в его файл строку <code>archived: true</code>.
        </p>
      )}
    </div>
  );
}
