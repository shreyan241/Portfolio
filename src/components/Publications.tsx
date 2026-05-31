import { ArrowUpRight, FileText } from "lucide-react";
import { Container, Reveal, SectionHeading } from "./ui";
import { publications } from "../data/publications";

export function Publications() {
  return (
    <section id="research" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="04"
          label="Research"
          title="Publications"
          description="Peer-reviewed research in machine learning and applied deep learning."
        />

        <div className="space-y-4">
          {publications.map((pub, i) => (
            <Reveal key={pub.title} delay={i * 0.05}>
              <a
                href={pub.href}
                target="_blank"
                rel="noreferrer"
                className="card card-glow group relative flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:flex-row sm:items-start"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <FileText size={20} />
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                      {pub.venue} {pub.year}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-[var(--color-accent)]">
                    {pub.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {pub.authors}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {pub.summary}
                  </p>
                </div>

                <ArrowUpRight
                  size={18}
                  className="hidden shrink-0 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)] sm:block"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
