import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// @ts-ignore This repo does not install Node builtin type declarations.
import { rmSync } from "node:fs";
// @ts-ignore This repo does not install Node builtin type declarations.
import { resolve } from "node:path";

// GitHub Pages project site is served from /Portfolio/
export default defineConfig({
  base: "/Portfolio/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "prune-unreferenced-public-assets",
      closeBundle() {
        // Vite copies all of /public verbatim. Keep source demo files available
        // locally, but do not deploy large demos that the current app never
        // links to.
        for (const file of [
          "dist/demos/grammar.gif",
          "dist/demos/quant.gif",
          "dist/demos/rubiks.gif",
        ]) {
          rmSync(resolve(file), { force: true });
        }
      },
    },
  ],
});
