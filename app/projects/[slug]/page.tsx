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
  const siblings = getProjects({ archived: project.archived });
  const index = siblings.findIndex((p) => p.slug === project.slug);
  const neighbours = [siblings[index + 1], siblings[index - 1]].filter(Boolean);

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

      {neighbours.length > 0 && (
        <nav className="more-projects" aria-labelledby="more-projects-title">
          <h2 className="section-title" id="more-projects-title">
            Другие проекты
          </h2>
          <ul>
            {neighbours.map((p) => (
              <li key={p.slug} className="more-projects__item spot">
                <div className="more-projects__cover">
                  <Cover seed={p.slug} src={p.cover} />
                </div>
                <div>
                  <h3 className="more-projects__title">
                    <Link href={`/projects/${p.slug}`} className="stretched">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="meta">
                    <span className="tag">{p.category}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
