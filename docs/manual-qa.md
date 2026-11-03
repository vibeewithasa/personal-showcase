# Manual browser QA

Run `npm install` and `npm run dev`, then open the local Vite URL printed in the terminal. These are review steps, not claims of completed automated testing.

## Layout and content

- At a narrow phone viewport, confirm the header, logo, and project cards fit without horizontal overflow.
- At a desktop viewport, confirm project image/title columns align and the second card reverses layout.
- Confirm the three project images load and the about caption and footer remain legible.
- Scroll down and back up to inspect the two viewport-triggered project animations.

## Navigation

- On desktop, verify Home returns to `/`.
- On mobile, open the menu, follow Home, and verify the menu closes.
- Verify the social links point to the intended profiles and open safely in a new tab.
- **Known issue to record, not silently pass:** Contact links target `/contact`, but no Contact route is registered on the default branch.

## Accessibility spot checks

- Use Tab and Shift+Tab to inspect focus visibility and logical order.
- Try Enter and Space on focused project cards; they have `role="button"` and `tabIndex={0}`, but currently lack activation handlers. Treat them as a known interaction gap.
- Inspect the mobile menu checkbox's accessible name.
- Review animation behavior with reduced-motion enabled at the OS/browser level; the current `AnimatedSection` implementation does not explicitly check that preference.

## Before release

Run `npm run lint` and `npm run build`, then serve the compiled output with `npm run preview`. Record any browser/device-specific failures before deployment.
