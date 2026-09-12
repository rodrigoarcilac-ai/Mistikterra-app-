import { useId, useState } from "react";
import type { Teaching } from "../lib/types";

export default function TeachingCard({ teaching }: { teaching: Teaching }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="rounded-xl border border-oro/30 bg-carbon-elevado/60">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-oro">
            ✦
          </span>
          <span className="font-display text-base font-semibold text-oro">
            Enseñanza del día: {teaching.title}
          </span>
        </span>
        <span
          aria-hidden
          className={`text-oro transition-transform ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>
      {open ? (
        <div id={contentId} className="border-t border-borde px-4 py-4">
          <p className="font-serif text-lg leading-relaxed text-marfil">
            “{teaching.body}”
          </p>
          {teaching.author ? (
            <p className="mt-3 text-sm text-marfil-tenue">— {teaching.author}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
