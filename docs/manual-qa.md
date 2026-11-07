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

## Social icon accessible-name regression

`src/components/NavBar.tsx` displays Facebook, Instagram and YouTube as icon-only anchors in desktop and mobile layouts. The current anchors do not have explicit `aria-label` text or a visible text label. Their decorative SVG icons may not supply a usable link name to assistive technology.

- [ ] Inspect the accessibility tree for each social link on desktop and when the mobile menu is open; confirm that its announced name identifies the destination, not just “link”.
- [ ] Check whether the menu toggle's `Toggle menu` label and keyboard state are clear with a screen reader.
- [ ] After closing the mobile menu, Tab through the page and verify the hidden panel's links are **not** reachable (see [known limitations](known-limitations.md#closed-mobile-menu-may-remain-in-keyboard-navigation)).
- [ ] When implementing a fix, retest both viewports and ensure each link still opens the intended account safely.

These are source-based risks awaiting manual verification, not claims of an accessibility test already passed.

## Before release

Run `npm run lint` and `npm run build`, then serve the compiled output with `npm run preview`. Record any browser/device-specific failures before deployment.

## External asset and link regression checks

The project images in `src/pages/Home.tsx` and header logo in `src/components/NavBar.tsx` use externally hosted URLs. After editing these references:

- [ ] Open each image URL in a private browser window to check that it loads without a signed-in session.
- [ ] Confirm the image is not cropped unexpectedly at narrow and wide viewports.
- [ ] Confirm the asset owner permits its use; a successful HTTP response does not establish reuse rights.
- [ ] Follow each Facebook, Instagram and YouTube link from both desktop and mobile navigation; verify the destination account with the content owner.
- [ ] Check that the new-tab links retain `rel="noopener noreferrer"` when changing markup.

Record broken URLs and unauthorized assets as release blockers; do not substitute unrelated stock images just to make the page appear complete.
