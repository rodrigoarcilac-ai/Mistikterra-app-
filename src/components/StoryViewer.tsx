import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Story } from "../lib/stories";
import InspireBurst from "./InspireBurst";

const STORY_MS = 5500;
const DOUBLE_TAP_MS = 280;

export default function StoryViewer({
  stories,
  startIndex,
  onClose,
  onSeen,
  inspiredIds,
  onInspire,
}: {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
  onSeen: (id: string) => void;
  inspiredIds: ReadonlySet<string>;
  onInspire: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [burst, setBurst] = useState(false);
  const lastTap = useRef(0);
  const pendingNav = useRef<number | null>(null);
  const indexRef = useRef(startIndex);
  const story = stories[index];

  useEffect(() => {
    if (story) onSeen(story.id);
  }, [onSeen, story]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const goNext = useCallback(() => {
    if (indexRef.current >= stories.length - 1) {
      onClose();
      return;
    }
    indexRef.current += 1;
    setIndex(indexRef.current);
    setProgress(0);
  }, [onClose, stories.length]);

  const goPrev = useCallback(() => {
    indexRef.current = Math.max(0, indexRef.current - 1);
    setIndex(indexRef.current);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const startedAt = Date.now();
    let done = false;
    const id = window.setInterval(() => {
      if (done) return;
      const next = Math.min((Date.now() - startedAt) / STORY_MS, 1);
      setProgress(next);
      if (next >= 1) {
        done = true;
        goNext();
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [goNext, index, reduce]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    return () => {
      if (pendingNav.current) window.clearTimeout(pendingNav.current);
    };
  }, []);

  function inspire() {
    if (!story) return;
    onInspire(story.id);
    setBurst(true);
    window.setTimeout(() => setBurst(false), reduce ? 0 : 700);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    const now = Date.now();
    const x = event.clientX;
    const width = event.currentTarget.getBoundingClientRect().width;
    const isDouble = now - lastTap.current < DOUBLE_TAP_MS;
    lastTap.current = now;

    if (pendingNav.current) {
      window.clearTimeout(pendingNav.current);
      pendingNav.current = null;
    }

    if (isDouble) {
      inspire();
      return;
    }

    pendingNav.current = window.setTimeout(() => {
      pendingNav.current = null;
      if (x < width * 0.35) goPrev();
      else goNext();
    }, DOUBLE_TAP_MS);
  }

  if (!story) return null;

  const inspired = inspiredIds.has(story.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-noche"
      role="dialog"
      aria-modal="true"
      aria-label={`Momento: ${story.title}`}
      onPointerUp={handlePointerUp}
    >
      <img
        src={story.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-noche/70 via-transparent to-noche/90" />
      <InspireBurst show={burst} />

      <div className="relative z-20 flex h-full flex-col pointer-events-none">
        <div className="flex items-center gap-2 px-4 pt-4">
          {stories.map((item, itemIndex) => (
            <div
              key={item.id}
              className="h-1 min-h-0 flex-1 overflow-hidden rounded-full bg-marfil/30"
            >
              <div
                className="h-full bg-oro"
                style={{
                  width:
                    itemIndex < index
                      ? "100%"
                      : itemIndex === index
                        ? `${(reduce ? 1 : progress) * 100}%`
                        : "0%",
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={onClose}
            onPointerUp={(event) => event.stopPropagation()}
            className="pointer-events-auto ml-1 flex min-h-12 min-w-12 items-center justify-center rounded-full text-2xl text-marfil"
            aria-label="Cerrar momentos"
          >
            ✕
          </button>
        </div>

        <div className="flex-1" />

        <div className="px-5 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-oro">
            {story.kind === "meeting"
              ? "Punto de encuentro"
              : story.kind === "teacher"
                ? "Maestro"
                : story.kind === "announcement"
                  ? "Comunicado"
                  : "Itinerario"}
          </p>
          <h2 className="mt-2 font-display text-3xl text-marfil">{story.title}</h2>
          {story.subtitle ? (
            <p className="mt-1 text-base text-marfil-tenue">{story.subtitle}</p>
          ) : null}
          {story.body ? (
            <p className="mt-3 text-base leading-relaxed text-marfil">{story.body}</p>
          ) : null}
          {inspired ? (
            <p className="mt-3 text-base text-oro" aria-live="polite">
              ✦ Me inspira
            </p>
          ) : (
            <p className="mt-3 text-sm text-marfil-tenue">
              Doble toque: me inspira · toca los lados para avanzar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
