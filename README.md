# Personal Showcase

A black editorial photography portfolio built with React, TypeScript and Vite. Change your owner JSON, copy folders of photographs, and build a static site. No backend, CMS, account, paid API or remote image/font service.

The included **Open Frame** identity is a neutral demonstration brand. Its four AI-generated images are sample artwork, not real client sessions or commissioned photography.

## Get started

Use Node.js 22.16 or newer and npm.

```bash
git clone https://github.com/vibeewithasa/personal-showcase.git
cd personal-showcase
git switch feat/portfolio-editorial-sessions
npm ci
npm run dev
```

Open Vite's printed local URL, normally http://127.0.0.1:5173. A downloaded branch ZIP works too: extract it and begin with npm ci. Do not open index.html directly.

## Add your first session

Edit `src/content/portfolio.json` for your name, profession, introduction, biography, contact, social links, colours, logo and SEO. Set demo to false after replacing the sample content. Keep projects empty when using folders.

Then copy photographs into a new folder:

```text
public/sessions/my-session/
  DSC_0001.JPG
  IMG_1234.jpeg
  Retrato final.webp
  session.json           # optional
```

The session appears automatically. Images are discovered and naturally ordered; no central image-path list is required. The development server reloads after additions, replacements, renames, deletions or metadata changes.

Optional session.json:

```json
{
  "title": "My session",
  "summary": "Your introduction to this sequence.",
  "cover": "Retrato final.webp",
  "photos": {
    "Retrato final.webp": {
      "alt": "A meaningful description of your photograph.",
      "caption": "An optional caption."
    }
  }
}
```

See the **[step-by-step session guide](docs/SESSIONS.md)** for ordering, all metadata fields, formats, filenames, migration and publication. [Owner customization](docs/CUSTOMIZATION.md) covers the global settings.

## Features

- Automatic static sessions from immediate public/sessions folders; optional strict metadata.
- Natural filename ordering, explicit/cover-name/first-photo cover policy, optional manual image/session order.
- Camera filenames, uppercase extensions, spaces and Unicode encoded safely.
- Responsive photographic ratios, asymmetric print composition and a locally hosted OFL display font.
- Build-generated 960/1920px WebP previews with EXIF orientation and stable dimensions; camera originals stay untouched.
- Preserved native motion: masked words, shutters, stagger, subtle image drift, animated menu and viewer.
- Smooth Work/About navigation, direct links, repeat clicks/history, accessible focus and live reduced-motion support.
- Native dialog gallery with keyboard controls, focus containment/return, captions and image-failure states.
- Empty/single/large galleries, optional about/contact content, custom contrast-checked themes.
- Escaped build-time homepage metadata and readable no-JavaScript portfolio.
- Legacy manual projects supported without silent slug conflicts or duplicated session records.

## Commands

| Command | Purpose |
| --- | --- |
| npm ci | Install the locked dependencies |
| npm run dev | Start local development with folder discovery |
| npm run validate | Validate owner, sessions and original asset references |
| npm run lint | ESLint |
| npm test | Node unit/integration tests |
| npm run typecheck | App, scripts and test TypeScript |
| npm run check | Lint, tests, validation, TypeScript and production build |
| npm run test:e2e | Build and run all six Playwright browser projects |
| npm run build | Produce the static dist folder and current previews |
| npm run preview | Serve the actual production output locally |

Before browser tests, install engines once:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
```

Linux CI uses install --with-deps. On constrained Windows hardware, run the browser suite alone with --workers=1 --retries=0 after building. Do not rebuild nested QA copies while a Vite-based browser suite is running.

## Content and build structure

```text
src/content/portfolio.json    Owner identity, theme, contact, SEO; legacy projects
public/sessions/<folder>/    Original web-ready photographs and optional session.json
public/images/              Owner logos, portrait, favicon and other manual assets
public/fonts/               Local WOFF2 and SIL OFL licence
scripts/sessions.ts          Safe discovery, metadata and image previews
scripts/load-portfolio.ts    Shared resolved content and asset validation
scripts/portfolio-plugin.ts Vite virtual content, watcher and emitted previews
src/motion/                 Existing native motion presets/tokens/lifecycle
tests/                      Frozen fixtures plus actual-content/build tests
docs/SESSIONS.md             Nontechnical setup and session guide
```

No generated manifest is edited or committed. Preview cache files live under node_modules/.cache/portfolio-images; production receives only currently referenced previews under dist/media.

## Publish responsibly

Run npm run check, browser tests and npm run preview, then publish dist with your static host. These commands do not deploy anything. Hash routes work at a domain root/subdirectory without server rewrites; [deployment/SEO limits](docs/DEPLOYMENT.md) remain documented.

Everything under public is published, including original photos, metadata and unsupported files. Previews omit metadata, but originals may retain GPS/camera information. Add approved web copies only; keep camera masters/private material outside public. Folder discovery does not authorize publishing client photographs or uploading them to GitHub.

Code is [MIT licensed](LICENSE). EB Garamond uses the [SIL OFL](public/fonts/OFL.txt). [Demo source/prompt notes](public/sessions/README.md) identify the generated images. No third-party stock photos or mandatory font CDN are used.

## Quality and maintenance

[GitHub Actions](.github/workflows/ci.yml) checks pushes/pull requests on Node 22/Ubuntu: locked install, validation, lint, unit tests, TypeScript, production build/audit and Chromium/Firefox/WebKit. It uses pinned official actions, read-only permissions, no secrets or deploy step.

Behavioral fixtures preserve legacy coverage when you replace demo content. Production/session tests read the actual resolved owner plus folders, including empty content.

See [QA](docs/QA.md), [implementation continuity](docs/IMPLEMENTATION_STATUS.md), [editorial architecture](docs/EDITORIAL_IMPLEMENTATION.md) and [motion maintenance](docs/MOTION_SYSTEM.md). Audit with npm audit --omit=dev and npm audit; review compatible updates and rerun checks rather than applying forced migrations.
