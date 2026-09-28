import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import CodeCopy from "@/components/CodeCopy";
import { BackIcon, ExternalIcon } from "@/components/Icons";
import { getProject, getProjects } from "@/lib/content";
import { formatDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...getProjects(), ...getProjects({ archived: true })].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.excerpt };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <article className="page article">
      <CodeCopy />
      <Link href={project.archived ? "/projects/archive" : "/projects"} className="back-link">
        <BackIcon size={16} />
        {project.archived ? "Архив проектов" : "Все проекты"}
      </Link>
      <div className="article__cover">
        <Cover seed={project.slug} src={project.cover} alt={project.title} />
      </div>
      <header className="article__head">
        <h1 className="article__title">{project.title}</h1>
        <p className="meta">
          <time dateTime={project.date}>{formatDate(project.date)}</time>
          <span className="tag">{project.category}</span>
          {project.archived && <span className="tag tag--muted">В архиве</span>}
        </p>
        <p className="lead">{project.excerpt}</p>
        {project.link && (
          <p>
            <a href={project.link} className="button button--primary button--icon" target="_blank" rel="noreferrer">
              Открыть проект
              <ExternalIcon />
            </a>
          </p>
        )}
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: project.html }} />
    </article>
  );
}
