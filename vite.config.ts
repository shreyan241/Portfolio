import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site is served from /Portfolio/
export default defineConfig({
  base: "/Portfolio/",
  plugins: [react(), tailwindcss()],
});
