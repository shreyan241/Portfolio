// One-off image optimizer. Reads the original (large) source images from
// /source-images (kept OUT of the deployed bundle) and writes downscaled WebP
// versions into /public/images at sensible display sizes, plus a small PNG
// favicon. The app only ever references the .webp outputs.
//
//   node scripts/optimize-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "source-images");
const outDir = path.join(root, "public", "images");

// [source, output, maxLongSide, quality]
// Dimensions are tuned to the largest on-screen display size (x2 for retina);
// the beagle still needs enough fidelity for good particle sampling.
const targets = [
  ["beagle.jpg", "beagle.webp", 900, 82],
  ["shreyan_photo.jpg", "shreyan_photo.webp", 760, 80],
  ["cats.jpg", "cats.webp", 640, 80],
  ["rubiks.png", "rubiks.webp", 900, 80],
  ["fine-tune-loss.png", "fine-tune-loss.webp", 900, 80],
  ["foolinglimeshap.png", "foolinglimeshap.webp", 900, 78],
  ["amazon_logo2.png", "amazon_logo2.webp", 256, 90],
  ["PI_logo.jpeg", "PI_logo.webp", 256, 90],
  ["FICO.jpeg", "FICO.webp", 256, 90],
  ["Collablens.jpeg", "Collablens.webp", 256, 90],
];

const kb = (p) => Math.round(fs.statSync(p).size / 1024);

let before = 0;
let after = 0;

for (const [src, out, max, quality] of targets) {
  const srcPath = path.join(srcDir, src);
  const outPath = path.join(outDir, out);
  if (!fs.existsSync(srcPath)) {
    console.warn(`skip (missing source): ${src}`);
    continue;
  }
  const resizeOptions =
    src === "beagle.jpg"
      ? { fit: "cover", position: sharp.strategy.attention }
      : { fit: "inside", withoutEnlargement: true };

  await sharp(srcPath)
    .resize(max, max, resizeOptions)
    .webp({ quality })
    .toFile(outPath);
  before += kb(srcPath);
  after += kb(outPath);
  console.log(`${src} (${kb(srcPath)}KB) -> ${out} (${kb(outPath)}KB)`);
}

// Small square favicon from the portrait.
const favSrc = path.join(srcDir, "shreyan_photo.jpg");
if (fs.existsSync(favSrc)) {
  const favOut = path.join(root, "public", "favicon.png");
  await sharp(favSrc).resize(96, 96, { fit: "cover" }).png().toFile(favOut);
  console.log(`favicon.png (${kb(favOut)}KB)`);
}

console.log(`\nSources: ${before}KB -> WebP: ${after}KB`);
