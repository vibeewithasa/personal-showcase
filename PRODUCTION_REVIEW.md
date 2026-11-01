# CHRIZ production engineering review

This mission continues the same checkout and preserves the earlier implementation, second-pass report and review artifacts. All previous Git publishing restrictions remain in effect.

## Completed changes

- Preserved CHRIZ's black-and-white composition, original Graffiti font, eyes artwork and image-first layouts. Reviewed home, portfolio, every project, about, contact and 404 at desktop, tablet and mobile sizes. No photographer facts, photographs or contact details were invented.
- Added project-specific enquiry links. Contact retains the selected, catalog-verified project reference; an optional configured email receives a URL-encoded subject. Unknown project parameters are ignored.
- Added explicit cover selection through `coverId` without changing gallery order. Existing portrait/landscape galleries, measured dimensions, focal points, caption tracks and uncropped presentation remain supported.
- Added gallery recovery when external media becomes available again: Retry photographs reloads image components without reloading the page. No interactive control is nested inside a photo button.
- Added a render-error boundary with reload and portfolio recovery actions. Error details and stack traces are not shown to visitors.
- Lazy-loaded the fullscreen viewer. Switched the existing Framer Motion integration to LazyMotion/m with its DOM animation features, retaining reduced-motion support while reducing the entry bundle.
- Centralized SEO settings in `src/content/site.ts` and route metadata in `src/content/metadata.ts`. Client navigation updates titles, descriptions, Open Graph/Twitter images, robots tags and optional canonical URLs consistently.
- Added build-time route-specific HTML metadata, a static noindex `404.html`, and conditional canonical/sitemap/robots generation when a real HTTPS origin is configured. This generates metadata in otherwise client-rendered HTML; it is not full body prerendering or SSR.
- Corrected bare-route delivery in Vite preview and supplied static-host mappings so known project URLs receive their own HTML instead of homepage metadata. Netlify rules are generated from the catalog; Vercel rules use static directory indexes. Remote hosting has not been deployed or verified.
- Added build validation for unsafe media protocols/embedded credentials, duplicate IDs/slugs, missing cover references, invalid paired dimensions, unknown/reserved categories and invalid contact email. Errors fail the build with actionable messages.
- Added six native Node content/build checks, browser recovery/metadata/contact tests and an isolated production verification command. Optional Firefox/WebKit projects are configured without claiming unsupported coverage.

## Current verification

