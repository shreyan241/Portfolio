import type { ReactNode } from "react";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowDown, FileText, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { BeaglePortrait } from "./BeaglePortrait";
import { Constellation } from "./Constellation";
import { Container } from "./ui";
import { profile } from "../data/profile";
import { useTypewriter } from "../lib/useTypewriter";

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const { text: typed, mistakeIndex } = useTypewriter([...profile.typewriter]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Soft, warm constellation drifting far in the background — gentle
          ambient texture that sits behind the glows and content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-50 [mask-image:radial-gradient(115%_85%_at_60%_35%,#000_45%,transparent_100%)] dark:opacity-60"
      >
        <Constellation />
      </div>

      {/* Warm, soft radial glows that wrap the beagle as the focal point. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-6%] top-[12%] -z-10 h-[420px] w-[620px] rounded-full opacity-25 blur-[150px]"
        style={{ background: "var(--color-accent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-1/3 -z-10 h-[440px] w-[440px] rounded-full opacity-[0.22] blur-[140px]"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-2.5"
            >
              <span className="mono-label inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
                Based in {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                <Sparkles size={12} />
                Open to ML / Applied Science roles
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 break-words text-[2.5rem] font-bold leading-[1.06] tracking-[-0.025em] sm:text-7xl sm:leading-[1.04] lg:text-[4.75rem]"
            >
              Hi, I'm Shreyan{" "}
              <span className="wave" aria-hidden="true">
                👋
              </span>
              <br />
              <span className="text-gradient">
                {mistakeIndex == null ? typed : typed.slice(0, mistakeIndex)}
                {mistakeIndex != null && (
                  <span className="typo-error">{typed.slice(mistakeIndex)}</span>
                )}
                <span className="ml-1 inline-block w-[2px] animate-pulse self-stretch bg-[var(--color-accent)] align-middle text-transparent">
                  |
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]"
            >
              {profile.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-accent)] shadow-[0_12px_34px_-12px_var(--color-accent)] transition-shadow hover:shadow-[0_18px_44px_-12px_var(--color-accent)]"
                >
                  View my work
                  <ArrowDown
                    size={16}
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <FileText size={16} />
                  Resume
                </a>
              </Magnetic>

              <div className="ml-1 flex items-center gap-1">
                {[
                  { href: profile.socials.github, icon: Github, label: "GitHub" },
                  {
                    href: profile.socials.linkedin,
                    icon: Linkedin,
                    label: "LinkedIn",
                  },
                  { href: profile.socials.email, icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full text-[var(--color-muted)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)]"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Beagle portrait — the warm focal visual, sized down on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-none"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] opacity-30 blur-3xl"
              style={{ background: "var(--color-accent)" }}
            />
            {/* stacked backing panel for a tactile, layered-photo depth */}
            <div
              aria-hidden="true"
              className="absolute inset-1 -z-10 -rotate-3 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface-2)]"
            />
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_44px_84px_-46px_var(--shadow-warm)]">
              <BeaglePortrait />
              {/* soft warm sheen over the top edge */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 55%)",
                }}
              />
            </div>
            {/* playful floating badge */}
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-2 grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-lg shadow-[0_10px_24px_-12px_var(--shadow-warm)]"
            >
              🐾
            </span>
            <span className="mono-label mt-4 flex items-center justify-center gap-2">
              <span className="h-px w-5 bg-[var(--color-accent)]" />
              my debugging partner
            </span>
          </motion.div>
        </div>
      </Container>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-muted)]"
      >
        <ArrowDown size={20} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
