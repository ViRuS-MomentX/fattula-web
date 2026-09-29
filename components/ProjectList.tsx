"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/content";
import Cover from "./Cover";
import CoverMorph from "./CoverMorph";

type Item = Omit<Project, "html">;

export default function ProjectList({ projects }: { projects: Item[] }) {
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const [category, setCategory] = useState<string | null>(null);
  const shown = category ? projects.filter((p) => p.category === category) : projects;

  return (
    <>
      {categories.length > 1 && (
        <div className="chips" role="group" aria-label="Фильтр по категории">
          <button type="button" className="chip" aria-pressed={category === null} onClick={() => setCategory(null)}>
            Все
          </button>
          {categories.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      <ul className="project-list">
        {shown.map((p) => (
          <li key={p.slug} className="project-row spot">
            <div className="project-row__text">
              <h2 className="project-row__title">
                <Link href={`/projects/${p.slug}`} className="stretched">
                  {p.title}
                </Link>
              </h2>
              <p className="project-row__excerpt">{p.excerpt}</p>
              <p className="meta">
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                <span className="tag">{p.category}</span>
              </p>
            </div>
            <div className="project-row__cover">
              <CoverMorph id={p.slug}>
                <Cover seed={p.slug} src={p.cover} />
              </CoverMorph>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
