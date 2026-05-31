// Shared helpers for the canvas "portrait" effects (beagle particles + cat
// ASCII). Kept tiny and dependency-free so each component owns its own
// sampling/rendering while reusing color + theme plumbing.

export type RGB = [number, number, number];

/** Parse a CSS color (#rgb, #rrggbb, or rgb()/rgba()) into an [r,g,b] tuple. */
export function parseRGB(value: string, fallback: RGB): RGB {
  const v = value.trim();
  if (!v) return fallback;
  if (v.startsWith("#")) {
    let hex = v.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const n = parseInt(hex, 16);
    if (Number.isNaN(n)) return fallback;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = v.match(/(\d+(?:\.\d+)?)/g);
  if (m && m.length >= 3) {
    return [Number(m[0]), Number(m[1]), Number(m[2])];
  }
  return fallback;
}

/** Read a CSS custom property off :root (live, so it tracks theme changes). */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** True when the warm "fireside" dark theme is active. */
export function isDarkTheme(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** Rec. 709 luminance of an RGBA pixel, normalized 0..1. */
export function luminance(
  r: number,
  g: number,
  b: number
): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * "Ink" = how much a pixel should be drawn, given the active theme.
 *
 * This is the core fix for the light-mode "grey ghost": ink must track
 * contrast away from the paper, not raw photo brightness.
 *  - dark theme  → light ink on dark paper, so bright pixels get ink (ink = L)
 *  - light theme → dark ink on light paper, so dark pixels get ink (ink = 1-L)
 *
 * A gamma curve sharpens the result (stronger in light mode) so mid-tones
 * recede and real features (eyes/nose/edges) carry the portrait instead of
 * smearing into a uniform haze.
 */
export function inkFromLuminance(L: number, dark: boolean): number {
  const raw = dark ? L : 1 - L;
  const gamma = dark ? 1.05 : 1.45;
  return Math.pow(Math.max(0, Math.min(1, raw)), gamma);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
