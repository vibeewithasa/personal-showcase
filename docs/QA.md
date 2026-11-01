# QA evidence and limits

Motion candidate reviewed on Windows/Node 22.16.0/npm 11.11.0, 2026-11-01. Base: `87ae1e2`; working branch: `feat/portfolio-motion-system`. Results describe the tested content and environment.

## Automated checks

| Check | Result |
| --- | --- |
| Locked install | `npm ci` passes in the isolated worktree and customization copy |
| Lint / TypeScript / content / production build | `npm run check` passes |
| Unit tests | 33 pass, including escaped actual-content no-JavaScript output |
| Browser suite | 108 pass across six Chromium/Firefox/WebKit projects in an isolated local run, one worker and zero retries. |
| Existing coverage | All original 54 browser cases retained |
| Production audit | Zero vulnerabilities |
| Full audit | 12 moderate development-only minimatch findings; unchanged dependency/lockfile |
| Hosted CI | Final source 3146b0b: [run 41363073809](https://github.com/vibeewithasa/personal-showcase/actions/runs/41363073809) passes every step, 33 units / 108 browsers, no skips or reported flakes. Earlier [run 41362032488](https://github.com/vibeewithasa/personal-showcase/actions/runs/41362032488), implementation d12237e: all steps pass, 33 units / 102 browsers, no skips or reported flakes |

The matrix uses Chromium desktop/mobile, Firefox desktop/narrow (viewport only), and WebKit desktop/mobile. Playwright browser revisions: Chromium 1248, Firefox 1555, WebKit 2370. Mobile emulation is not a physical phone.

Nine motion cases per project inspect native keyframes/stagger and settled CSS; one-time image shutters and bounded changing parallax; menu exit/inert/Escape/resize/navigation; dialog entry/directional photo/counter/close/focus; live reduced motion; long ordinary words at 320px; failed animation APIs; failed-image geometry; and readable actual built content without JavaScript. Tests inspect or finish actual animations, rather than sleeping arbitrary durations.

Existing checks cover routes/reloads/404, next project and single-project fallback, gallery wrapping/arrows/Tab/Escape/backdrop/focus return, keyboard skip/navigation, local image failures, empty/single/custom content, light themes/long content, axe scans and real production root/subdirectory hosting without rewrites. Unit tests retain trust-boundary validation, filename case, asset existence, escaping, allowed theme keys, links, slugs and contrast checks.

Axe reports zero tested WCAG A/AA violations on the covered home/detail/dialog/contact/empty/light-theme states. This does not replace manual accessibility evaluation.

## Reproduced issues addressed during motion QA

- An excessive horizontal reveal offset briefly exceeded the 24px mobile gutter. Reduced the offset; narrow tests retain overflow checks.
- Fading text/buttons reduced contrast during valid light-theme entrances. Text/control motion now stays fully opaque; images retain a bitmap resolve.
- Resizing while the mobile menu exited could leave desktop links with disabled pointer events. Closing behavior is scoped to the mobile surface; a live-resize regression verifies it.
- Failed viewer images could change the photo surface geometry. The responsive image slot keeps the same height on success/failure, with controls/caption retained.
- The first 320px real customization capture split ordinary long identity words onto trailing single letters. A narrow-screen type scale and a word-height assertion address that case; unusually long unbroken names still wrap safely.
- A WebKit development-only exact reveal-count assertion conflicted with React StrictMode's effect restart. The test now checks that closing the dialog does not trigger another thumbnail reveal; scroll repeat prevention is independently asserted.

One local repeat during concurrent browser/capture/build work reported eight browser target closures/crashes, not failed product assertions. The final isolated run passes 108/108 with one worker and zero retries; the interrupted log remains ignored for diagnosis. Hosted CI is independently checked.

## Real customization

An isolated copy of d12237e passed fresh `npm ci`, `npm run check` (33 units/build), and initially 102/102 browser checks after replacing the actual JSON, using a long identity, light theme, new local logo/artwork, one project, no about and an empty gallery (cover fallback). All original public demo SVGs were deleted in that copy. Production tests use the actual configuration; frozen behavioral fixtures remain independent.

The actual zero-project variant passes `npm run check` and 12/12 production/no-JavaScript cases across the six browser projects. Both root/subdirectory production checks pass. After the final 320px typography adjustment, the real single-project copy again passes npm run check and all 108 browser cases in isolation, with zero retries. Visual recheck at 1440/320 confirms no overflow and no trailing single-letter words. QA copies never replace source content in the release worktree.

## Visual evidence

Reviewed default desktop 1440, tablet 768, mobile 390; long names/light theme at 320; viewer portrait and 844×390 landscape; mobile menu, project/detail, about, empty contact, failed photo and no-JavaScript portfolio. The layout retains its existing grid, palette and art. Entry masks, stagger, image drift, control responses and native viewer gestures are visibly distinct.

Local ignored files in `.taste-skill/qa/`: before/after captures at 1440/768/390, hero in-flight captures, menu/viewer/contact captures, production no-JavaScript mobile, real customized 1440/320 captures, and actual interaction recordings `motion-1440.webm` / `motion-390.webm`. Production `project-transition-1440.webm` / `project-transition-390.webm` additionally record consecutive project navigation and the viewer; `reduced-390.png` records the static reduced-motion composition. Videos include entrance, scroll, project navigation, viewer/image/counter/close and contact; mobile includes its menu. Still frames from the recordings were also reviewed. These QA artifacts are not shipped.

Design Taste's browser inspector ran against development and production at 1440/768/390: zero measured overflow or broken images; no recorded console errors. Its stylistic gate remains a failure: metadata above headings, SVG instead of photography, no footage and the preserved palette. A production sample also reported too little motion and an off-centre animated measurement. Its late periodic sampling misses finite entry/control effects; dedicated native-effect tests, paused in-flight captures and recordings demonstrate them. Settled captures retain matching gutters. The heuristic report is retained unchanged, not presented as a passing product gate. No arbitrary photos, video loop, font or palette replacement was added to satisfy it.

## Performance and security

| Production output | Base 87ae1e2 | Motion |
| --- | --- | --- |
| JavaScript | 282.59 kB / 89.86 gzip | 290.18 kB / 91.90 gzip |
| CSS | 17.22 kB / 4.44 gzip | 21.21 kB / 5.36 gzip |
| HTML | 1.35 kB / 0.63 gzip | 4.84 kB / 1.92 gzip |

Runtime JavaScript grows 2.04 kB gzip (about 2.3%), with no dependency addition. HTML includes escaped static fallback content. Native finite effects release to visible CSS; passive scroll observation schedules a single rAF for visible images, with no continuous idle loop.

Local production comparison: headless Chromium, 1440×900, first 120 rAF intervals. Both CLS 0 and median 16.7ms; p95 16.8ms before / 16.7ms after; no active idle animations. Baseline had one long task, motion had zero. This small local sample does not prove a general improvement or performance on physical hardware.

The full audit still reports 12 moderate findings through ESLint/TypeScript-ESLint on minimatch [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). Patched 11.0.1 is outside the current transitive ^3/^10 ranges. No compatible fix, forced downgrade, cross-major override or major tooling migration was introduced. Production audit remains zero. See [release review](RELEASE_REVIEW.md) for the original investigation and exposure.

## CI and prior evidence

The inherited push/pull-request workflow remains minimal: Node 22/Ubuntu, locked install, validation, lint, unit tests, TypeScript, build, runtime audit and all six browser projects. It uses read-only contents permissions, no persisted checkout credential, pinned official v6 checkout/setup-node actions, no secrets or paid service. Previously validated with actionlint 1.7.12; unchanged in this mission.

[Base publication run 41356144473](https://github.com/vibeewithasa/personal-showcase/actions/runs/41356144473) passed 32 units and 54 browsers. [Motion run 41362032488](https://github.com/vibeewithasa/personal-showcase/actions/runs/41362032488) passed 33/102. Final-source [run 41363073809](https://github.com/vibeewithasa/personal-showcase/actions/runs/41363073809) for 3146b0b passes 33/108. Downloaded logs verify those totals and all workflow steps, without skips or reported flakes. A push run does not separately prove a pull-request event; both use the same job without event-specific branches.

## Manual limits

- Physical Safari/iOS/Android, low-end hardware, touch/trackpad motion feel, real screen readers and assistive hardware remain manual checks.
- Static homepage metadata/hash routing are retained. There is no separate indexed HTML/social card per project; missing client routes retain static-host HTTP 200. The no-JavaScript portfolio does not change that architecture.
- No deploy, domain, external mail delivery/social-account ownership or third-party availability was tested or created.
- Asset validation checks paths, existence and alt text, not licensing, compression or arbitrary SVG contents. Add trusted, licensed assets.
- Very long copy can require scrolling in the viewer. Recheck your own crop, caption, contrast and motion on actual devices.
- No backend, analytics, CMS, pretend sending form or paid integration was added.

## Reproduce

```bash
npm ci
npm run check
npx playwright install chromium firefox webkit
npm run test:e2e
npm audit --omit=dev
npm run preview
```

On a constrained Windows machine, run the suite alone with `npx playwright test --workers=1 --retries=0` after building. Do not rebuild another nested QA copy during a running Vite browser suite. Failure screenshots/traces remain ignored under test-results; local visual evidence/copies stay under .taste-skill.

See [motion maintenance](MOTION_SYSTEM.md), [customization](CUSTOMIZATION.md), [deployment](DEPLOYMENT.md) and [implementation status](IMPLEMENTATION_STATUS.md).
