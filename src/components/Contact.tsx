import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { Container, Reveal, SectionHeading } from "./ui";
import { CatsPolaroid } from "./CatsPolaroid";
import { profile } from "../data/profile";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwpewzod";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-tint py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="05"
          label="Contact"
          title="Let's build something"
          description="Have an opportunity, idea, or just want to say hi? Drop me a message and I'll get back to you."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-[var(--color-muted)]">
                I'm always open to interesting conversations around machine
                learning, data, and ambitious products.
              </p>
              <a
                href={profile.socials.email}
                className="card flex w-full items-center gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 transition-colors hover:border-[var(--color-accent)] sm:inline-flex sm:w-auto"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Mail size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-[var(--color-muted)]">
                    Email me at
                  </span>
                  <span className="block break-all font-medium">
                    {profile.email}
                  </span>
                </span>
              </a>

              {/* A warm closing touch — the unofficial QA team. */}
              <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:items-center sm:gap-6">
                <CatsPolaroid />
                <div className="text-center sm:text-left">
                  <span className="mono-label inline-flex items-center gap-2">
                    <span className="h-px w-6 bg-[var(--color-accent)]" />
                    Quality Assurance Team
                  </span>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Amul &amp; Leela — reviewing every deploy from the couch.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-[0_1px_2px_-1px_var(--shadow-warm),0_18px_46px_-30px_var(--shadow-warm)]"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="input"
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="input"
                  />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Message" htmlFor="message">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about it..."
                    className="input resize-none"
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[var(--color-on-accent)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 size={16} />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send message
                  </>
                )}
              </button>

              {status === "success" && (
                <p className="mt-4 text-sm text-[var(--color-accent)]">
                  Thanks for reaching out, I'll reply soon.
                </p>
              )}
              {status === "error" && (
                <p className="mt-4 text-sm text-red-500">
                  Something went wrong. Email me directly at {profile.email}.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
