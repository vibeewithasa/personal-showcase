# Known limitations on the default branch

This list is based on current source inspection; it is not a report of completed browser testing.

## Contact route

`NavBar.tsx` links to `/contact` in both desktop and mobile navigation, while `PersonalShowcaseRoutes.tsx` only registers `/`. A Contact page should be implemented or its links removed in a separately reviewed feature change.

## Project cards

`Project.tsx` gives each card `role="button"`, `tabIndex={0}`, and a pointer cursor, but supplies neither an `onClick` handler nor keyboard activation. Cards therefore suggest an action without implementing one. Decide whether cards should navigate to project details or instead be presented as non-interactive content.

## Animation preferences

`AnimatedSection.tsx` uses Framer Motion viewport animations and does not explicitly handle reduced-motion preferences. Review accessibility requirements before changing motion behavior.

## Content management

Project metadata and remote image URLs are hard-coded in `Home.tsx`. Updates require a code change and rebuild. A future data-driven approach could improve maintenance, but is not implemented on this branch.

## Verification boundary

The current `package.json` exposes `lint` and `build` scripts but no test script. These notes do not imply that either command or a browser audit has been run as part of this documentation update.
