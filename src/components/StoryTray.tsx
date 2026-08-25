import { motion, useReducedMotion } from "motion/react";
import type { Story } from "../lib/stories";

export default function StoryTray({
  stories,
  seenIds,
  onOpen,
}: {
  stories: Story[];
  seenIds: ReadonlySet<string>;
  onOpen: (index: number) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div>
      <p className="px-5 text-xs font-semibold uppercase tracking-[0.24em] text-oro">
        Momentos
      </p>
      <ul
        className="no-scrollbar flex gap-3 overflow-x-auto px-5 py-3"
        aria-label="Momentos del viaje"
      >
        {stories.map((story, index) => {
          const seen = seenIds.has(story.id);
          return (
            <li key={story.id} className="shrink-0">
              <motion.button
                type="button"
                onClick={() => onOpen(index)}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{
                  delay: reduce ? 0 : index * 0.04,
                  duration: reduce ? 0 : 0.3,
                }}
                className="flex min-h-12 w-[4.75rem] flex-col items-center gap-1.5 touch-manipulation"
                aria-label={`Ver momento: ${story.label}`}
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full p-[2px] ${
                    seen
                      ? "bg-borde"
                      : "bg-gradient-to-tr from-oro via-oro-suave to-[#f3e5ab]"
                  }`}
                >
                  <img
                    src={story.image}
                    alt=""
                    className="h-full w-full rounded-full border-2 border-noche object-cover"
                  />
                </span>
                <span className="w-full truncate text-center text-sm leading-tight text-marfil">
                  {story.label}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