- `npm run test:content`: **6 passed, 0 failed, 0 skipped**. Covers the actual catalog, invalid content rejection, selected covers, metadata normalization and an isolated configured-origin generation run. The latter verifies canonical links, seven sitemap entries, robots, static noindex HTML and per-route redirects in a temporary directory that is removed afterward.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test`: **47 passed, 0 failed, 0 skipped**, desktop/tablet/mobile Chromium. Includes all earlier journeys plus gallery recovery, render-error recovery, metadata navigation and project-to-contact context. Trusted touch gestures execute on tablet/mobile; keyboard focus, 320px reflow, short landscape screens and axe checks remain covered.
- `npm run lint`: passed without warnings after correcting the test-fixture export.
- `npm run build`: passed, including TypeScript, production bundling, catalog validation and HTML metadata generation.
- `npm run test:production` with Chromium: passed **7 raw HTML metadata checks, 9 rendered routes, static noindex 404, lazy lightbox opening/closing**, zero JavaScript exceptions. This is a reproducible local production check, not a remote deployment test.
- Final lockfile installation was rerun using `npm ci` before the final lint/build/production verification.
- Production visual sweep: **24 route/viewport checks**, zero axe findings, zero horizontal overflow and zero JavaScript exceptions. Sizes: desktop 1440×1000, tablet 768×1024, mobile 390×664. Captures include real unavailable-media states and the expanded mobile menu.
- Dependency audit: **0 runtime advisories**; **14 moderate development-only advisories**, zero high/critical findings. These remain inherited glob/minimatch lint/build paths. No compatible upstream resolution was established in this environment; no forced major downgrade or API-incompatible override was used.

An intermediate production test caught homepage metadata at bare `/portfolio`; this was fixed through explicit index mapping and the final production check passed. An intermediate touch run timed out while loading the lazy viewer; the complete final 47-test run passed, including both trusted-touch profiles. No retries or skipped assertions were used to declare that run successful.

## Measured performance

Production entry JavaScript is approximately **313.6 kB / 103.3 kB gzip**, compared with the previous **353.6 kB / 114.6 kB gzip**. The approximately 40 kB reduction preserves the existing animation technology. The viewer is a separate approximately **2.1 kB / 1.0 kB gzip** chunk loaded on demand. CSS is approximately **15.6 kB / 4.3 kB gzip**. The existing font is 14.5 kB; the original About logo remains 425 kB and is not redistributed as a new media file.

In the final local production sweep, CLS observations were **0** across all 24 captures and LCP samples were **40–240 ms**. This is fast loopback delivery with blocked external photographs, not field Core Web Vitals, realistic photo-loading performance, a Lighthouse score or physical-device testing. Original photo dimensions must still be supplied to avoid a ratio correction when an unknown-dimension photo becomes reachable. Retest live media on a throttled deployed origin before release.

## Media and network evidence

The running policy remains restricted/enforced and excludes media destinations. Both Cloudinary and the official Instagram reference again returned HTTP 403 at proxy CONNECT, before an origin response. This is not evidence that the media URLs are invalid or that Instagram itself rejected the request.

Available environment tools can save drafts but expose no supported activation/publication operation. The saved draft retains `res.cloudinary.com`, `instagram.com`, `www.instagram.com` and adds **`cdn.playwright.dev`** and **`playwright.download.prss.microsoft.com`** for browser installation. Package-manager presets are preserved. The draft must be reviewed/saved and the environment published through settings before the running policy can change. No proxy, TLS or authentication bypass was attempted.

Firefox and WebKit installation were each attempted; both were denied by the current domain policy. There are no Firefox/WebKit test results. After legitimate network activation, install those browsers and run `PLAYWRIGHT_CROSS_BROWSER=1 npm test`. Real Safari/iOS and screen-reader testing remain separate checks.

The same three approved Cloudinary identities remain in the catalog and their responsive request identities are tested. No additional photographs were downloaded, fabricated or committed. Live delivery, natural dimensions, visual crops, detailed alt descriptions and rights approval are still external release prerequisites. Each project has its original single cover; the architecture accepts additional approved selections without React edits.

## Configuration and release

1. Review/save the network draft and publish the environment if live-media or extra-browser checks are needed here. Recheck actual responses; domain permission alone does not guarantee origin authorization.
2. Configure authorized content in `src/content/portfolio.ts`. Add measured dimensions, descriptive alternatives and any approved project details, biography, credits or email. Existing missing information is intentionally omitted.
3. Set the real HTTPS `origin`, description and sharing image in `src/content/site.ts`. A blank origin intentionally emits no invented canonical or sitemap domain. Static assets assume deployment at the domain root.
4. Run `npm ci`, `npm run test:content`, `npm run lint`, `npm run build`, browser tests and `npm run test:production`. Build output includes known-route HTML metadata and host rules. Preserve per-route metadata mappings before the generic fallback.
5. Publish `dist/` yourself. Vercel may return its hosting 404 for an unknown project; the general SPA fallback otherwise renders the app's 404 and updates noindex in JavaScript. Configure host-level 404 behavior as appropriate. Plain GitHub Pages requires an additional fallback strategy as documented previously.
6. Verify deep links, previews, actual photos, origin metadata, Safari/iOS, screen-reader workflow, real contact destinations and live-media performance on the deployed origin. Track remaining development-tool advisories.

## Evidence and repository integrity

Fresh artifacts: `/workspace/artifacts/chriz-production-review/`, with page screenshots, overview sheets, machine-readable `review.json`, and the delivery report. Earlier evidence remains under `/workspace/artifacts/chriz-review/`.

Primary changes are in content validation/metadata/site configuration, ErrorBoundary, Gallery/Photo/Project, project/contact pages, LazyMotion integration, build/preview scripts, host rules and regression tests. README and the historical quality report link the current instructions.

No Git commits, pushes, merges, PRs or history rewrites were performed. No production deployment, paid service, credentials or unauthorized media were introduced. The MIT code license and original logo/font assets remain unchanged.
