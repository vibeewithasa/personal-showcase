# Editorial sessions architecture

Branch: `feat/portfolio-editorial-sessions`, isolated `.worktrees/editorial-sessions`, based on the approved remote motion SHA `6c9b4e3775f4950824eae404047bf6384eb0e913`. Only this new branch is authorized for commits/push. Main, reusable, discarded release, motion and unrelated local changes are protected. No PR, merge or deployment.

## Visual direction

“Photographs at uneven sizes” (Design Taste seed 1335841711): a folder becomes a sequence of prints. Near-black background, soft ivory, restrained warm accent, local EB Garamond display type and system reading type. The hero has three unequal prints, the work index alternates scale/alignment, galleries preserve intrinsic proportions, and the footer pairs a photograph with identity/navigation. Single and empty portfolios have explicit compositions; long identities use a smaller responsive scale.

The dealt pale palette was adapted to the user's explicit black brief. No invented photographer, client, testimonial, location or biography was introduced. Open Frame is visibly a demonstration brand; all four original generated scenes are labelled. Exact generation prompts and font source are in [DEMO_IMAGE_PROMPTS.md](DEMO_IMAGE_PROMPTS.md).

The approved Web Animations API/IntersectionObserver/CSS system remains. No animation library or replacement routing architecture was added. Existing masks, shutters, stagger, menu/viewer, reduced motion and failure fallbacks continue to work. Image overscan/drift is smaller to respect photographic edges. See [MOTION_SYSTEM.md](MOTION_SYSTEM.md).

## Content flow

1. `src/content/portfolio.json` holds owner identity, contact, theme, SEO and optional legacy projects.
2. `scripts/sessions.ts` scans immediate `public/sessions/<folder>` directories, validates optional `session.json`, discovers supported files, reads dimensions/orientation and creates cached previews.
3. `scripts/load-portfolio.ts` resolves both sources through the existing schema and validates local originals. Manual projects come first; folder sessions follow their deterministic ordering. Duplicate slugs fail with migration guidance.
4. `scripts/portfolio-plugin.ts` exposes the discovered projects through a Vite virtual module, serves previews in development, injects resolved static metadata/no-JavaScript content, and emits current previews to `dist/media`.
5. Components consume the same resolved project shape. Folder sessions need no component changes or central photograph list.

A small Vite plugin is used because it can share discovery with validation/tests, serve cached images, watch filesystem changes and emit build assets without a generated manifest that users might edit or forget to refresh. There is no database, server runtime, CMS or upload endpoint.

## Determinism and development updates

Natural numeric filenames, stable tie-breaks and optional imageOrder define gallery order. Cover priority is explicit filename, cover filename, then first ordered photo; cover selection never silently changes gallery order. Sessions use featured, numeric order, natural folder name. Unknown dates/locations/descriptions are not fabricated.

Folder names yield readable slugs; non-Latin names use a stable NFC-derived hash when no explicit slug exists. Each URL path segment is encoded. Exact filenames, including case, are checked on Windows as well as Linux.

The dev watcher observes owner/session changes, debounces bursts, invalidates resolved content and reloads the page. Add, replace, rename, delete, invalid/fixed metadata and deleting/recreating the sessions root are integration-tested. Every new session uses the same native motion declarations automatically. Current content hashes prevent stale previews after replacement/deletion.

## Images and trust boundaries

JPEG/PNG/WebP/AVIF still images are decoded by exact build-only Sharp 0.35.5. File extensions alone are not trusted; disguised/animated/multipage input fails. Symlinks/junctions, traversal, invalid metadata/paths, invalid dates and collisions fail clearly. Limits are 100 MB per input and 80 megapixels; over 12 MB warns. Sequential processing bounds concurrent decode work.

Original files are never overwritten. EXIF orientation is applied to WebP publication previews capped at 960/1920px, without enlargement or composition crop. Hashed derivative names include source bytes and processing settings. Cache is ignored under node_modules/.cache; only currently referenced assets enter dist/media. Known dimensions reserve ratios, offscreen images load lazily and decode asynchronously. Home never requests full originals; the viewer requests the display preview when mounted.

Everything under public is nevertheless copied into dist, including originals, session.json and unsupported files. Preview metadata stripping does not sanitize originals or grant consent. Keep masters/private photos elsewhere; publish approved, metadata-reviewed web copies only. Owner SVG/logo content is trusted input, not sanitized. See [SESSIONS.md](SESSIONS.md).

## Navigation

MainLayout owns route scroll. Native smooth scroll handles internal Work/About links; live reduced motion uses instant movement. Sticky-header margins, preventScroll focus, repeat clicks, cross-route entry, history, reload and direct links are covered. Native history restoration is scoped to manual while this controller is mounted, avoiding competing restoration. Media preference changes cancel smooth movement without re-running route navigation or replaying section entrances.

Hash routing remains deliberately compatible with plain static root/subdirectory hosting. Static homepage metadata/no-JavaScript fallback are retained; independently indexed project HTML/social cards are still outside this architecture.

## Verification and continuation

See [QA.md](QA.md) for actual counts, CI logs, visual critique, customization, bundle/performance and manual limits. See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) before continuing. Do not infer publication or real-device approval from local emulation.

Implementation milestone: 2d75f37. Verified refinement milestone: e050fc8. QA copies, browser traces, screenshots, recordings, caches and agent files stay ignored; generated publication assets, licences and documentation are committed.
