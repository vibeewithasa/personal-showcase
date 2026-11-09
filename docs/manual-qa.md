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

## CSS entrance animations with reduced motion

In addition to the Framer Motion `AnimatedSection`, `src/pages/Home.tsx` uses the `opacity-0 animate-fadeIn` utility on the About block and first project, while `src/index.css` defines a 0.7-second CSS `fadeIn` animation. `Home.tsx` also animates the outer header directly with Framer Motion. None of those three entrance paths explicitly checks `prefers-reduced-motion` in the current source.

- [ ] Enable reduced motion at the OS/browser level, reload, and inspect the About section, first project and header separately from the later project cards.
- [ ] Verify that content remains visible if animation support is disabled or styles are delayed, especially elements starting at `opacity-0`.
- [ ] Record the actual behavior before designing a motion-preference fix; `npm run build` cannot certify this accessibility requirement.

## Resize while the mobile menu is open

The full-screen overlay in `src/components/NavBar.tsx` is mounted for all viewport sizes and does not have a `md:hidden` class; its visibility is controlled by `isOpen`. The toggle is hidden at desktop width, but an already opened overlay may remain visible if the viewport is expanded from mobile to desktop without closing it first.

- [ ] Open the menu at a phone width, then resize the same page beyond the desktop breakpoint without reloading.
- [ ] Check whether the overlay obscures the desktop navigation and whether the user still has a reachable close control.
- [ ] Resize back to phone width and verify the menu state is understandable; repeat with browser zoom and device rotation where available.

This test follows from the current component classes and state; the behavior has not been confirmed in a browser during this documentation update.

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
