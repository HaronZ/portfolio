# Haronzie — Portfolio

Apple-style scroll-driven portfolio built with Next.js, TypeScript, Motion (Framer Motion) and Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Edit your content

- `lib/projects.ts` — your project cards (titles, descriptions, tags)
- `components/Hero.tsx` — your name and tagline
- `components/About.tsx` — bio, stats, skills
- `components/Contact.tsx` — email links
- `app/globals.css` — colors and styling (design tokens at the top)

## Deploy

Push to GitHub and import the repo at https://vercel.com — zero config needed.

The original no-framework version lives in `vanilla-backup/` (open its `index.html` directly in a browser).
