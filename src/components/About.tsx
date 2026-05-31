import { GraduationCap } from "lucide-react";
import { Container, Reveal, SectionHeading } from "./ui";
import { profile, skills, education } from "../data/profile";

export function About() {
  return (
    <section id="about" className="section-tint py-24 sm:py-32">
      <Container>
        <SectionHeading index="01" label="About" title="A bit about me" />

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-[var(--color-fg)]">
                I'm a machine learning engineer and data scientist focused on
                three things: agentic AI systems, distributed data
                infrastructure at scale, and causal models that quantify real
                impact. My background spans reinforcement learning, LLMs, and
                applied deep learning, with peer-reviewed research.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]">
                Today I'm an Analytics Engineer at Amazon, where I build causal
                ML for large-scale experimentation, AI agents for autonomous
                data exploration, and pipelines that move terabytes daily. I'm
                most excited by work at the edge of research and engineering,
                from RL solvers to fine-tuned LLMs and multi-agent systems.
              </p>
            </Reveal>

            <div className="mt-10 space-y-5">
              {skills.map((group, i) => (
                <Reveal key={group.category} delay={0.15 + i * 0.05}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className="mono-label w-full sm:w-48 sm:shrink-0">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm text-[var(--color-muted)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 space-y-3">
              {education.map((edu, i) => (
                <Reveal key={edu.school} delay={0.2 + i * 0.05}>
                  <div className="card relative flex items-start gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <GraduationCap size={18} />
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <span className="mono-label">{edu.period}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                        {edu.school} &middot; {edu.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="relative mx-auto max-w-xs lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-3xl opacity-30 blur-2xl"
                style={{ background: "var(--color-accent)" }}
              />
              <img
                src={profile.photo}
                alt={profile.name}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-3xl border border-[var(--color-border)] object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
