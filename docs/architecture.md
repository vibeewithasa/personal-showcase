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

## Document head and icon

`index.html`, rather than a React component, owns the current document title (`CHRIZ ㋛`), page language (`en`) and remote favicon URL. It does not currently provide a `meta name="description"` tag. The favicon `link` declares `type="image/svg+xml"`, but its Cloudinary resource path ends in `.jpg` with image-format negotiation parameters; confirm the response format and declare a matching type if the asset is updated.

A rebrand or search-preview update needs to review this HTML alongside `NavBar.tsx`, `AboutMeContent.tsx` and `Home.tsx`; editing the visible React logo alone does not change the browser tab icon or title. This identifies source-code maintenance points, not verified live search or social-preview behavior.

## Direct links and static hosting

`App.tsx` wraps the application in `BrowserRouter`, which uses normal URL paths rather than hash fragments. The only route in `PersonalShowcaseRoutes.tsx` today is `/`, so direct access to `/contact` is unsupported at the React routing layer. If the app adds a real route, the static host must also be configured to serve the SPA entry document for that path; otherwise a page that works after client-side navigation may respond with a server-side 404 when opened directly or refreshed. This repository does not contain a verified production-host rewrite rule. Test hard refresh and private-window deep links on the selected host before announcing a route as available.

## Validation

Use `npm run lint` for ESLint and `npm run build` for TypeScript plus Vite production compilation. The repository does not currently define a `test` script.
