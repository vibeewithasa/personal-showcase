# Portfolio motion system

## Editorial integration — 2026-11-02

The editorial branch builds from approved motion SHA 6c9b4e3775f4950824eae404047bf6384eb0e913 and preserves this native system. Photographic sessions receive the same declarations automatically. Picture overscan is 1.025 and visible drift is capped at 1.25% to preserve photographic edges. Natural image ratios, captions, single/empty layouts and previews do not change the finite presets, easing or menu/viewer lifecycle.

MainLayout now owns native smooth Work/About navigation with instant reduced-motion behavior, sticky-header offsets, accessible focus and manual native history restoration scoped to the controller. Changing the OS preference does not re-run route scroll. No CSS smooth-scroll duplicate or scroll hijacker was added. Current QA retains all 108 approved browser cases and adds 36 editorial cases; current evidence supersedes the historical counts below. See QA.md.

The remainder documents the original approved motion implementation and its historical evidence.

Implemented on `feat/portfolio-motion-system` from confirmed remote base `87ae1e2c0eeba2e566cf4d86ac5f127ad42f1d13`, in the isolated `.worktrees/motion-design` worktree. The original template, main checkout and discarded release branch are preserved.

## Direction and implementation choice

Keep the existing editorial grid, type, configurable palette and local artwork. The signature is a masked word rise, followed by image shutters and ordered copy. Native surfaces use shorter, distinct gestures. No preloader, scroll hijacking, infinite loop, 3D engine, remote asset or new dependency.

