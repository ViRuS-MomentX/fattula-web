import { ViewTransition } from "react";

/**
 * Wraps a cover so the browser morphs it between pages: the same cover in a
 * list and on the detail page share a transition name.
 */
export default function CoverMorph({ id, children }: { id: string; children: React.ReactNode }) {
  return <ViewTransition name={`cover-${id}`}>{children}</ViewTransition>;
}
