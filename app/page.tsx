import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import Cover from "@/components/Cover";
import { getPosts, getProjects } from "@/lib/content";
import { formatDate, plural } from "@/lib/format";

export default function HomePage() {
  const [latest] = getPosts();
  const projects = getProjects().slice(0, 3);

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

      <div className="home__grid">
        {latest && (
          <section aria-labelledby="latest-heading">
            <h2 className="section-title" id="latest-heading">
              Свежий пост
            </h2>
            <article className="feature">
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
              <li key={p.slug} className="mini-project">
                <div className="mini-project__cover">
                  <Cover seed={p.slug} src={p.cover} />
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
