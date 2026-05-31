import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { asset } from "../lib/asset";

const RESTING_TILT = -3; // gentle baked-in rotation (deg)
const MAX_TILT = 14; // peak cursor-driven tilt (deg)
const MAX_PARTICLES = 14;
const HEART_COLOR = "#e0617f"; // soft rose that reads on both themes

type Particle = {
  id: number;
  x: number; // horizontal start, % of width
  kind: "heart" | "sparkle";
  size: number;
  dx: number; // horizontal drift (px)
  rise: number; // vertical travel (px)
  dur: number; // seconds
};

// A tactile polaroid of the owner's girlfriend's cats (Amul & Leela). The real
// photo sits in a warm white mat with a thick bottom border. Charming, tasteful
// "wow" touches: an instant-film develop reveal on scroll-in, a slow idle sway,
// a glossy light sweep on hover, and floating hearts/sparkles on hover & tap —
// plus a warm glow that lifts on hover. A 3D cursor tilt springs back to rest.
// Everything decorative is disabled under reduced motion (static developed
// photo), and the cat silhouette is used if the photo fails to load.
export function CatsPolaroid() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [src, setSrc] = useState(asset("images/cats.webp"));
  const [errored, setErrored] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const idRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const rotateX = useSpring(0, { stiffness: 160, damping: 16, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 16, mass: 0.5 });

  const spawn = (count: number) => {
    setParticles((prev) => {
      const additions: Particle[] = [];
      for (let i = 0; i < count; i++) {
        additions.push({
          id: idRef.current++,
          x: 12 + Math.random() * 76,
          kind: Math.random() < 0.5 ? "heart" : "sparkle",
          size: 12 + Math.random() * 10,
          dx: (Math.random() - 0.5) * 44,
          rise: 80 + Math.random() * 60,
          dur: 1.4 + Math.random() * 0.8,
        });
      }
      return [...prev, ...additions].slice(-MAX_PARTICLES);
    });
  };

  const removeParticle = (id: number) =>
    setParticles((prev) => prev.filter((p) => p.id !== id));

  // Only drive hover-based effects on devices that actually hover. On touch,
  // mouseleave is unreliable, so the tilt and heart-trickle could otherwise get
  // stuck; taps still trigger the burst below.
  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !canHover() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * MAX_TILT * 2);
    rotateX.set(-py * MAX_TILT * 2);
  };

  const onEnter = () => {
    if (reduced || !canHover() || intervalRef.current != null) return;
    spawn(1);
    intervalRef.current = window.setInterval(() => spawn(1), 650);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Mouse click: only on hover-capable devices, so the synthetic click that
  // follows a tap doesn't double-fire the burst (touch is handled below).
  const onClick = () => {
    if (reduced || !canHover()) return;
    spawn(7);
  };

  // Touch: emit the burst and a brief press-tilt toward the touch point that
  // cleanly resets on release/cancel, so it feels alive and never sticks.
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (reduced) return;
    spawn(7);
    const t = e.touches[0];
    if (!t || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (t.clientX - rect.left) / rect.width - 0.5;
    const py = (t.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * MAX_TILT);
    rotateX.set(-py * MAX_TILT);
  };

  const onTouchEnd = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const onImgError = () => {
    if (errored) return;
    setErrored(true);
    setSrc(asset("images/cat-silhouette.svg"));
  };

  useEffect(
    () => () => {
      if (intervalRef.current != null) clearInterval(intervalRef.current);
    },
    []
  );

  return (
    <div className="[perspective:1000px]">
      <motion.div
        animate={reduced ? undefined : { y: [0, -7, 0], rotate: [-1.1, 1.1, -1.1] }}
        transition={
          reduced
            ? undefined
            : { duration: 7, ease: "easeInOut", repeat: Infinity }
        }
      >
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onClick={onClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          whileHover={reduced ? undefined : { scale: 1.03 }}
          style={{
            rotateX,
            rotateY,
            rotateZ: RESTING_TILT,
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
            backgroundColor: "#f8f2e8",
            borderColor: "rgba(120, 74, 38, 0.14)",
          }}
          className="group relative w-[min(74vw,236px)] cursor-pointer select-none rounded-[8px] border p-3 pb-11 shadow-[0_18px_40px_-18px_var(--shadow-warm),0_6px_14px_-8px_var(--shadow-warm)]"
        >
          {/* warm accent glow seated behind the print — lifts on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 -z-10 rounded-[14px] opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
            style={{ background: "var(--color-accent)" }}
          />

          <div className="relative overflow-hidden rounded-[4px] bg-[#e7ddcb]">
            {/* instant-film develop reveal on first scroll into view */}
            <motion.div
              initial={
                reduced
                  ? false
                  : {
                      filter:
                        "brightness(0.35) contrast(0.7) saturate(0.15) blur(7px)",
                      opacity: 0.5,
                    }
              }
              whileInView={
                reduced
                  ? undefined
                  : {
                      filter:
                        "brightness(1) contrast(1) saturate(1) blur(0px)",
                      opacity: 1,
                    }
              }
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
            src={src}
            onError={onImgError}
            alt="Amul and Leela, the cats"
            loading="lazy"
            decoding="async"
            draggable={false}
                className={`block aspect-[4/3] w-full ${
                  errored ? "object-contain p-4" : "object-cover"
                }`}
              />
            </motion.div>

            {/* glossy diagonal sheen sweeping across on hover */}
            {!reduced && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -inset-x-1 -translate-x-[140%] -skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-[140%]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                }}
              />
            )}
          </div>

          <p className="mt-3 text-center font-display text-lg italic tracking-tight text-[#4a3a2c]">
            Amul &amp; Leela
          </p>

          {/* floating hearts & sparkles (hover trickle + tap burst) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-visible"
          >
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: -p.rise,
                  x: p.dx,
                  scale: [0.4, 1, 1, 0.85],
                }}
                transition={{ duration: p.dur, ease: "easeOut" }}
                onAnimationComplete={() => removeParticle(p.id)}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  bottom: "22%",
                  color:
                    p.kind === "heart" ? HEART_COLOR : "var(--color-accent)",
                  filter: "drop-shadow(0 1px 3px var(--shadow-warm))",
                }}
              >
                {p.kind === "heart" ? (
                  <Heart size={p.size} fill="currentColor" strokeWidth={0} />
                ) : (
                  <Sparkles size={p.size} strokeWidth={2} />
                )}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
