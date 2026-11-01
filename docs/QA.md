# QA evidence and limits

Validated on Windows with Node 22.16.0 and npm 11.11.0, 2026-11-01. Results describe this implementation, not a guarantee about future custom content or hosting.

## Automated checks

| Check | Result |
| --- | --- |
| Clean dependency installation | `npm ci` and `npm run check` succeed in a fresh isolated clone |
| ESLint | Pass |
| TypeScript | App, build scripts, Playwright configuration, and tests pass |
| Node tests | 31 pass |
| Playwright | 18 pass, Chromium desktop and mobile |
| Production asset/build validation | 3 sample projects and 8 referenced local assets pass |
| Production dependency audit | Zero vulnerabilities with `npm audit --omit=dev` |
| Full dependency audit | 12 moderate development-tool findings, shared minimatch advisory; see below |

Unit tests cover valid demo/minimal/single-project content, malformed/unsafe configuration, duplicate/invalid slugs, image traversal and alt text, email/phone/HTTPS links, WCAG relative luminance, escaped metadata, configured subdirectory sharing URLs, exact filename case across platforms, and a real missing-file failure using an isolated temporary fixture.

Browser tests cover work/detail/contact/404 navigation, direct URL reload, next-project links, single-project fallback, native lightbox previous/next/wrapping/Escape/backdrop controls, focus containment and return, skip link, mobile disclosure/Escape, section focus, runtime image failures, empty contact/projects, replacement identity/logo/images/colours/links, absent about, long copy at 320px, and reduced motion. The actual build is also loaded through static file responses at a domain root and `/my-portfolio/`, without SPA fallback rewrites. That check includes charset ordering, image loading, project refresh, and gallery opening.

Axe scans report zero tested WCAG A/AA violations on home, project, dialog, contact, empty content, and a customized light theme. Automated scans do not replace manual accessibility evaluation.

## Visual review

Screenshots reviewed at desktop (1440), tablet (768), mobile (390), and narrow mobile (320). No measured horizontal overflow at these widths; default hero fits one line on desktop/tablet and two on mobile. Checked alternating project rows, image crops, touch controls, readable about text, contact state, and enlarged viewer. Keyboard flows are exercised in browser tests. No entrance animation hides initial content; reduced motion disables transitions.

Design Taste's real-browser inspector was executed at 1440/768/390. It reports no broken images, horizontal overflow, low text contrast, console errors, or headings beyond two lines for the demo. Its overall stylistic gate does not pass: it requests photographs/raster content, video, entrance motion, a different dealt font/palette, and removal of metadata above headings. Those preferences were intentionally not adopted because this brief retains a dark image-led portfolio, uses licensed local demo graphics/system fonts, keeps meaningful category/role information, and calls for restrained motion. The inspector result is not presented as a passing product check.

Local screenshots and inspector outputs remain ignored in `.taste-skill/`; they are not part of the distributed template.

## Performance and dependency changes

Initial build: 345.89 kB JavaScript / 112.71 kB gzip. Current build: approximately 282.36 kB / 89.80 kB gzip; CSS approximately 17.22 kB / 4.44 kB gzip. Unused icon/UI/motion packages were removed; the runtime only needs React, React DOM, and React Router. All display fonts come from the system. No runtime third-party image/font requests are required.

Compatible lockfile updates include React/DOM 19.3.1, Router 7.18.5, Vite 6.4.5, Tailwind 3.4.19, TypeScript 5.8.3. The package keeps its existing major-version architecture.

The full `npm audit` still reports 12 moderate findings through local ESLint/TypeScript-ESLint dependencies on minimatch ([GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)). Compatible updates did not remove them; npm proposes a forced downgrade for part of the tree. No force fix or unverified cross-major override was applied. ESLint 9 also emits an upstream end-of-support/deprecation notice. Reassess this development toolchain when a compatible, tested migration is available. The runtime-only audit reports zero findings. No vulnerable production dependency was knowingly retained from the initial audit.

## Explicit limits

- Real Firefox, Safari/WebKit, physical iOS/Android devices, and screen-reader sessions were not tested. Mobile tests emulate Chromium at 390px; additional narrow-layout checks use 320px.
- No public deployment, domain, external mail delivery, social account ownership, or third-party URL availability was tested or created.
- Metadata is static for the homepage; hash routes do not promise independent project indexing or per-project social cards. Missing client routes keep the static server's HTTP 200 status.
- Image validation checks local paths and file presence, not image licensing, compression, SVG sanitization, or the contents of arbitrary files. Use trusted assets.
- A fresh clone of checkpoint `8240995` passed npm ci/check. Editing only its actual JSON plus one new local image produced a validated one-project light-theme portfolio. Its production preview passed browser assertions for identity, new image, theme, static title/description/canonical/Open Graph URLs, direct project reload, one-image gallery, contact, mobile layout, and absence of console errors. Final mailto hardening and backdrop-close checks were additionally validated in the working branch.
- There is no backend, analytics, CMS, fake sending form, or paid integration.

## Reproduce

```bash
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
npm run preview
```

Browser screenshots/traces on failure are ignored in `test-results/`. See [customization](CUSTOMIZATION.md), [deployment](DEPLOYMENT.md), and [implementation status](IMPLEMENTATION_STATUS.md) before resuming or reviewing the branch.
