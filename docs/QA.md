# QA evidence and limits

Validated locally on Windows with Node 22.16.0/npm 11.11.0 and in hosted GitHub Actions on Ubuntu/Node 22, 2026-11-01. Results describe this implementation, not a guarantee about future custom content or hosting.

## Automated checks

| Check | Result |
| --- | --- |
| Clean dependency installation | Fresh clone of ab9ea04: npm ci/check pass; customized one/zero-project variants pass |
| ESLint | Pass |
| TypeScript | App, build scripts, Playwright configuration, and tests pass |
| Node tests | 32 pass |
| Playwright | 54 pass: Chromium desktop/mobile, Firefox desktop/narrow, WebKit desktop/mobile |
| Production asset/build validation | 3 sample projects and 8 referenced local assets pass |
| Production dependency audit | Zero vulnerabilities with `npm audit --omit=dev` |
| Full dependency audit | 12 moderate development-tool findings, shared minimatch advisory; see below |
| GitHub Actions | Run 41356144473 succeeds: every check, 32 units and 54 browser tests, no skips/flakes |

Unit tests cover valid demo/minimal/single-project content, malformed/unsafe configuration, duplicate/invalid slugs, image traversal and alt text, email/phone/HTTPS links, WCAG relative luminance, escaped metadata, configured subdirectory sharing URLs, exact filename case across platforms, and a real missing-file failure using an isolated temporary fixture.

Browser tests cover work/detail/contact/404 navigation, direct URL reload, next-project links, single-project fallback, native lightbox previous/next/wrapping/Escape/backdrop controls, focus containment and return, skip link, mobile disclosure/Escape, section focus, runtime image failures, empty contact/projects, replacement identity/logo/images/colours/links, absent about, long copy at 320px, and reduced motion. The actual build is also loaded through static file responses at a domain root and `/my-portfolio/`, without SPA fallback rewrites. That check includes charset ordering, image loading, project refresh, and gallery opening.

Axe scans report zero tested WCAG A/AA violations on home, project, dialog, contact, empty content, and a customized light theme. Automated scans do not replace manual accessibility evaluation.

## Visual review

Screenshots reviewed at desktop (1440), tablet (768), mobile (390), and narrow mobile (320). No measured horizontal overflow at these widths; default hero fits one line on desktop/tablet and two on mobile. Checked alternating project rows, image crops, touch controls, readable about text, contact state, and enlarged viewer. Keyboard flows are exercised in browser tests. No entrance animation hides initial content; reduced motion disables transitions.

Design Taste's real-browser inspector was executed at 1440/768/390. It reports no broken images, horizontal overflow, low text contrast, console errors, or headings beyond two lines for the demo. Its overall stylistic gate does not pass: it requests photographs/raster content, video, entrance motion, a different dealt font/palette, and removal of metadata above headings. Those preferences were intentionally not adopted because this brief retains a dark image-led portfolio, uses licensed local demo graphics/system fonts, keeps meaningful category/role information, and calls for restrained motion. The inspector result is not presented as a passing product check.

Local screenshots and inspector outputs remain ignored in `.taste-skill/`; they are not part of the distributed template.

## Performance and dependency changes

Initial build: 345.89 kB JavaScript / 112.71 kB gzip. Current build: approximately 282.59 kB / 89.86 kB gzip; CSS approximately 17.22 kB / 4.44 kB gzip. Unused icon/UI/motion packages were removed; the runtime only needs React, React DOM, and React Router. All display fonts come from the system. No runtime third-party image/font requests are required.

Compatible lockfile updates include React/DOM 19.3.1, Router 7.18.5, Vite 6.4.5, Tailwind 3.4.19, TypeScript 5.8.3. The package keeps its existing major-version architecture.

The full `npm audit` still reports 12 moderate findings through local ESLint/TypeScript-ESLint dependencies on minimatch ([GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)). Compatible updates did not remove them; npm proposes a forced downgrade for part of the tree. No force fix or unverified cross-major override was applied. ESLint 9 also emits an upstream end-of-support/deprecation notice. Reassess this development toolchain when a compatible, tested migration is available. The runtime-only audit reports zero findings. No vulnerable production dependency was knowingly retained from the initial audit.

## Publication review and CI

See [release review](RELEASE_REVIEW.md) for reproduced defects, fixes, and the dependency investigation. New regressions cover extra theme markup and the active Work anchor. Frozen unit/browser fixtures keep checks independent of user content; production tests read the actual built configuration, including empty portfolios. WebKit focus-return and skip-link failures were reproduced and corrected rather than skipped.

The new push/pull-request workflow was validated with SHA256-verified actionlint 1.7.12. It uses read-only contents permission, no persisted checkout credential, pinned official checkout/setup-node v6 actions, Node 22, and a bounded standard Ubuntu job. The first hosted [Actions run](https://github.com/vibeewithasa/personal-showcase/actions/runs/41356144473) for ab9ea04 completed successfully on Ubuntu/Node 22: install, content validation, lint, 32 unit tests, TypeScript, build, production audit, browser installation, and 54 browser tests. Downloaded job logs confirm 32/32 units and 54/54 browser passes, with no reported skips or flakes. A push execution does not separately prove a pull-request event, but both use the same validated job without event-specific branches.

## Explicit limits

- Playwright Firefox and WebKit have been installed and exercised on Windows. The final matrix has Chromium desktop/mobile, Firefox desktop/narrow (viewport only), and WebKit desktop/mobile. This does not test branded Safari, physical iOS/Android devices, assistive hardware, or screen-reader sessions. Narrow checks also use 320px.
- No public deployment, domain, external mail delivery, social account ownership, or third-party URL availability was tested or created.
- Metadata is static for the homepage; hash routes do not promise independent project indexing or per-project social cards. Missing client routes keep the static server's HTTP 200 status.
- Image validation checks local paths and file presence, not image licensing, compression, SVG sanitization, or the contents of arbitrary files. Use trusted assets.
- Fresh clone of `ab9ea04`: npm ci succeeded; replacing its actual JSON and local images, deleting all original public demo images, removing about, and selecting a light theme/one project passed npm run check (32 units) and all 54 browser checks. The actual production tests verified the new identity/image, detail refresh, one-image gallery, responsive layout, and root/subdirectory paths. Independent raw-HTML assertions verified UTF-8/escaping, title, canonical, Open Graph image, theme, and local favicon.
- Changing that real JSON to zero projects also passed npm run check (32 units/build) and all six production-browser projects, including the empty state at root/subdirectory URLs. Frozen behavioral fixtures are intentionally separate from actual-content production checks.
- There is no backend, analytics, CMS, fake sending form, or paid integration.

## Reproduce

```bash
npm ci
npm run check
npx playwright install chromium firefox webkit
npm run test:e2e
npm audit --omit=dev
npm run preview
```

Browser screenshots/traces on failure are ignored in `test-results/`. See [customization](CUSTOMIZATION.md), [deployment](DEPLOYMENT.md), and [implementation status](IMPLEMENTATION_STATUS.md) before resuming or reviewing the branch.
