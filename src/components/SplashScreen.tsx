import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  markSplashSeen,
  splashAlreadySeen,
  SPLASH_FADE_MS,
  SPLASH_HOLD_MS,
} from "../lib/splash";

export default function SplashScreen({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(() => !splashAlreadySeen());
  const visible = Boolean(open && !reduce);

  useEffect(() => {
    if (reduce) {
      markSplashSeen();
      return;
    }
    if (!open) return;
    const id = window.setTimeout(() => {
      markSplashSeen();
      setOpen(false);
    }, SPLASH_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [open, reduce]);

  return (
    <>
      {children}
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="splash"
            role="status"
            aria-label="Mistikterra"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SPLASH_FADE_MS / 1000 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-noche"
          >
            <motion.img
              src="/img/logo-mistikterra.png"
              alt="Mistikterra — Awakening Experiences"
              className="h-24 w-auto max-w-[16rem] object-contain sm:h-28"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
