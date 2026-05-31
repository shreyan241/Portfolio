import type { ReactNode } from "react";
import {
  ArrowUpRight,
  FileText,
  Github,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Container, Reveal } from "./ui";
import { asset } from "../lib/asset";
import { profile } from "../data/profile";

function Tile({
  className = "",
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="card card-glow relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        {children}
      </div>
    </Reveal>
  );
}

const focusAreas = [
  "Agentic AI / LLMs",
  "Causal Inference",
  "Distributed Data Infra",
  "Reinforcement Learning",
];

// A modern bento grid of highlights placed right after the hero. Varied tile
// sizes, cohesive warm cards with hover lift, and a clean single/two-column
// stack on mobile.
export function Highlights() {
  return (
    <section id="highlights" className="relative py-12 sm:py-16">
      <Container>
        <Reveal>
          <span className="mono-label inline-flex items-center gap-2">
            <span className="h-px w-6 bg-[var(--color-accent)]" />
            At a glance
          </span>
        </Reveal>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 md:auto-rows-[8.5rem] md:grid-cols-4">
          {/* Current role — large anchor tile */}
          <Tile className="col-span-2 md:col-span-2 md:row-span-2">
            <span className="mono-label inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              Currently
            </span>
            <div className="mt-auto flex items-center gap-4 pt-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
                <img
                  src={asset("images/amazon_logo2.webp")}
                  alt="Amazon"
                  width={256}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain p-2"
                />
              </span>
              <div>
                <h3 className="text-xl font-semibold leading-tight sm:text-2xl">
                  Analytics Engineer
                </h3>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  Amazon &middot; Austin, TX
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
              Causal ML for large-scale experimentation, AI analytics agents,
              and pipelines moving terabytes daily.
            </p>
          </Tile>

          {/* Focus areas */}
          <Tile className="col-span-2 md:col-span-2" delay={0.05}>
            <span className="mono-label inline-flex items-center gap-2">
              <Sparkles size={13} />
              Focus areas
            </span>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {focusAreas.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 text-sm text-[var(--color-fg)]"
                >
                  {f}
                </span>
              ))}
            </div>
          </Tile>

          {/* Education */}
          <Tile className="col-span-2 md:col-span-2" delay={0.1}>
            <span className="mono-label inline-flex items-center gap-2">
              <GraduationCap size={14} />
              Education
            </span>
            <div className="mt-auto pt-5">
              <h3 className="font-semibold">M.S., Data Science</h3>
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                UC San Diego &middot; 2024
              </p>
            </div>
          </Tile>

          {/* Open to roles — accent tile */}
          <div className="col-span-2 md:col-span-2">
            <Reveal delay={0.15} className="h-full">
              <a
                href="#contact"
                className="card group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-5 text-[var(--color-on-accent)] sm:p-6"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent), #d4763f)",
                }}
              >
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-on-accent)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-on-accent)]" />
                  </span>
                  Available
                </span>
                <div className="mt-6 flex items-end justify-between gap-3">
                  <p className="text-lg font-semibold leading-snug">
                    Open to ML / Applied Science roles
                  </p>
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </a>
            </Reveal>
          </div>

          {/* Links */}
          <Tile className="col-span-2 md:col-span-2" delay={0.2}>
            <div className="flex h-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold">Explore more</h3>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  Code, projects, and the full résumé.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-on-accent)] transition-transform hover:-translate-y-0.5"
                >
                  <FileText size={16} />
                  Résumé
                </a>
              </div>
            </div>
          </Tile>
        </div>
      </Container>
    </section>
  );
}
