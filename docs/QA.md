# QA evidence and limits

Editorial sessions candidate, reviewed 2026-11-02 on Windows, Node 22.16.0 / npm 11.11.0. Branch `feat/portfolio-editorial-sessions`; approved motion base `6c9b4e3775f4950824eae404047bf6384eb0e913`. Results describe tested content and environments, not physical-device certification.

## Automated results

| Check | Result |
| --- | --- |
| Locked install | Fresh npm ci passes in the isolated worktree and real customization copy |
| Content / lint / TypeScript / production build | Pass; npm run validate and npm run check |
| Unit/integration tests | 61 pass, retaining all original 33 |
| Complete browser matrix | 144 pass locally, one worker, zero retries; all original 108 retained |
| Real one-photo customization | check/61 units plus all 144 browsers pass with actual replacement JSON/files |
| Real many-session customization | check/61 units plus 48 editorial/production/no-JavaScript cases pass |
| Real empty customization | check/61 units plus 12 production/no-JavaScript cases pass |
| Targeted WebKit scroll repeat | Five repeats, two workers, zero retries: all pass |
| Production audit | Zero vulnerabilities |
| Complete audit | Same 12 moderate development-only minimatch findings; no high/critical |
| Hosted Ubuntu CI | [e050fc8 run 41430646881](https://github.com/vibeewithasa/personal-showcase/actions/runs/41430646881): every step passes, 61 units / 144 browsers, no skips or reported flakes |

The matrix has Chromium desktop/mobile, Firefox desktop/narrow viewport, WebKit desktop/mobile. Installed revisions: Chromium 1248, Firefox 1555, WebKit 2370. Narrow Firefox is a viewport check. Local browser jobs ran in isolation to avoid machine-resource interference and nested Vite reloads.

The first hosted [implementation run 41422116541](https://github.com/vibeewithasa/personal-showcase/actions/runs/41422116541), SHA 2d75f37, finished green but reported one flaky WebKit scroll-frame assertion (143 passed, one retry passed). The frame probe discarded its first rAF sample even when that was already an intermediate scroll position. It now retains all observed samples and waits for explicit page readiness. Five targeted repeats and the next complete hosted run pass without retries/flakes. Do not describe the first run as a clean 144-case pass.

## What the tests exercise

The original motion, route, native dialog, keyboard/focus, reduced-motion/live-preference, failed-animation API, failed-image, long-name, actual no-JavaScript and root/subdirectory production checks remain. Frozen legacy fixtures keep that coverage independent of the owner's current photographs.

New discovery/integration coverage: missing/zero/empty folders, one portrait, real JPEG/PNG/WebP/AVIF decoding, EXIF orientation, natural numeric order, explicit/cover-name/first cover, manual order, complete/absent metadata, date/featured rules, camera extensions/spaces/Unicode/non-Latin slugs, captions/alts, original-byte preservation, 30-photo discovery, corrupted/disguised/unsupported/animated input, useful invalid JSON/field/date/reference/slug errors, duplicate manual/folder slugs, traversal/encoded path/dimension boundaries, symlinks/junctions, byte/pixel limits and large-file warnings.

A real Vite server test adds, replaces, renames and deletes sessions while running, handles invalid metadata and recovery, and deletes/recreates the sessions root. Content hashes and emitted current assets prevent stale derivatives.

Six new browser cases per profile test observable smooth-scroll intermediate positions; visible targets below the sticky header; focus; repeated anchor clicks; cross-route navigation; history/reload/direct links; instant reduced movement; no duplicate route scroll or word replay; actual folder project headings/previews/ratios/captions; viewer focus and Work return; a 30-image mixed gallery/light theme/long identity/no About; and broken generated images. The live-preference assertion allows minor native scroll anchoring from removing image drift while proving no new scrollIntoView call occurs.

Axe finds zero tested A/AA violations across covered home/detail/viewer/contact/empty/light-theme states. It does not replace screen-reader or manual accessibility review.

## Actual-file customization

An ignored clone received fresh npm ci and the final source refinements while preserving its replacement owner JSON and local photographs. QA never replaces source delivery content.

- One folder: Retratos prueba/DSC_0001.JPG, one portrait generated-demo publication copy, explicit cover/alt/caption and description. Actual long owner identity, new local SVG logo, light contrast-checked palette, real configured SEO fields, no About and an example.test email. check/61 and the complete 144-case matrix pass. Root/subdirectory and no-JavaScript checks use this actual content, not only mocked fixtures.
- Many: twelve folders, 72 local copies of the four generated scenes, mixed portrait/landscape ratios, long title, optional metadata on alternating folders, explicit covers, numeric order, camera names and a Kyoto-named non-Latin folder without metadata. check/61 and all selected 48 cases pass. Hash deduplication emits eight derivative files for the four unique source contents; this is not a benchmark of 72 unique camera masters.
- Empty: all folders removed in the owned QA copy; optional SEO image removed to avoid a reference to a deleted photo. check/61 and 12 actual production/no-JavaScript cases pass. No dist/media remains after the clean build.

All three variants were visually captured at 1440/768/390/320; no measured horizontal overflow. Single/large/empty states retain useful navigation and honest content. Separate 30-photo unit/browser cases cover large galleries; the real many-folder stress copy covers listing growth and discovery.

## Visual review

[VISUAL_REVIEW.md](VISUAL_REVIEW.md) records three rounds and all fourteen critique passes. Corrected missing work headings, excessive portrait scale, long-name desktop hierarchy, unbalanced single-session layouts, duplicate action text, category-free title spacing and redundant story text. Final contact copy describes the visitor-facing empty state without configuration instructions.

Reviewed default home/session/viewer at 1440/768/390, customized light/single/many/empty 1440/768/390/320, mobile menu, contact, portrait/landscape gallery, 844×390 viewer, reduced motion and actual no-JavaScript output. Natural ratios/full viewer fitting preserve photograph compositions. The new hero, photo index, serif hierarchy and black field are visibly different from the approved graphic-demo base while retaining its native motion language.

Ignored local evidence under .taste-skill/qa:
- before-1440/768/390.png; home-fold-*, home-*, session-* and viewer-*;
- custom-home-*, custom-session-*, many-home-*, many-session-*, empty-home-*;
- editorial-1440.webm / editorial-390.webm: actual production entrances, smooth About/Work navigation, project changes, viewer direction/close and contact; mobile includes the menu;
- video-* extracted frames, menu-390.png, contact-1440/390.png, viewer-landscape.png, reduced-390.png, noscript-390.png;
- performance.json.

These files are local QA evidence, deliberately not repository payload or site assets. Capture scripts wait for fonts/decoded visible images and inspect/finish real finite effects for settled screenshots; recordings run the effects normally. Extracted recording frames were also inspected.

### Inspector limitation, preserved transparently

The unmodified installed Design Taste inspector ran on production at 1440/768/390: zero measured overflow, broken images and console errors, but one still-page FAIL. Its late periodic getAnimations sampling misses completed finite WAAPI effects. Original report and screenshots remain at .taste-skill/inspection-final-raw.

A separately named ignored local copy adds only native Element.animate recording; it calls the original unchanged, observes nonzero-duration portfolio-ID effects and keeps every existing rule/threshold. No whitelist, disabled check or production change. Its supplementary report at inspection-final-native records 30/30/29 moving elements, zero FAIL and the same two WARNs. All fold/page sheets from both reports were opened.

Warnings are accepted for soft ivory text (explicit user brief) and absent footage (no authentic licensed process clip; this is a still-photography template). The unchanged original gate is not claimed as passing. Visual self-assessment: design 8, usability 8, creativity 7, content 7 = 7.7 before caps; original-inspector strict cap leaves 6.0. This is a disclosed tool/style limitation, not a hidden release assertion. Long-name stress variants also exceed the skill's three-line aesthetic preference while remaining readable.

## Bundle and local performance

| Production output | Approved motion base | Editorial |
| --- | --- | --- |
| JavaScript | 290.18 kB / 91.90 gzip | 292.59 kB / 92.50 gzip |
| CSS | 21.21 kB / 5.36 gzip | 23.54 kB / 6.07 gzip |
| HTML | 4.84 kB / 1.92 gzip | 3.43 kB / 1.44 gzip |

Runtime JavaScript grows about 0.60 kB gzip (0.7%). No new runtime dependency. Sharp 0.35.5 is build-only. Local EB Garamond Latin WOFF2 is 23.82 kB (preloaded); optional Latin-ext is 56.96 kB. Eight derivative WebPs range from 38.16–95.75 kB (960) and 128.75–211.67 kB (1920). Four untouched public publication originals total 1,276,708 bytes and still enter dist.

A fresh local Chromium production comparison at 1440×900 and 390×900 sampled the first 180 rAF intervals for the approved motion dist and editorial dist, served through local Vite preview. All four samples: CLS 0, median/p95 about 16.7ms, zero long tasks, zero running idle animations. Editorial home requests zero original photos; decoded response-body image bytes are 279,956 versus 2,055 for the old SVG demonstration. The richer imagery has a real transfer cost. No throttled-network, physical-device, universal FPS, memory ceiling or causal performance-improvement claim is made. One earlier sample had a 16.8ms editorial desktop p95; this scale of variation is noise.

Native effects are finite and release to visible CSS. The passive image observer schedules at most one rAF for visible photos; there is no idle loop. Derivatives load lazily outside the first visible print, known dimensions reserve ratios, the viewer mounts display images when opened, and processing is sequential with bounded input pixels/bytes.

## Security and accepted limitations

Exact Sharp 0.35.5 replaced an initially investigated vulnerable older release before the implementation commit. npm audit --omit=dev reports zero; the complete audit still has twelve moderate minimatch findings through current ESLint/TypeScript-ESLint ranges. The previously documented compatible-fix limitation remains; no npm audit fix --force, cross-major override or unnecessary tooling migration. See [RELEASE_REVIEW.md](RELEASE_REVIEW.md).

Everything inside public is published, including originals/metadata/unsupported files. Preview metadata omission does not scrub original EXIF/GPS. Keep private masters elsewhere, use approved web exports and verify consent/licences before committing. Included scenes are generated demonstrations; no real clients/people/third-party stock photos are claimed. SVG owner assets remain trusted input.

Hash routing and static homepage SEO remain. There is no independently indexed project HTML or per-project server social card; client 404 views retain static HTTP 200. No architectural migration was justified for this scope.

Physical Safari/iOS/Android, low-end hardware, real touch/trackpad motion, real screen readers and assistive hardware remain manual. Review the owner's actual photos, name, alt text, captions, contrast and contact destinations before publication. No external email delivery, account ownership, hosting domain or deployed service was tested or created.

## CI and reproduction

The inherited unchanged push/pull-request workflow uses Node 22/Ubuntu, pinned official checkout/setup-node actions, locked npm ci, validation, lint, units, TypeScript, build, production audit and all three engines/six profiles. Read-only contents permissions, no persisted checkout credential, secrets, paid service or deployment. Earlier actionlint validation remains applicable to the unchanged YAML; actual Ubuntu runs verify execution. Push coverage does not separately prove a pull-request event.

Current source evidence: [clean e050fc8 run](https://github.com/vibeewithasa/personal-showcase/actions/runs/41430646881). The final documentation/visitor-copy commit triggers the same job; the delivery report records its observed result and final remote SHA. [Latest branch runs](https://github.com/vibeewithasa/personal-showcase/actions?query=branch%3Afeat%2Fportfolio-editorial-sessions).

```bash
npm ci
npm run validate
npm run check
npx playwright install chromium firefox webkit
npm run test:e2e
npm audit --omit=dev
npm run preview
```

For constrained Windows hardware, build first and run npx playwright test --workers=1 --retries=0 alone. Do not build nested QA copies during a running Vite browser suite. Logs/copies/captures/traces remain ignored. No PR, merge, force push or deployment.
