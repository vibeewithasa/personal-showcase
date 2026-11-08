# Known limitations on the default branch

This list is based on current source inspection; it is not a report of completed browser testing.

## Contact route

`NavBar.tsx` links to `/contact` in both desktop and mobile navigation, while `PersonalShowcaseRoutes.tsx` only registers `/`. A Contact page should be implemented or its links removed in a separately reviewed feature change.

## Closed mobile menu may remain in keyboard navigation

`NavBar.tsx` keeps the full-screen mobile panel mounted even when `isOpen` is false, hiding it with `scale-0`, `opacity-0` and `pointer-events-none`. Those CSS properties do **not** remove its links from keyboard tab order. The panel has no `hidden`, `inert` or conditional unmount, so Home, Contact and social links may still receive focus while visually closed. Confirm with keyboard and assistive-technology checks before choosing an appropriate focus-management fix; this note is based on source inspection, not a completed browser test.

## Mobile menu Escape and focus management

The mobile checkbox in `NavBar.tsx` toggles `isOpen` through `onChange`, and the Home/Contact links close the panel on click. The component currently does **not** register an Escape-key handler to dismiss the open overlay or restore focus to the menu toggle. Combined with the hidden-link focus issue above, this makes keyboard navigation worth checking before production release. Test Escape, the focused element after closure, and the return to page content with a keyboard and screen reader; implement the fix in a separately reviewed UI change.

## Project cards

`Project.tsx` gives each card `role="button"`, `tabIndex={0}`, and a pointer cursor, but supplies neither an `onClick` handler nor keyboard activation. Cards therefore suggest an action without implementing one. Decide whether cards should navigate to project details or instead be presented as non-interactive content.

## Animation preferences

`AnimatedSection.tsx` uses Framer Motion viewport animations and does not explicitly handle reduced-motion preferences. Review accessibility requirements before changing motion behavior.

## Content management

Project metadata and remote image URLs are hard-coded in `Home.tsx`. Updates require a code change and rebuild. A future data-driven approach could improve maintenance, but is not implemented on this branch.

## Verification boundary

The current `package.json` exposes `lint` and `build` scripts but no test script. These notes do not imply that either command or a browser audit has been run as part of this documentation update.