Motion's React/LazyMotion/mini APIs were considered. These finite transforms, masks and sequences fit the browser's Web Animations API, IntersectionObserver and CSS. Adding a library would duplicate the scoped controller without solving an unmet requirement. References: [Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [Animation.finished](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished), [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver), [Motion bundle options](https://motion.dev/docs/react-reduce-bundle-size).

## Choreography

| Surface | Behavior |
| --- | --- |
| Hero | Role line enters horizontally; identity words rise/rotate behind individual masks; introduction and CTA follow with capped stagger. The accessible heading remains one complete name. |
| Selected work | Heading and count enter separately. Alternating image shutters, ordered metadata/title/summary/link, subtle scroll depth and pointer/keyboard image enlargement. |
| About | Heading, services and paragraphs follow reading order; optional portrait has a shutter; contact link has a shorter entrance. |
| Contact | Page arrival, heading, introduction, configured methods and social links are staggered. Empty contact remains honest and usable. |
| Navigation | Active underline, rotating disclosure symbol, clipped mobile surface with link stagger; finite exit keeps links inert until hidden. Navigation never waits for an outgoing page. |
| Project detail / 404 | Short page arrival; detail heading/summary, gallery thumbnails, story and next-project link have their own entrances. |
| Image viewer | Native dialog moves/scales in, photo shifts by direction, counter rises, loaded bitmap resolves, backdrop and surface exit together. Escape/backdrop/Close share one close path. |
| Controls | Button lift/press, arrow movement, image enlargement and visible focus. Hover is supplemental; touch and keyboard keep the same actions. |

## Tune or maintain

- `src/motion/motion.css`: one set of timing/easing tokens. Hero 840ms, picture 950ms, reveal 720ms, control 340ms, page 420ms, exit 180ms, hover 220ms, stagger 80ms.
- `src/motion/motion.ts`: finite keyframe presets, media-query subscription, cancellable completion and scoped page observation.
- Components declare `data-motion`, optional `data-order`, grouped reveal and immediate `data-start`. A group reveals its descendants once; an ordinary animated container does not rescan them. Delay is capped at six steps for arbitrary JSON lengths.
- Page changes disconnect observers, cancel effects/rAF and remove parallax styles. No global route queue or persistent hidden/seen attribute.
- Image drift is clamped to 2.5% of image height. Only visible images are measured, all reads precede writes, and scroll/resize schedules at most one rAF. There is no idle animation loop.
- Content, optional sections, identity/logo, colours and images still come from the same JSON. No new animation fields are required.
- Change the CSS tokens/presets to adjust the motion design. Preserve focus, reduced-motion cancellation, final visible CSS and the tested close lifecycle when editing.

## Accessibility and failure behavior

Normal CSS is the visible final state. Effects use backwards fill for stagger, never persistent forwards hiding. Failed/unavailable animation APIs leave content readable and controls immediate. Text and control entrances retain full opacity so valid light themes retain their contrast during motion.

The OS reduced-motion preference is live: page effects stop, image drift is removed, and viewer/menu effects cancel or complete immediately. CSS feedback is disabled under that preference. Focus entering an animated target cancels its reveal so its action is available immediately.

Native dialog semantics, focus containment, recorded-opener return and Escape are retained. A stable, responsive photo slot prevents loaded/failed images from resizing the viewer; captions and controls can scroll with unusually long content. Closing still releases scroll lock. Resize during mobile-menu exit cannot disable desktop links.

When JavaScript is disabled, the production build supplies an escaped `noscript` portfolio with the actual identity, projects, artwork/file links, optional about and real contact methods. This fallback is static content, not another router or per-project SEO implementation. Development index HTML does not run the build-time injection.

## Verification

Implementation commit: `d12237e71c52553c260a84e77595ec5aea4f2a87`. Local Windows and [hosted Ubuntu Actions run 41362032488](https://github.com/vibeewithasa/personal-showcase/actions/runs/41362032488) pass 33 unit tests and 102 browser checks across six Chromium/Firefox/WebKit projects, with no skips or reported flakes.

Final source 3146b0b passes [hosted run 41363073809](https://github.com/vibeewithasa/personal-showcase/actions/runs/41363073809): 33 units / 108 browsers without skips or reported flakes. The final local run passes 108/108 with one worker and zero retries. Nine motion cases per browser project test actual native effect frames/delays/completion, one-time scroll reveal, bounded depth, cancellable menu/resize, viewer direction/counter/close/focus, live reduced motion, whole ordinary words at 320px, failed API, failed photo geometry and no JavaScript. Existing 54 browser cases are retained. Tests finish or inspect real animations instead of waiting arbitrary durations. WebKit development StrictMode can restart initial effects; tests verify that closing does not reveal thumbnails again.

A fresh isolated copy of this commit, with actual replacement JSON/logo/artwork, light colours, long name, no about, one project, fallback gallery and all public demo SVGs removed, passes `npm ci`, `npm run check` and initially 102 browser checks; with the final narrow-type adjustment it passes all 108, in isolation with zero retries. Zero-project production/no-JavaScript checks are recorded in QA.md.

## Visual and performance evidence

Local ignored evidence lives in `.taste-skill/qa/`:

- `before-1440/768/390.png`, `after-1440/768/390.png`, `hero-mid-1440/768/390.png`: comparable static and in-flight compositions.
- `project-transition-1440.webm`, `project-transition-390.webm`: consecutive project navigation and viewer in the production build; `reduced-390.png`: reduced-motion composition.
- `motion-1440.webm`, `motion-390.webm`: actual entrance, scrolling, project navigation, gallery, counter/close and contact; mobile also records the menu.
- `menu-390.png`, `viewer-1440/390.png`, `viewer-landscape.png`, `contact-1440/390.png`, `noscript-390.png`, `custom-1440/320.png`.
- `performance.json`: two production previews, Chromium headless, 1440×900, first 120 rAF intervals. Both CLS 0; median 16.7ms; p95 16.8ms before / 16.7ms after; no active idle animations. One baseline long task / zero after. This small local sample does not establish real-device performance or causation.

| Production output | Base 87ae1e2 | Motion |
| --- | --- | --- |
| JavaScript | 282.59 kB / 89.86 gzip | 290.18 kB / 91.90 gzip |
| CSS | 17.22 kB / 4.44 gzip | 21.21 kB / 5.36 gzip |
| HTML | 1.35 kB / 0.63 gzip | 4.84 kB / 1.92 gzip |

JavaScript gzip increases 2.04 kB (about 2.3%). HTML growth includes the readable no-JavaScript portfolio. No dependency/lockfile changes. No universal FPS claim is made.

See QA.md for inspector findings, security/SEO limits, physical-device checks and reproduction commands.
