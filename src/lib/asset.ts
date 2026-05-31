// Resolve a path inside /public against Vite's configured base ("/Portfolio/"),
// so assets work both locally and on GitHub Pages.
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, "");
  return `${base}${clean}`;
}
