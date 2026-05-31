// Generates the 1200x630 Open Graph / social share image in the warm palette.
//   node scripts/make-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "og.png");

const W = 1200;
const H = 630;

// Warm "sunlit paper" palette, matching the light theme tokens.
const BG = "#fbf6ec";
const SURFACE = "#fffdf8";
const FG = "#2a2017";
const MUTED = "#6b5f4d";
const ACCENT = "#b65324";
const BORDER = "#e9ddc8";

const dots = [];
for (let r = 0; r < 7; r++) {
  for (let c = 0; c < 4; c++) {
    dots.push(
      `<circle cx="${940 + c * 46}" cy="${120 + r * 46}" r="4" fill="${ACCENT}" opacity="${0.12 + ((r + c) % 3) * 0.06}"/>`
    );
  }
}

const font =
  "'Segoe UI', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g1" cx="18%" cy="22%" r="60%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="88%" cy="86%" r="55%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mono" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ACCENT}"/>
      <stop offset="100%" stop-color="#d4763f"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <!-- inner frame -->
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" rx="28"
        fill="${SURFACE}" stroke="${BORDER}" stroke-width="2" opacity="0.55"/>

  <!-- decorative dot motif -->
  <g>${dots.join("")}</g>

  <!-- monogram badge -->
  <rect x="100" y="104" width="92" height="92" rx="22" fill="url(#mono)"/>
  <text x="146" y="167" font-family="${font}" font-size="44" font-weight="700"
        fill="${SURFACE}" text-anchor="middle">SS</text>

  <text x="212" y="150" font-family="${font}" font-size="26" font-weight="600"
        letter-spacing="3" fill="${MUTED}">PORTFOLIO</text>
  <text x="212" y="184" font-family="${font}" font-size="20" font-weight="500"
        letter-spacing="1" fill="${ACCENT}">shreyan241.github.io/Portfolio</text>

  <!-- name -->
  <text x="100" y="360" font-family="${font}" font-size="104" font-weight="700"
        fill="${FG}">Shreyan Sood</text>

  <!-- accent bar -->
  <rect x="104" y="398" width="180" height="8" rx="4" fill="${ACCENT}"/>

  <!-- subtitle -->
  <text x="100" y="470" font-family="${font}" font-size="44" font-weight="600"
        fill="${MUTED}">ML Engineer &amp; Data Scientist</text>

  <!-- tags -->
  <text x="100" y="536" font-family="${font}" font-size="28" font-weight="500"
        fill="${FG}" opacity="0.8">Agentic AI &#183; Causal ML &#183; LLMs &#183; Distributed Data</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`wrote ${out}`);
