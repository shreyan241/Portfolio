import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { Container, Reveal, SectionHeading } from "./ui";
import { DemoModal } from "./DemoModal";
import { projects, type Project } from "../data/projects";

function ProjectCard({
  project,
  onDemo,
}: {
  project: Project;
  onDemo: (p: Project) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="card card-glow group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="relative block aspect-video overflow-hidden bg-[var(--color-surface-2)]"
      >
        <img
          src={project.image}
          alt={project.title}
          width={900}
          height={530}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-[var(--color-bg)]/80 text-[var(--color-fg)] opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </a>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--color-accent)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold leading-snug">{project.title}</h3>

        <ul className="mt-3 space-y-1.5">
          {project.bullets.map((b) => (
            <li
              key={b}
              className="flex gap-2 text-sm leading-relaxed text-[var(--color-muted)]"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-3 pt-1">
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]"
          >
            View project
            <ArrowUpRight size={14} />
          </a>
          {project.demo && (
            <button
              type="button"
              onClick={() => onDemo(project)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              <Play size={13} />
              Demo
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects({ sectionId = "projects" }: { sectionId?: string }) {
  const [filter, setFilter] = useState<string>("All");
  const [demo, setDemo] = useState<Project | null>(null);

  const filters = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.tags.includes(filter)),
    [filter]
  );

  return (
    <section id={sectionId} className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="02"
          label="Work"
          title="Selected projects"
          description="Research, academic, and personal projects across machine learning, AI, and quantitative finance."
        />

        <Reveal>
          <div className="mb-10 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  filter === f
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-on-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.title} project={p} onDemo={setDemo} />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      <DemoModal
        src={demo?.demo ?? null}
        title={demo?.title ?? ""}
        onClose={() => setDemo(null)}
      />
    </section>
  );
}
