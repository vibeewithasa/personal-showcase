# Personal Showcase

A reusable, image-led creative portfolio built with React, TypeScript, Vite, Tailwind CSS, and React Router. Personalize one JSON file, add your images, and publish the static build.

The included **Studio Practice** identity and three graphic studies are clearly labeled demonstration content. No account, API key, backend, database, external image service, or paid subscription is required.

## Features

- One configuration file for identity, biography, services, projects, contact, colours, and metadata.
- Responsive, alternating project layouts and real project detail pages.
- Native modal image viewer with previous/next controls, arrow keys, Escape, focus containment, and focus return.
- Masked hero typography, scroll reveals, subtle image depth, and animated navigation/native viewer.
- Mobile navigation, keyboard skip link, visible focus, and live reduced-motion support.
- Readable actual-content static fallback when JavaScript is disabled in the production build.
- Local images with lazy loading, reserved image space, loading and failure states.
- Empty portfolios, single projects, optional sections, and friendly missing-page recovery.
- Build-time metadata, configurable favicon, and optional canonical/sharing URLs.
- Configuration, local-file, contrast, and URL validation; unit and desktop/mobile browser tests.

## Get started

Install **Node.js 22.16 or newer** (a current supported LTS release is recommended) and npm. Node 22.16 may display an experimental type-stripping warning when running the TypeScript validation/tests; it does not indicate a failed check.

```bash
git clone https://github.com/vibeewithasa/personal-showcase.git
cd personal-showcase
git switch feat/portfolio-motion-system
npm ci
npm run dev
```

If you downloaded a ZIP of this branch, extract it, open a terminal in the extracted folder, and start with `npm ci`. Open the local URL printed by Vite, normally `http://127.0.0.1:5173`. Do not open `index.html` directly from disk.

## Create your own portfolio

1. Add your licensed images to [`public/images/`](public/images/README.md). Use names such as `my-project.webp`, without spaces.
2. Edit [`src/content/portfolio.json`](src/content/portfolio.json). Replace identity, introduction, about text, services, projects, contact, and SEO text. Set `demo` to `false` once your own content is ready.
3. Replace each image's `src` and write useful `alt` text. Paths start with `images/`, without `public/` or a leading slash.
4. Set your five theme colours. Validation checks readable contrast for text, muted text, and accent against both backgrounds.
5. Run `npm run check`. Review the site on a phone-sized viewport, test links and galleries, and check the production preview.
6. Run `npm run build` and publish the contents of `dist/` with your preferred static host. Nothing is deployed by these commands.

See the [customization guide](docs/CUSTOMIZATION.md) for examples, all configuration fields, optional sections, and image guidance. The [deployment guide](docs/DEPLOYMENT.md) covers production and subdirectories.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the exact dependency versions in the lockfile |
| `npm run dev` | Start the local development server |
| `npm run validate` | Validate configuration and referenced local image files |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check app, build scripts, and tests with TypeScript |
| `npm test` | Run Node unit tests |
| `npm run check` | Run lint, unit tests, validation, TypeScript, and production build |
| `npm run test:e2e` | Build, then run Playwright/axe across Chromium, Firefox, and WebKit |
| `npm run build` | Validate and produce the static site in `dist/` |
| `npm run preview` | Serve the current production build locally |

For browser tests, install the three Playwright engines once:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
```

On a Linux CI machine, `npx playwright install --with-deps chromium firefox webkit` also installs browser system dependencies and may require administrator privileges. Browser downloads require network access. To use an installed Chrome or Edge for the Chromium projects, set `PLAYWRIGHT_CHANNEL` to `chrome` or `msedge`; Firefox/WebKit still use their installed Playwright engines. Tests cover keyboard navigation, gallery controls, image errors, empty/single/customized portfolios, 320px layout, reduced motion, accessibility scans, and production builds at root/subdirectory paths.

## Project structure

```text
src/content/portfolio.json  Identity, content, projects, colours, SEO
src/content/schema.ts      Shared configuration validation and types
src/components/            Layout, navigation, project rows, image handling, gallery
src/pages/                 Home, project detail, contact, missing page
src/routes/                Route definitions
src/index.css              Responsive layout and visual styles
src/motion/                Native motion presets, tokens and lifecycle
public/images/             Your local images and bundled sample artwork
scripts/                   Build-time metadata and local-asset validation
tests/                     Unit and browser tests
docs/                      Customization, deployment, QA, implementation status
```

## Contact and metadata

There is no pretend contact form. Configured email and phone values become `mailto:` and `tel:` links; optional external links open in new tabs. The demo contains no invented email address. If no contact method is configured, it shows an honest unavailable state.

The site uses hash routes, such as `/#/work/field-notes`, so deep links and refreshes work on ordinary static hosting without rewrites. Homepage title, description, favicon, and Open Graph text are generated into HTML. Set `seo.siteUrl` to your real deployment URL to enable canonical/absolute sharing URLs. This client-rendered template does not provide separate crawler-visible HTML or social cards for each project; see [deployment limitations](docs/DEPLOYMENT.md#routing-and-seo).

## License and sample assets

Code and original bundled SVG demonstration artwork are available under the [MIT License](LICENSE). The default graphics are fictional self-initiated studies, not real client work. No third-party photographs, logos, or font files are bundled. Fonts come from the visitor's system.

Replace sample work and branding before presenting the portfolio as your own professional work. You are responsible for permissions for assets you add. The MIT code license does not grant rights to third-party material you add later. See [asset notes](public/images/README.md).

## Continuous integration

[GitHub Actions](.github/workflows/ci.yml) runs on pushes and pull requests: locked install, content/image validation, lint, unit tests, TypeScript, production build/audit, and all six desktop/narrow/mobile browser projects. It uses Node 22 and the standard Ubuntu runner, read-only repository permissions, pinned official actions, and no external credentials or deployment service.

Tests use frozen demonstration fixtures under `tests/fixtures/`, so replacing your content or deleting public demo images does not break the behavioral tests. Production smoke tests still verify your actual built portfolio, including zero projects. Keep the test fixtures when removing sample files from `public/images/`.

## Motion design

The motion layer uses native browser APIs and CSS, with no animation dependency. It responds live to the system reduced-motion preference and leaves content visible when effects fail. Content customization still uses the same JSON and local images. Adjust timing/easing in src/motion/motion.css; see [motion maintenance and evidence](docs/MOTION_SYSTEM.md) for presets, lifecycle and accessibility requirements.

## Quality and maintenance

See [QA evidence and limits](docs/QA.md) and [implementation continuity](docs/IMPLEMENTATION_STATUS.md). Run `npm audit --omit=dev` for runtime dependencies and `npm audit` for the complete toolchain. Review compatible updates and rerun checks; do not use forced upgrades/downgrades as an automatic fix.
