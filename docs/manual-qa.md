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

## Focus styling on project cards

`src/components/Project.tsx` sets `tabIndex={0}` and `role="button"` on each project card. Its visual transitions are **hover** and **active** driven (`group-hover:` and `group-active:`), with no explicit `focus-visible:` styling on the card. The local `src/index.css` also does not define a shared keyboard-focus outline. Browsers may provide their own default outline, but the result must be checked against the dark image/title surfaces; merely tabbing to a focusable card is not sufficient evidence that focus is visible.

- [ ] Starting from the top of the page, navigate to all three cards using Tab/Shift+Tab without a mouse and locate their visible focus indicator at mobile and desktop sizes.
- [ ] Check that image overlays and label color changes remain legible when the card is focused, not just hovered.
- [ ] Record the separate **known activation defect** (the cards present as buttons but have no activation handlers). Address action semantics and focus presentation together in a future reviewed component change, rather than adding focus decoration to an unusable control as a complete accessibility fix.

These are source-derived test cases; no browser or screen-reader test has been performed in this documentation update.

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

## Logo accessibility and linked image name

The two brand images in `src/components/AboutMeContent.tsx` and `src/components/NavBar.tsx` both currently use the generic `alt="Logo"`. The navbar image is inside an `<a href="/">`, so that generic alternative text may also become the **accessible name of the Home link**. Neither location identifies the portfolio brand to someone listening to link or image names.

- [ ] Inspect the accessibility tree and a screen reader's links list for the logo link; check whether its announced destination is understandable without looking at the page.
- [ ] Confirm whether the large About image communicates the brand or merely decorates adjacent text. Use an accurate brand description if meaningful, or decorative alternative text only when equivalent information is already present in accessible text.
- [ ] If changing either image, test both the navbar's link name and the separate About image, rather than applying the same alt text automatically to both.

This is a **source-backed review finding**, not a completed assistive-technology test or a request to rename the brand without the owner's approval.

## Menu-toggle semantics and announced state

`NavBar.tsx` uses a **checkbox inside a styled `label.swap`** as the mobile menu toggle. The checkbox has `aria-label="Toggle menu"`, but the source does **not** expose `aria-expanded` or `aria-controls` for the overlay and does not update its accessible name to say `Abrir` or `Cerrar`. A screen reader may announce a checked/unchecked checkbox rather than an expanded/collapsed navigation menu, even though the SVG changes between hamburger and close icons.

- [ ] With the menu collapsed, focus the checkbox using keyboard and inspect its role, accessible name and state using a screen reader and accessibility tree.
- [ ] Activate with Space, confirm the menu appears and check whether its **expanded state** and close action are understandable without sight; repeat after closing it and after following Home.
- [ ] Repeat when resizing across the `md` breakpoint; verify the hidden control's state does not leave users stranded behind an overlay.

If the semantics are insufficient, implement and test an appropriate toggle/button relationship separately, preserving the visual design. This is a source-based observation, not an assistive-technology test already run.

## Social icon accessible-name regression

`src/components/NavBar.tsx` displays Facebook, Instagram and YouTube as icon-only anchors in desktop and mobile layouts. The current anchors do not have explicit `aria-label` text or a visible text label. Their decorative SVG icons may not supply a usable link name to assistive technology.

- [ ] Inspect the accessibility tree for each social link on desktop and when the mobile menu is open; confirm that its announced name identifies the destination, not just “link”.
- [ ] Check whether the menu toggle's `Toggle menu` label and keyboard state are clear with a screen reader.
- [ ] After closing the mobile menu, Tab through the page and verify the hidden panel's links are **not** reachable (see [known limitations](known-limitations.md#closed-mobile-menu-may-remain-in-keyboard-navigation)).
- [ ] When implementing a fix, retest both viewports and ensure each link still opens the intended account safely.

These are source-based risks awaiting manual verification, not claims of an accessibility test already passed.

## Search and link-preview metadata

The current root `index.html` contains a tab title and a remote favicon, but **does not define** a page description, Open Graph image/title, Twitter-card metadata or canonical URL. An image loading in the page does not prove that links shared in messaging apps will show the intended preview.

- [ ] For a public deployment, check the actual generated page source, response headers and resolved favicon URL.
- [ ] If social-preview metadata is added, use the confirmed public site URL and an image the project is permitted to display; validate the preview from an independent client/crawler.
- [ ] Do not report search or social previews as tested solely because the React page and `npm run build` work.

## Before release

Run `npm run lint` and `npm run build`, then serve the compiled output with `npm run preview`. Record any browser/device-specific failures before deployment.

## Project image loading under constrained networks

`Home.tsx` currently renders three remote Cloudinary project covers through `Project.tsx`, whose `<img>` element has **no explicit `loading`, `decoding`, `width` or `height` attributes**. The fixed visual height from Tailwind is not a guarantee about downloaded image size or network timing. A fast local preview cannot establish how the homepage behaves with slow mobile data, blocked external resources or delayed images.

- [ ] Open the built site in a clean browser profile with network throttling. Inspect all three image requests for transfer size and timing rather than assuming viewport-triggered card animations lazy-load images.
- [ ] Disable external image requests temporarily and verify project titles remain legible, keyboard traversal is usable and the page is not hidden indefinitely by animations.
- [ ] Record whether a cover causes visible layout movement while loading on mobile and desktop; check whether the existing CSS dimensions reserve adequate space.
- [ ] If performance measurements justify lazy loading, responsive sources or image dimensions, implement and measure them as a separately reviewed component change. Do not make claims about Largest Contentful Paint or layout-shift scores without actually measuring them.

## External asset and link regression checks

The project images in `src/pages/Home.tsx` and header logo in `src/components/NavBar.tsx` use externally hosted URLs. After editing these references:

- [ ] Open each image URL in a private browser window to check that it loads without a signed-in session.
- [ ] Confirm the image is not cropped unexpectedly at narrow and wide viewports.
- [ ] Confirm the asset owner permits its use; a successful HTTP response does not establish reuse rights.
- [ ] Follow each Facebook, Instagram and YouTube link from both desktop and mobile navigation; verify the destination account with the content owner.
- [ ] Check that the new-tab links retain `rel="noopener noreferrer"` when changing markup.

Record broken URLs and unauthorized assets as release blockers; do not substitute unrelated stock images just to make the page appear complete.
