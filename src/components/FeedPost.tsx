import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { formatTime } from "../lib/format";
import type { FeedItem } from "../lib/stories";
import InspireBurst from "./InspireBurst";

export default function FeedPost({
  item,
  inspired,
  onInspire,
}: {
  item: FeedItem;
  inspired: boolean;
  onInspire: () => void;
}) {
  const reduce = useReducedMotion();
  const lastTap = useRef(0);
  const [burst, setBurst] = useState(false);

  function handleTap() {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      onInspire();
      setBurst(true);
      window.setTimeout(() => setBurst(false), reduce ? 0 : 700);
    } else {
      lastTap.current = now;
    }
  }

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduce ? 0 : 0.4 }}
      className="border-b border-borde/50"
    >
      <header className="flex items-center gap-3 px-5 py-3">
        <span className="flex h-12 w-12 overflow-hidden rounded-full ring-2 ring-oro/70">
          {item.image ? (
            <img src={item.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-carbon text-oro">
              ✦
            </span>
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-marfil">{item.title}</p>
          <p className="text-base text-marfil-tenue">
            {item.location ? `${item.location} · ` : null}
            {formatTime(item.time)}
          </p>
        </div>
      </header>

      {item.image ? (
        <button
          type="button"
          onClick={handleTap}
          className="relative block w-full touch-manipulation"
          aria-label={`${item.title}. Doble toque: me inspira`}
        >
          <img
            src={item.image}
            alt={`${item.title}${item.location ? ` — ${item.location}` : ""}`}
            className="aspect-[4/5] w-full object-cover"
          />
          <InspireBurst show={burst} />
        </button>
      ) : null}

      <div className="px-5 py-4">
        <p className="text-base text-marfil">
          <span className="font-semibold">{item.title} </span>
          {item.caption}
        </p>
        {inspired ? (
          <p className="mt-2 text-base text-oro" aria-live="polite">
            ✦ Me inspira
          </p>
        ) : (
          <p className="mt-2 text-base text-marfil-tenue">Doble toque: me inspira</p>
        )}
      </div>
    </motion.article>
  );
}
