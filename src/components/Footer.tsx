import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { Container } from "./ui";
import { profile } from "../data/profile";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display font-semibold">{profile.name}</p>
          <p className="text-sm text-[var(--color-muted)]">
            {profile.role} &middot; {profile.location}
          </p>
        </div>

        <div className="flex items-center gap-1">
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
          <a
            href="#hero"
            aria-label="Back to top"
            className="ml-2 grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <ArrowUp size={18} />
          </a>
        </div>
      </Container>
      <Container className="mt-8">
        <p className="text-center text-xs text-[var(--color-muted)]">
          &copy; {new Date().getFullYear()} {profile.name}. Built with React,
          Vite & Tailwind.
        </p>
      </Container>
    </footer>
  );
}
