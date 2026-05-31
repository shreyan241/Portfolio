# Shreyan Sood - Portfolio

Live: https://shreyan241.github.io/Portfolio/

A modern, single-page portfolio showcasing my work in **Machine Learning**, **AI research**, and **Data Science**. Built with React, Vite, TypeScript, and Tailwind CSS, with a dark-first design and tasteful motion.

## Tech stack

- **React 18 + TypeScript** - component-based UI
- **Vite** - build tooling and dev server
- **Tailwind CSS v4** - styling with CSS-variable theming (light/dark)
- **Framer Motion** - scroll reveals and micro-interactions
- **lucide-react** - icons

## Sections

- **Hero** - intro with an interactive neural-node canvas and a typewriter tagline
- **About** - background, stats, and a skills overview
- **Projects** - filterable grid of research and personal projects (with demo previews)
- **Experience** - vertical timeline of professional roles
- **Contact** - Formspree-powered message form

## Local development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build to dist/
npm run preview  # preview the production build
```

## Deployment

Pushing to `master` triggers the GitHub Actions workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the
site and publishes `dist/` to GitHub Pages.

> One-time setup: in the repository settings under **Pages**, set the
> **Source** to **GitHub Actions**.

The Vite `base` is set to `/Portfolio/` in
[`vite.config.ts`](vite.config.ts) to match the project-site URL.

## Project structure

```
src/
  components/   UI sections and shared components
  data/         Content (profile, projects, experience)
  lib/          Theme, hooks, and helpers
public/         Images, demo GIFs, resume
legacy/         Previous HTML5 UP version (archived)
```
