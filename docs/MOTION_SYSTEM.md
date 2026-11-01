# Motion system

Base: 87ae1e2, isolated branch feat/portfolio-motion-system. Existing main, discarded release and reusable-template branches are preserved.

Direction: retain the dark editorial grid, typography and configurable palette. The signature is a masked word rise in the hero; project images open as opposing shutters, copy follows in reading order, and light image drift adds depth. Navigation and viewer interactions use shorter surface/image/counter gestures. No artificial scrolling, blocking preloader, perpetual loop, 3D engine or remote asset.

Implementation choice: reviewed Motion's React/LazyMotion/mini APIs. The required transforms, masks, observation and finite sequencing fit native Web Animations + IntersectionObserver with one scoped controller. CSS handles pointer/keyboard feedback. No animation dependency is needed. Motion tokens live in src/motion/motion.css; presets and reduced-motion/lifecycle behavior live in src/motion/motion.ts.

Content is visible in normal CSS. Native effects use backwards fill and release to that final CSS; unavailable/failed effects leave content visible. Reduced motion cancels page effects, removes drift, and makes controls immediate. Scroll work is one passive listener + one rAF per scroll burst, with bounded visible-image reads before writes. No work runs continuously while idle.

Implementation milestone: integrated hero, project, about/contact, navigation/page and native viewer motion; escaped build-generated no-JavaScript portfolio; 33 unit tests and 102 browser checks pass locally across six Chromium/Firefox/WebKit projects. Existing 54 browser checks are retained. Remaining verification: finish recorded visual review, actual-file customization, hosted CI and final evidence. Baseline JavaScript: 282.59 kB / 89.86 kB gzip; CSS: 17.22 kB / 4.44 kB gzip. Current JavaScript: 290.18 kB / 91.90 kB gzip; CSS: 21.17 kB / 5.35 kB gzip. No dependency or lockfile changes.
