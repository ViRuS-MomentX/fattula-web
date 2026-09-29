"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/content";
import Cover from "./Cover";
import CoverMorph from "./CoverMorph";
import { ListIcon, ProjectsIcon } from "./Icons";

const VIEW_KEY = "fattula:projects-view";

type Item = Omit<Project, "html">;

export default function ProjectList({ projects }: { projects: Item[] }) {
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const [category, setCategory] = useState<string | null>(null);
  const shown = category ? projects.filter((p) => p.category === category) : projects;
  const [view, setView] = useState<"list" | "grid">("list");

  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === "grid") setView("grid");
    } catch {
      /* storage unavailable: default to the list */
    }
  }, []);

  const choose = (next: "list" | "grid") => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div className="list-toolbar">
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
        <div className="view-toggle" role="group" aria-label="Вид списка">
          <button type="button" aria-pressed={view === "list"} onClick={() => choose("list")} title="Список">
            <ListIcon />
            <span className="sr-only">Список</span>
          </button>
          <button type="button" aria-pressed={view === "grid"} onClick={() => choose("grid")} title="Сетка">
            <ProjectsIcon size={18} />
            <span className="sr-only">Сетка</span>
          </button>
        </div>
      </div>

      <ul className={`project-list project-list--${view}`}>
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
