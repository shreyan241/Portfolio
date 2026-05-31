// One-off image optimizer. Produces downscaled WebP versions of the heavy
// source images the app references, plus a small PNG favicon (the original
// 880KB portrait was being used as the favicon). Originals are left in place.
//
//   node scripts/optimize-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imgDir = path.join(root, "public", "images");

// [source, output, maxLongSide, quality]
const targets = [
  ["beagle.jpg", "beagle.webp", 1200, 80],
  ["shreyan_photo.jpg", "shreyan_photo.webp", 1000, 82],
  ["cats.jpg", "cats.webp", 1200, 82],
  ["rubiks.png", "rubiks.webp", 1300, 82],
  ["fine-tune-loss.png", "fine-tune-loss.webp", 1300, 82],
  ["foolinglimeshap.png", "foolinglimeshap.webp", 1300, 80],
  ["amazon_logo2.png", "amazon_logo2.webp", 256, 90],
  ["PI_logo.jpeg", "PI_logo.webp", 256, 90],
  ["FICO.jpeg", "FICO.webp", 256, 90],
  ["Collablens.jpeg", "Collablens.webp", 256, 90],
];

function kb(p) {
  return Math.round(fs.statSync(p).size / 1024);
}

let before = 0;
let after = 0;

for (const [src, out, max, quality] of targets) {
  const srcPath = path.join(imgDir, src);
  const outPath = path.join(imgDir, out);
  if (!fs.existsSync(srcPath)) {
    console.warn(`skip (missing): ${src}`);
    continue;
  }
  await sharp(srcPath)
    .resize(max, max, { fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toFile(outPath);
  const b = kb(srcPath);
  const a = kb(outPath);
  before += b;
  after += a;
  console.log(`${src} (${b}KB) -> ${out} (${a}KB)`);
}

// Small square favicon from the portrait so the tab icon isn't a ~880KB JPEG.
const favSrc = path.join(imgDir, "shreyan_photo.jpg");
if (fs.existsSync(favSrc)) {
  const favOut = path.join(root, "public", "favicon.png");
  await sharp(favSrc).resize(128, 128, { fit: "cover" }).png().toFile(favOut);
  console.log(`favicon.png (${kb(favOut)}KB)`);
}

console.log(`\nTotal: ${before}KB -> ${after}KB`);
