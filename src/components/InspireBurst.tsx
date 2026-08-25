import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function InspireBurst({ show }: { show: boolean }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {show ? (
        <motion.span
          initial={reduce ? { opacity: 1 } : { scale: 0.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-7xl text-oro drop-shadow-[0_0_18px_rgba(212,175,55,0.85)]"
          aria-hidden
        >
          ♥
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}
