import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import Cover from "@/components/Cover";
import CoverMorph from "@/components/CoverMorph";
import ItemsShowcase from "@/components/ItemsShowcase";
import Marquee from "@/components/Marquee";
import { getPosts, getProjects } from "@/lib/content";
import { formatDate, plural } from "@/lib/format";

export default function HomePage() {
  const [latest] = getPosts();
  const allProjects = getProjects();
  const projects = allProjects.slice(0, 3);
  const topics = Array.from(
    new Set(
      [...allProjects.map((p) => p.category), ...getPosts().flatMap((p) => p.tags)].map(
        (t) => t.charAt(0).toUpperCase() + t.slice(1),
      ),
    ),
  );

  return (
    <div className="page home">
      <section className="hero">
        <Wordmark />
        <div className="hero__intro">
          <p className="lead">
            Здесь я пишу о том, что делаю, и собираю проекты, которые из этого получились.
          </p>
          <p className="hero__actions">
            <Link href="/posts" className="button button--primary">
              Читать посты
            </Link>
            <Link href="/projects" className="button">
              Смотреть проекты
            </Link>
          </p>
        </div>
      </section>

      <ItemsShowcase />

      <Marquee items={topics} />

      <div className="home__grid">
        {latest && (
          <section aria-labelledby="latest-heading">
            <h2 className="section-title" id="latest-heading">
              Свежий пост
            </h2>
            <article className="feature spot">
              <p className="meta">
                <time dateTime={latest.date}>{formatDate(latest.date)}</time>
                <span>
                  {latest.readingMinutes} {plural(latest.readingMinutes, "минута", "минуты", "минут")} чтения
                </span>
              </p>
              <h3 className="feature__title">
                <Link href={`/posts/${latest.slug}`} className="stretched">
                  {latest.title}
                </Link>
              </h3>
              <p className="feature__excerpt">{latest.excerpt}</p>
            </article>
          </section>
        )}

        <section aria-labelledby="projects-heading">
          <div className="section-head">
            <h2 className="section-title" id="projects-heading">
              Проекты
            </h2>
            <Link href="/projects" className="quiet-link">
              Все проекты
            </Link>
          </div>
          <ul className="mini-projects">
            {projects.map((p) => (
              <li key={p.slug} className="mini-project spot">
                <div className="mini-project__cover">
                  <CoverMorph id={p.slug}>
                    <Cover seed={p.slug} src={p.cover} />
                  </CoverMorph>
                </div>
                <div>
                  <h3 className="mini-project__title">
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
        </section>
      </div>
    </div>
  );
}
