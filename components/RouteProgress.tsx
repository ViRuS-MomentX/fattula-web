"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Thin bar at the top of the page while a navigation is in flight. */
export default function RouteProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || /\.\w+$/.test(url.pathname)) return;
      clearTimeout(timer.current);
      setState("loading");
    };
    // Capture phase: next/link calls preventDefault before a bubbling listener would run.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    setState((s) => (s === "loading" ? "done" : s));
    timer.current = setTimeout(() => setState("idle"), 400);
    return () => clearTimeout(timer.current);
  }, [pathname]);

  return <div className="route-progress" data-state={state} aria-hidden="true" />;
}
