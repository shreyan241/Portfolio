import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "intro-shown";

// A brief, classy first-load intro: the monogram + name on the warm background,
// which fades/wipes away to reveal the hero. Shown once per session, skipped
// entirely under reduced motion. Purely decorative (aria-hidden), never traps
// focus, lets clicks through, and removes itself from the DOM when done.
export function IntroReveal() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1250);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[var(--color-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* warm glow behind the monogram */}
          <div
            className="absolute h-[42vh] w-[42vh] rounded-full opacity-20 blur-[88px] sm:h-[52vh] sm:w-[52vh] sm:opacity-25 sm:blur-[120px]"
            style={{ background: "var(--color-accent)" }}
          />

          <div className="relative flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid h-20 w-20 place-items-center rounded-2xl bg-[var(--color-accent)] font-mono text-2xl font-bold text-[var(--color-on-accent)] shadow-[0_18px_40px_-16px_var(--color-accent)]"
            >
              SS
            </motion.div>

            <motion.span
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Shreyan Sood
            </motion.span>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="h-[3px] w-24 origin-left rounded-full bg-[var(--color-accent)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
