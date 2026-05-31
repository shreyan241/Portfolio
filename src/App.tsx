import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./lib/theme";
import { IntroReveal } from "./components/IntroReveal";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Highlights } from "./components/Highlights";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Publications } from "./components/Publications";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

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
            className="absolute -left-[12%] top-[-8%] h-[55vh] w-[55vh] rounded-full opacity-[0.16] blur-[140px]"
            style={{ background: "var(--color-accent)" }}
          />
          <div
            className="absolute right-[-10%] top-[34%] h-[60vh] w-[60vh] rounded-full opacity-[0.12] blur-[150px]"
            style={{ background: "var(--color-accent)" }}
          />
          <div
            className="absolute bottom-[-12%] left-1/3 h-[50vh] w-[55vh] rounded-full opacity-[0.1] blur-[150px]"
            style={{ background: "var(--color-accent)" }}
          />
        </div>

        <Nav />
        <main>
          <Hero />
          <Highlights />
          <About />
          <Projects />
          <Experience />
          <Publications />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </ThemeProvider>
  );
}
