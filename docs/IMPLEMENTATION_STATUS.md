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
- E complete: 31 unit tests and 18 desktop/mobile browser flows pass, including the production build at root/subdirectory paths. Visual captures reviewed at 1440/768/390/320; no horizontal overflow and default hero at most two lines.
- F complete: English README, customization/deployment guides, artwork licensing, QA results/limits, and reproducible commands.
- G complete: fresh clone install/check; real JSON + local-image customization; production browser smoke; full diff review against main; no personal runtime dependencies or generated artifacts in tracked files. All implementation milestones are complete.

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
- 31 unit tests pass: complete/minimal/single config, invalid fields/links/paths/contrast, escaped metadata, subdirectory sharing URLs.
- 18 Playwright flows pass on Chromium desktop/mobile, including axe WCAG A/AA scans of home, project, lightbox, contact and customized light theme; native dialog focus cycling/return; menu Escape; skip/section focus; refresh/404; image failures; empty/single content; 320px/reduced motion.
- Build JS is 89.80 kB gzip vs 112.7 kB baseline. Runtime now only React, React DOM, Router; unused icon/UI/motion libraries and personal/font assets with unverified rights removed.
- `npm audit --omit=dev`: zero vulnerabilities. Full audit reports 12 moderate development-tool dependency findings stemming from the minimatch advisory GHSA-g3hv-75wg-m249. No compatible upstream resolution from `npm update`; do not apply forced downgrades or cross-major overrides without testing.
- Hash routing intentionally supports static hosts/subdirectories without rewrites. It limits per-project crawler/social metadata; static homepage metadata is generated at build time. No deploy performed.
- Original SVG studies and an original sharing PNG replace third-party photography. The design inspector's style gate does not pass because of documented intentional differences (see QA.md); layout/contrast/console/asset measurements have no reported errors.
- Fresh clone of 8240995: npm ci/check pass. File-only River Studio customization: validation, build and production-browser assertions pass for light theme, new local image, single gallery, metadata, contact, direct URL reload and mobile layout.
- Final branch: npm run check and npm run test:e2e pass (31 unit / 18 browser). Email validation/URI encoding includes plus addresses and header-injection regressions; gallery backdrop focus return is checked. Regressions also cover incomplete HTTPS URLs, phones without digits, and filename-case mismatches on Windows.
- Original main's tracked changes and untracked source files remain untouched. Only a local .git/info/exclude entry was added to hide the nested worktree from accidental staging. No graph/agent artifacts, secrets, installed dependency trees, build output, or QA captures are included in the product commits.

## Next step / resuming
Review the completed authorized branch with `git log origin/main..HEAD` and `git diff origin/main...HEAD`. Read README.md, docs/CUSTOMIZATION.md and docs/QA.md. There is no remaining implementation blocker; optional follow-up is a tested development-linter migration and broader real-browser/screen-reader QA. No PR, merge or deploy was made.

For further local work, use `.worktrees/reusable-template` and first run `git status --short --branch`. Do not edit or discard the unrelated original main changes or use the discarded release branch. Local QA copies/screenshots under `.taste-skill/` are ignored and intentionally unversioned. Run npm run check and npm run test:e2e after substantive changes. Commit/push only to the authorized feature branch unless the owner gives new instructions.
