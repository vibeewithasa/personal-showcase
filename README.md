# CHRIZ — Photography & film

A photography-first portfolio for CHRIZ, developed by repository owner `vibeewithasa`. Dark compositions, expressive CHRIZ typography, large photographs and restrained motion form the visual identity. The application also works as a configurable portfolio template.

## Develop

Use Node.js 24 LTS and npm (validated with Node 24.19.0 / npm 11.9.0).

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
npm run test:content
```

No database, API key, Instagram account or backend is required. Dependencies are installed from `package-lock.json`. No application environment variables are required, so no `.env.example` is necessary. Site metadata and the optional real production origin are configured in `src/content/site.ts`.

## Features

Home, portfolio, individual project pages, about and direct-contact pages share navigation and a footer. Projects support category filtering, mixed-aspect photo collections, optional metadata, captions, credits and native video. The native-dialog lightbox supports Escape, arrow keys, wrapping previous/next navigation, focus restoration and touch swipes. Responsive layouts, skip navigation, visible focus and reduced motion are included. Images load lazily except leading images, with responsive Cloudinary delivery transformations and accessible unavailable-image states.

## Customize content

Edit **`src/content/portfolio.ts`**. Its exported interfaces describe every supported field. Components read this catalog directly; customization does not require rewriting them. Keeping a small, typed catalog in source is deliberate: it avoids a runtime API dependency and does not require credentials. Media stays on an external host. If that host fails, the page retains its structure, displays an unavailable-image message and offers a gallery retry action. Builds reject unsafe media URLs, duplicate slugs/IDs, invalid dimensions, unknown categories and missing cover references. Rendering failures have an accessible recovery screen.

- Identity: `name`, `profession`, `logo` (plus measured `logoWidth`/`logoHeight`); optional `biography` and `email`. The default uses the original, already tracked CHRIZ eyes logo; no new photograph is bundled.
- Social links: `socials: [{ label, url }]`. Only the supplied official Instagram reference is enabled. Historic Facebook/YouTube links have not been independently verified and are not published as verified contacts.
- Categories: add names to `categories` and matching `category` values to projects. Without categories the filter is hidden.
- Select a cover: set `coverId` to a photo ID in the project gallery. Omitting it selects the first photograph; selecting another cover does not reorder the gallery.
- Cover presentation: images are uncropped by default. Set a project’s `coverFit: 'cover'` only after approving its crop; optionally set `coverAspectRatio` (a positive width/height ratio) and the photograph’s `focalPoint` (CSS object-position, e.g. `'50% 30%'`). These are thumbnail-only layout choices; galleries retain the full image.
- Projects: unique URL-safe `slug`, `title`, optional `description`, `metadata: [{label, value}]`, `category` and `video: {src, title}`. Use direct HTTPS video URLs for native playback, not arbitrary embeds. Supply optional `video.captions: [{src, label, language}]` WebVTT tracks for spoken audio, and an accessible transcript when needed.
- Photos: unique `id`, permanent HTTPS `src`, descriptive `alt`, `width`, `height`, optional `caption` and `credit`. Enter the actual original dimensions for new images. The original dimensions of the three Cloudinary covers remain unverified and are deliberately omitted. Until measured dimensions are configured or the image loads, a 4:3 frame is a layout fallback, not a claim about the original. Supply measured dimensions before release to avoid layout shifts when the actual image ratio differs. Loading and unavailable-image states preserve that frame. Detail galleries and fullscreen images use `contain` to avoid cropping. Empty galleries show a useful message.

Example project (replace all example content with authorized material):

```ts
{
  slug: 'your-project',
  title: 'Your project title',
  category: 'Your category',
  description: 'Your approved project description',
  metadata: [{ label: 'Year', value: 'Your verified year' }],
  images: [{
    id: 'unique-photo-id',
    src: 'https://your-media-host.example/approved-photo.jpg',
    alt: 'Describe the actual photograph',
    width: 1600, height: 2400,
    caption: 'Optional approved caption', credit: 'Verified rights holder',
  }],
}
```

Use stable Cloudinary public delivery URLs or another photographer-approved HTTPS host. Known Cloudinary image delivery URLs receive automatic format, quality and width transformations; other hosts are passed through. The application never needs Cloudinary upload credentials. Do not use expiring Instagram CDN URLs. Do not expose API tokens in client code or `VITE_*` variables. Validate and review all catalog URLs before publishing.

## Initial content and outstanding media

The initial catalog reuses only the existing DEVON X CHRIZ, UCBFW X CHRIZ and ITZA X CHRIZ Cloudinary covers. Each project currently has **one photograph**, not a fabricated full shoot. No client names beyond existing project titles, descriptions, dates, credits, testimonials or biographical claims were added. CHRIZ's supplied role is photographer and filmmaker.

To complete the editorial content, obtain photographer-approved full-resolution selections for each project, accurate image dimensions and alt descriptions, optional captions/credits, verified project details and biography, and an optional booking email. Instagram could not be investigated because the environment denied access; no media was scraped or downloaded. Cloudinary was also denied by the environment's outbound policy, so live-photo delivery and final image crops require review on an allowed network. The environment draft now adds `res.cloudinary.com`, `www.instagram.com` and `instagram.com` to the allowed destinations while retaining package-manager presets. Review/save those settings and publish the environment, then retry. Saving a draft does not activate the running policy; domain permission also does not guarantee the upstream service will authorize a request. The website remains usable when images fail.

## Browser tests

```sh
npx playwright install chromium
npm test
```

Playwright runs desktop, tablet and mobile Chromium against an isolated Vite server on port 5174. Tests cover routing, deep links, contact destination, mobile menu, project transitions, image failure, lightbox focus/keyboard behavior, trusted browser-level touch gestures, 320px reflow, short landscape screens, loading-frame stability, mixed aspect ratios, layout overflow and axe WCAG checks on every route. Touch tests are registered only for touch-enabled tablet/mobile projects; no desktop-only skip is needed. External photo requests are intentionally aborted for deterministic fallback checks. A separate test-only gallery uses synthetic SVG shapes to verify multi-image controls; those shapes never enter the portfolio or production build. Screenshots and traces are in ignored `test-results/`. If a system Chromium is already installed, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test` instead. This optional test-only variable is not needed by the application. Browser/system dependencies may require `npx playwright install --with-deps chromium` on a fresh machine.

