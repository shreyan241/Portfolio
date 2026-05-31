import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative mb-14 max-w-2xl">
      <span aria-hidden="true" className="section-index">
        {index}
      </span>
      <Reveal>
        <span className="mono-label inline-flex items-center gap-2">
          <span className="h-px w-6 bg-[var(--color-accent)]" />
          {index} / {label}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
