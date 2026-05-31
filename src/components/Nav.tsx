import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "../lib/useActiveSection";

const links = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const active = useActiveSection(links.map((l) => l.id));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border px-4 py-2.5 transition-all duration-300 ${
          scrolled
            ? "border-[var(--color-border)] bg-[var(--color-surface)]/80 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#hero"
          className="flex items-center gap-2 pl-2 font-display text-sm font-semibold"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--color-accent)] font-mono text-xs text-[var(--color-on-accent)]">
            SS
          </span>
          <span className="hidden sm:inline">Shreyan Sood</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active === link.id
                    ? "text-[var(--color-fg)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                }`}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--color-accent-soft)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-1/2 top-20 max-h-[70vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xl md:hidden"
          >
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm transition-colors ${
                  active === link.id
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