## Visual review

With a development server running, capture all eight routes at desktop (1440×1000), tablet (768×1024) and mobile (390×664) sizes:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/visual-review.mjs /tmp/chriz-review
```

Use `REVIEW_BASE_URL` to point to a running production preview instead. This script uses the inherited HTTPS proxy for remote media, preserving TLS verification, and writes screenshots, accessibility observations, request failures and local CLS/LCP samples outside the repository. These local metrics with blocked images are not real-user Core Web Vitals or proof of live-image performance. For optional Firefox and WebKit coverage, install their browsers and use `PLAYWRIGHT_CROSS_BROWSER=1 npm test`. Those opt-in projects exclude Chromium-only CDP touch tests; the other journeys and accessibility checks remain enabled. Browser downloads were denied by the current environment policy, so Firefox/WebKit results are not claimed. The configuration draft additionally includes `cdn.playwright.dev` and `playwright.download.prss.microsoft.com` for that installation.

Device profiles emulate Chromium; they do not replace testing Safari on an actual iPhone/iPad. The broader review findings and remaining release checks are in `QUALITY_REVIEW.md`.

## Deploy

1. Run `npm ci && npm run test:content && npm run lint && npm run build`. The build validates the catalog and generates HTML with route-specific title, Open Graph and Twitter metadata for each configured route. The body remains client-rendered; this is metadata generation, not full HTML prerendering.
2. Publish **`dist/`** on an HTTPS static host. Vercel route rules and build-generated Netlify `dist/_redirects` are included. Keep the generated per-route rules ahead of the SPA fallback so crawlers receive project-specific metadata at bare nested URLs. Vite preview applies the same known-route mapping. The host configuration still requires a deployment smoke check; no remote deployment was performed. Other hosts must serve `index.html` for application routes such as `/projects/devon-x-chriz`, while serving static assets normally. Plain GitHub Pages needs a separate SPA fallback strategy; do not assume it supports these rewrites.
3. Customize `src/content/site.ts`: set your description, sharing image and real HTTPS `origin`. Leave origin blank until known. The build and client share the same metadata resolver; project shares use the selected cover. Canonical and `og:url` tags are emitted only for a configured origin. Unknown pages receive `noindex` after rendering; `404.html` also includes static noindex metadata. Vercel may return its host 404 for an unknown project; the general SPA fallback otherwise uses client-side 404 presentation.
4. With `site.origin` configured, `npm run build` generates both `sitemap.xml` and the matching robots sitemap directive. With no origin, neither a canonical URL nor a sitemap domain is invented. The earlier manual sitemap helper remains available. Before publishing, run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:production` (or omit the executable override when using an installed Playwright browser); it starts and stops its own preview on port 4183 and verifies raw metadata, nested routes and the lazy viewer.
5. Check direct project URLs, images and crops, accessibility and contact destinations on the deployed site. Native video should be externally hosted with correct MIME types and range support.

## Ownership and excluded files

The existing MIT license applies to code owned by its copyright holder. Photography, logos, branding, the existing Graffiti font and other third-party assets may have separate rights; the code license grants no rights to those materials. Obtain appropriate permission before reusing or publishing them. The pre-existing local logo and font remain unchanged; new photography is not stored in Git.

Real photography collections, downloaded social media, secrets, private information, dependency directories, build outputs, local environment settings and browser artifacts must remain out of Git. Never commit access tokens or private media. This repository includes no simulated contact form; contact links lead directly to the supplied official Instagram profile or an email address if configured.
