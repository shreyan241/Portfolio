import { useEffect, useRef } from "react";
import { asset } from "../lib/asset";
import {
  cssVar,
  inkFromLuminance,
  isDarkTheme,
  luminance,
  parseRGB,
  prefersReducedMotion,
  type RGB,
} from "../lib/portrait";

type Particle = {
  hx: number; // home x (display px)
  hy: number; // home y (display px)
  x: number;
  y: number;
  vx: number;
  vy: number;
  L: number; // raw photo luminance 0..1 (theme-independent)
  ink: number; // theme-aware draw weight 0..1 (opacity + size)
  vis: boolean; // whether this dot reads against the current paper
};

type Sample = { sx: number; sy: number; L: number };
type FocusBounds = { x0: number; y0: number; x1: number; y1: number };
type WeightedValue = { value: number; weight: number };

// Hard cap on the offscreen sampling resolution: we ALWAYS draw the source
// image into a tiny buffer (<= this on the long side) and sample from that, so
// the pixel loop is cheap regardless of the source image's real dimensions.
const SAMPLE_LONG = 150;
const SAMPLE_STEP = 3; // grid step in sampled space (desktop)
const MAX_PARTICLES = 6000;
const POINTER_RADIUS = 110; // px around the pointer that gets disturbed
const FOCUS_PADDING = 0.12;

