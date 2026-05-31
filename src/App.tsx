import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./lib/theme";
import { IntroReveal } from "./components/IntroReveal";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Highlights } from "./components/Highlights";
import { Footer } from "./components/Footer";

const About = lazy(() =>
  import("./components/About").then((mod) => ({ default: mod.About }))
);
const Projects = lazy(() =>
  import("./components/Projects").then((mod) => ({ default: mod.Projects }))
);
const Experience = lazy(() =>
  import("./components/Experience").then((mod) => ({ default: mod.Experience }))
);
const Publications = lazy(() =>
  import("./components/Publications").then((mod) => ({ default: mod.Publications }))
);
const Contact = lazy(() =>
  import("./components/Contact").then((mod) => ({ default: mod.Contact }))
);

function LazySection({
  id,
  minHeight,
  children,
}: {
  id: string;
  minHeight: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  const fallback = <div aria-hidden="true" style={{ minHeight }} />;

  return (
    <div ref={ref} id={id}>
      {shouldRender ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <IntroReveal />
        {/* Page-wide warm ambient washes — soft, low-opacity glows that give
            the whole page gentle depth so it never reads flat. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div
            className="absolute -left-[12%] top-[-8%] h-[42vh] w-[42vh] rounded-full opacity-[0.14] blur-[90px] sm:h-[55vh] sm:w-[55vh] sm:opacity-[0.16] sm:blur-[140px]"
            style={{ background: "var(--color-accent)" }}
          />
          <div
            className="absolute right-[-10%] top-[34%] h-[44vh] w-[44vh] rounded-full opacity-[0.1] blur-[96px] sm:h-[60vh] sm:w-[60vh] sm:opacity-[0.12] sm:blur-[150px]"
            style={{ background: "var(--color-accent)" }}
          />
          <div
            className="absolute bottom-[-12%] left-1/3 h-[40vh] w-[44vh] rounded-full opacity-[0.08] blur-[96px] sm:h-[50vh] sm:w-[55vh] sm:opacity-[0.1] sm:blur-[150px]"
            style={{ background: "var(--color-accent)" }}
          />
        </div>

        <Nav />
        <main>
          <Hero />
          <Highlights />
          <LazySection id="about" minHeight="820px">
            <About sectionId={undefined} />
          </LazySection>
          <LazySection id="projects" minHeight="980px">
            <Projects sectionId={undefined} />
          </LazySection>
          <LazySection id="experience" minHeight="860px">
            <Experience sectionId={undefined} />
          </LazySection>
          <LazySection id="research" minHeight="620px">
            <Publications sectionId={undefined} />
          </LazySection>
          <LazySection id="contact" minHeight="760px">
            <Contact sectionId={undefined} />
          </LazySection>
        </main>
        <Footer />
      </MotionConfig>
    </ThemeProvider>
  );
}
