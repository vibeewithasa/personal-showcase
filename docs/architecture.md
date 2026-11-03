# Current architecture

This document describes the code on the default branch, not a planned portfolio-template refactor.

## Entry and routing

- `src/main.tsx` mounts the React application.
- `src/App.tsx` provides `BrowserRouter`.
- `src/routes/PersonalShowcaseRoutes.tsx` currently registers only `/`, rendering `Home`. There is no registered `/contact` route.

## Home composition

`src/pages/Home.tsx` renders a fixed navigation header, an about section, three project cards, and a footer label.

- `NavBar.tsx` handles desktop links, social icons, and a mobile menu toggle.
- `AboutMeContent.tsx` renders the branding and photographer/filmmaker caption.
- `Project.tsx` renders an image and title, with an optional reversed desktop layout.
- `AnimatedSection.tsx` wraps content in Framer Motion viewport animations.

## Content and assets

The three project names and Cloudinary image URLs are currently written directly in `Home.tsx`. Branding and social URLs are in `AboutMeContent.tsx` and `NavBar.tsx`. Local assets live under `src/assets/`.

This is a static client-side React site: the current home page does not fetch project records from an API or content management system.

## Validation

Use `npm run lint` for ESLint and `npm run build` for TypeScript plus Vite production compilation. The repository does not currently define a `test` script.