// Particle portrait of the owner's beagle. Samples a photo (or a built-in
// silhouette fallback) into a grid of dots that scatter away from the cursor
// and spring back home to continuously reform the image. Pauses off-screen and
// renders a single static frame when reduced motion is preferred.
//
// The dot weighting is theme-aware: "ink" tracks contrast away from the paper
// (bright pixels on the dark theme, dark pixels on the light theme) so the
// portrait reads as a crisp warm image in BOTH themes instead of a washed-out
// grey ghost on cream.
export function BeaglePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();

    // Lighter on phones: coarser sampling grid + fewer particles so the array
    // build and per-frame draw stay cheap on mobile CPUs.
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const sampleStep = isMobile ? 4 : SAMPLE_STEP;
    const maxParticles = isMobile ? 2600 : MAX_PARTICLES;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let resizeRaf = 0;
    let resizeRetries = 0;
    let kickoffRaf = 0;
    let idleId = 0;
    let onScreen = true;
    let dark = isDarkTheme();
    let silhouette = false;

    let sampled: Sample[] = [];
    let sw = 0;
    let sh = 0;
    let focusBounds: FocusBounds = { x0: 0, y0: 0, x1: 1, y1: 1 };
    let particles: Particle[] = [];
    let r0 = 1; // base dot radius for current layout
    let animationStarted = false;

    const pointer = { x: -9999, y: -9999, active: false };

    const fg = (): RGB => parseRGB(cssVar("--color-fg"), [241, 232, 218]);
    const accent = (): RGB => parseRGB(cssVar("--color-accent"), [234, 148, 98]);

    // Recompute each dot's theme-aware ink + visibility. Cheap enough to run on
    // every theme toggle and layout pass.
    const applyTheme = () => {
      dark = isDarkTheme();
      const minInk = dark ? 0.1 : 0.16;
      for (const p of particles) {
        const ink = silhouette ? 0.82 : inkFromLuminance(p.L, dark);
        p.ink = ink;
        p.vis = silhouette ? true : ink >= minInk;
      }
    };

    const layout = () => {
      if (!sampled.length || !width || !height) return;
      const focusWidth = Math.max(1, focusBounds.x1 - focusBounds.x0);
      const focusHeight = Math.max(1, focusBounds.y1 - focusBounds.y0);
      // Cover-fit the meaningful ink/detail bounds, not the full landscape
      // photo. The source includes couch/floor around the dog; mapping the
      // full rectangle preserves that empty composition and leaves the beagle
      // small/cornered in the square panel.
      const scale = Math.max(width / focusWidth, height / focusHeight);
      const ox = (width - focusWidth * scale) / 2;
      const oy = (height - focusHeight * scale) / 2;
      r0 = Math.max((sampleStep * scale) / 2, 0.6);
      particles = sampled.map((s) => {
        const hx = ox + (s.sx - focusBounds.x0) * scale;
        const hy = oy + (s.sy - focusBounds.y0) * scale;
        return {
          hx,
          hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          L: s.L,
          ink: 0,
          vis: true,
        };
      });
      applyTheme();
    };

    const radiusFor = (ink: number) => r0 * (0.5 + 0.95 * ink);

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      const [fr, fgv, fb] = fg();
      ctx.fillStyle = `rgb(${fr},${fgv},${fb})`;
      for (const p of particles) {
        if (!p.vis) continue;
        ctx.globalAlpha = Math.min(0.34 + 0.66 * p.ink, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radiusFor(p.ink), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const [fr, fgv, fb] = fg();
      const [ar, ag, ab] = accent();
      const fgStr = `rgb(${fr},${fgv},${fb})`;
      ctx.fillStyle = fgStr;

      for (const p of particles) {
        // spring back toward home
        p.vx += (p.hx - p.x) * 0.055;
        p.vy += (p.hy - p.y) * 0.055;

        // radial push away from the pointer, falling off with distance
        let near = 0;
        if (pointer.active) {
          const mx = p.x - pointer.x;
          const my = p.y - pointer.y;
          const d2 = mx * mx + my * my;
          if (d2 < POINTER_RADIUS * POINTER_RADIUS) {
            const d = Math.sqrt(d2) || 0.001;
            const f = 1 - d / POINTER_RADIUS;
            const force = f * f * 13;
            p.vx += (mx / d) * force;
            p.vy += (my / d) * force;
            near = f;
          }
        }

        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        if (!p.vis) continue;

        const r = radiusFor(p.ink);
        const alpha = Math.min(0.34 + 0.66 * p.ink, 1);
        if (near > 0.02) {
          const t = Math.min(near * 1.5, 1);
          const r2 = (fr + (ar - fr) * t) | 0;
          const g2 = (fgv + (ag - fgv) * t) | 0;
          const b2 = (fb + (ab - fb) * t) | 0;
          ctx.fillStyle = `rgb(${r2},${g2},${b2})`;
          ctx.globalAlpha = Math.min(alpha + near * 0.4, 1);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * (1 + near * 0.7), 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = fgStr;
        } else {
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (!onScreen || document.hidden) {
        animationStarted = false;
        return;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (reduced || animationStarted) return;
      if (!onScreen || document.hidden) return;
      animationStarted = true;
      loop();
    };

    const weightedQuantile = (values: WeightedValue[], q: number) => {
      values.sort((a, b) => a.value - b.value);
      const total = values.reduce((sum, v) => sum + v.weight, 0);
      let acc = 0;
      for (const v of values) {
        acc += v.weight;
        if (acc >= total * q) return v.value;
      }
      return values[values.length - 1]?.value ?? 0;
    };

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const findFocusBounds = (
      data: Uint8ClampedArray,
      isSil: boolean
    ): FocusBounds => {
      if (isSil || sw < 4 || sh < 4) return { x0: 0, y0: 0, x1: sw, y1: sh };

      const xs: WeightedValue[] = [];
      const ys: WeightedValue[] = [];
      const lumAt = (x: number, y: number) => {
        const i = (y * sw + x) * 4;
        return luminance(data[i], data[i + 1], data[i + 2]);
      };

      for (let y = 1; y < sh - 1; y++) {
        for (let x = 1; x < sw - 1; x++) {
          const i = (y * sw + x) * 4;
          if (data[i + 3] / 255 < 0.4) continue;

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const L = luminance(r, g, b);
          const edge =
            Math.abs(L - lumAt(x - 1, y)) +
            Math.abs(L - lumAt(x + 1, y)) +
            Math.abs(L - lumAt(x, y - 1)) +
            Math.abs(L - lumAt(x, y + 1));
          const hi = Math.max(r, g, b);
          const lo = Math.min(r, g, b);
          const saturation = hi === 0 ? 0 : (hi - lo) / hi;
          const contrast = Math.abs(L - 0.5);
          const redDominant = r > g * 1.18 && r > b * 1.18;
          const neutralWarmBoost = saturation < 0.48 ? 0.18 : 0;
          const redPenalty = redDominant ? 0.55 : 1;
          const weight =
            (edge * 2.8 + Math.max(0, contrast - 0.14) * 1.25 + neutralWarmBoost) *
            redPenalty;

          if (weight < 0.32) continue;
          xs.push({ value: x, weight });
          ys.push({ value: y, weight });
        }
      }

      if (xs.length < 30 || ys.length < 30) {
        return { x0: 0, y0: 0, x1: sw, y1: sh };
      }

      let x0 = weightedQuantile(xs, 0.05);
      let x1 = weightedQuantile(xs, 0.95);
      let y0 = weightedQuantile(ys, 0.05);
      let y1 = weightedQuantile(ys, 0.95);
      const boxW = x1 - x0;
      const boxH = y1 - y0;
      const pad = Math.max(sampleStep * 2, Math.max(boxW, boxH) * FOCUS_PADDING);

      x0 = clamp(Math.floor(x0 - pad), 0, sw - 1);
      y0 = clamp(Math.floor(y0 - pad), 0, sh - 1);
      x1 = clamp(Math.ceil(x1 + pad), x0 + 1, sw);
      y1 = clamp(Math.ceil(y1 + pad), y0 + 1, sh);

      if ((x1 - x0) * (y1 - y0) < sw * sh * 0.12) {
        return { x0: 0, y0: 0, x1: sw, y1: sh };
      }

      return { x0, y0, x1, y1 };
    };

    const buildSamples = (image: HTMLImageElement, isSil: boolean) => {
      const iw = image.naturalWidth || image.width;
      const ih = image.naturalHeight || image.height;
      if (!iw || !ih) return;
      silhouette = isSil;
      const scale = SAMPLE_LONG / Math.max(iw, ih);
      sw = Math.max(1, Math.round(iw * scale));
      sh = Math.max(1, Math.round(ih * scale));

      const off = document.createElement("canvas");
      off.width = sw;
      off.height = sh;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.clearRect(0, 0, sw, sh);
      octx.drawImage(image, 0, 0, sw, sh);

      let data: Uint8ClampedArray;
      try {
        data = octx.getImageData(0, 0, sw, sh).data;
      } catch {
        return;
      }

      const next: Sample[] = [];
      const bounds = findFocusBounds(data, isSil);
      for (let y = 0; y < sh; y += sampleStep) {
        for (let x = 0; x < sw; x += sampleStep) {
          if (
            x < bounds.x0 ||
            x > bounds.x1 ||
            y < bounds.y0 ||
            y > bounds.y1
          ) {
            continue;
          }
          const i = (y * sw + x) * 4;
          const a = data[i + 3] / 255;
          if (a < 0.4) continue;
          // Keep raw luminance only; theme-aware ink/visibility is derived later
          // so a theme toggle never needs to re-sample the image.
          const L = isSil ? 0.85 : luminance(data[i], data[i + 1], data[i + 2]);
          next.push({ sx: x, sy: y, L });
        }
      }

      // safety cap: thin out evenly if a dense photo overshoots the budget
      if (next.length > maxParticles) {
        const keep = maxParticles / next.length;
        sampled = next.filter((_, idx) => (idx * keep) % 1 < keep);
      } else {
        sampled = next;
      }
      focusBounds = bounds;

      layout();
      if (reduced) {
        drawStatic();
      } else {
        startLoop();
      }
    };

    // Run a callback when the main thread is idle (so the heavy-ish sampling
    // never blocks first paint or the typewriter), with a setTimeout fallback.
    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(cb, { timeout: 800 });
      } else {
        idleId = window.setTimeout(cb, 200);
      }
    };

    let triedFallback = false;
    const loadImage = (src: string, isSil: boolean) => {
      const image = new Image();
      image.decoding = "async"; // decode off the main thread
      image.onload = () => idle(() => buildSamples(image, isSil));
      image.onerror = () => {
        if (!triedFallback) {
          triedFallback = true;
          loadImage(asset("images/beagle-silhouette.svg"), true);
        }
      };
      image.src = src;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      // Guard against a transient 0 measurement (e.g. before an aspect-ratio
      // box has resolved its height); retry next frame so we never lock in a
      // tiny/mis-scaled canvas. Bounded so it can't spin forever.
      if (!w || !h) {
        if (resizeRetries < 90) {
          resizeRetries++;
          resizeRaf = requestAnimationFrame(resize);
        }
        return;
      }
      resizeRetries = 0;
      width = w;
      height = h;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
      if (reduced) drawStatic();
    };

    const setPointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      pointer.active = x >= 0 && x <= width && y >= 0 && y <= height;
    };
    const onMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && particles.length) startLoop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && onScreen && particles.length) startLoop();
    };

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Re-tint live when the user flips the theme toggle.
    const themeObserver = new MutationObserver(() => {
      applyTheme();
      if (reduced) drawStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", onLeave, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    // Kick off the (capped, downscaled) sampling AFTER first paint so the hero
    // text and typewriter render/animate immediately — never gated on this.
    kickoffRaf = requestAnimationFrame(() => {
      loadImage(asset("images/beagle.webp"), false);
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      cancelAnimationFrame(kickoffRaf);
      if (idleId) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
      }
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onLeave);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
