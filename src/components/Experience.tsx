import { motion } from "framer-motion";
import { Container, SectionHeading } from "./ui";
import { experiences } from "../data/experience";

export function Experience({ sectionId = "experience" }: { sectionId?: string }) {
  return (
    <section id={sectionId} className="section-tint py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="03"
          label="Journey"
          title="Where I've worked"
          description="From research labs to fast-moving startups and big tech, turning data into insights and ideas into shipped solutions."
        />

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-[var(--color-border)] sm:left-[22px]" />

          <ol className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.li
                key={`${exp.company}-${exp.role}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative pl-14 sm:pl-20"
              >
                <span className="absolute left-0 top-0 grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] sm:h-11 sm:w-11">
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    width={256}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-1"
                  />
                </span>

                <div className="card card-glow relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-semibold">{exp.role}</h3>
                    <span className="mono-label">{exp.period}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                    {exp.company} &middot; {exp.location}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {exp.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-2 text-sm leading-relaxed text-[var(--color-muted)]"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
