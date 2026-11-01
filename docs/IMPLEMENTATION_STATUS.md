# Reusable portfolio implementation

## Objective and Git safety
Turn Personal Showcase into a configurable, accessible static creative portfolio. Work only on `feat/reusable-portfolio-template`; no PR, merge, or deployment.

- Base: `origin/main`, `e05d815e10c3a97dd4a3aacb2dafe0adee820a85`, fetched 2026-11-01.
- `origin` uses the former `asa-dot/PersonalShowcase` URL. GitHub redirects it to `vibeewithasa/personal-showcase`; both API lookups identify repository 991135749.
- Isolated checkout: `.worktrees/reusable-template`. The original checkout's modified Home/routes, untracked MainLayout/Contact, and `.serena/` are untouched.
- No unpublished local commits on main. The requested branch did not exist locally or remotely. The discarded release branch was neither checked out nor used.

## Milestones
- A complete: repository and base verified, unrelated work isolated, initial code/tool audit performed.
- B–D complete: typed/validated JSON configuration, local original artwork, functional work/detail/contact/404 pages, accessible galleries/navigation, responsive styling and reduced motion.
- E complete: 28 unit tests and 18 desktop/mobile browser flows pass, including the production build at root/subdirectory paths. Visual captures reviewed at 1440/768/390/320; no horizontal overflow and default hero at most two lines.
- F complete: English README, customization/deployment guides, artwork licensing, QA results/limits, and reproducible commands.
- G pending: clean clone/file customization exercise, final Git review and final push.

## Findings and decisions
- Baseline lint/build pass using ancestor-installed dependencies; this is not a clean-install verification.
- Baseline package ranges: React 19.1, TypeScript 5.8, Vite 6.3, Router 7.6, Tailwind 3.4, Motion 12.15.
- Existing strengths: dark canvas, image-led work, alternating rows, responsive layout.
- Gaps: personal/remote assets, nonfunctional project buttons, missing contact route, inaccessible mobile disclosure, no config validation or tests.
- Graphify is installed; no graph exists. Direct symbol inspection is sufficient for this small source tree; no graph generated.
- Keep the static React/Vite architecture. Use one JSON config and local demonstration artwork with explicit licensing. No backend, CMS, paid service, or deployment.
- Acceptance: clean install; lint/typecheck/build; valid/invalid configuration and local assets; real navigation/details/gallery; keyboard/mobile/reduced-motion QA; empty/optional content; documented customization and static hosting.

## Checks and known limits
- Clean `npm ci` succeeds in the isolated checkout. Current lint/typecheck/build pass after compatible dependency updates.
- 28 unit tests pass: complete/minimal/single config, invalid fields/links/paths/contrast, escaped metadata, subdirectory sharing URLs.
- 18 Playwright flows pass on Chromium desktop/mobile, including axe WCAG A/AA scans of home, project, lightbox, contact and customized light theme; native dialog focus cycling/return; menu Escape; skip/section focus; refresh/404; image failures; empty/single content; 320px/reduced motion.
- Build JS is 89.7 kB gzip vs 112.7 kB baseline. Runtime now only React, React DOM, Router; unused icon/UI/motion libraries and unlicensed personal/font assets removed.
- `npm audit --omit=dev`: zero vulnerabilities. Full audit reports 12 moderate development-tool dependency findings stemming from the minimatch advisory GHSA-g3hv-75wg-m249. No compatible upstream resolution from `npm update`; do not apply forced downgrades or cross-major overrides without testing.
- Hash routing intentionally supports static hosts/subdirectories without rewrites. It limits per-project crawler/social metadata; static homepage metadata is generated at build time. No deploy performed.
- Original SVG studies replace photographs to ensure redistributable assets. The design inspector's photo/video/motion floors are not acceptance requirements for this brief.

## Exact next step / resuming
Run `git -C .worktrees/reusable-template status --short --branch`, read this file, and continue in that checkout. Do not edit the dirty original checkout or use `feat/chriz-portfolio-release`. Clone the authorized branch into an ignored QA folder, run npm ci/check, edit the actual JSON and build/preview the customized result, then record final evidence and push; update this document at each substantial verified checkpoint, commit, and push only the authorized branch.
