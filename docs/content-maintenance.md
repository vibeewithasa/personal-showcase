# Updating portfolio content

The current site stores its visible content in React components rather than a CMS or central JSON configuration.

## Project cards

Edit `src/pages/Home.tsx` to change the three existing `Project` elements. Each receives:

- `title`: visible uppercase project name and accessible label.
- `image`: image URL; use a publicly accessible asset and verify its usage rights.
- `reverse` (optional): swaps image and title order on medium and larger screens.

The cards are displayed in source order. The second and third are wrapped in `AnimatedSection` for viewport entrance effects. When adding a card, check the mobile and desktop layouts.

### Handling external project cover failures

`src/components/Project.tsx` renders a plain `<img src={image} alt={title}>` with `object-cover`; it does **not** currently supply an `onError` handler or replacement artwork. A missing, private, expired or blocked Cloudinary URL can leave a broken project cover even if the page itself builds successfully.

For each new cover, check the exact URL from a signed-out browser, inspect the image crop at mobile and desktop widths, and ensure the short project title also makes sense as the current alt text. If a distinct accessibility description or a broken-image fallback is required, treat that as a reviewed component change, not something the existing `image` prop handles automatically.

## Branding and links

- `src/components/AboutMeContent.tsx`: main logo image and profession caption.
- `src/components/NavBar.tsx`: navigation labels, header logo, and social profile links. **Desktop and mobile links are declared separately** in this component, including all three social profiles and the Home/Contact links. Update both sets together, check for broken or mismatched handles, and test both layouts. Editing just the first occurrence of an account URL leaves the other viewport pointing to the old account.
- `src/pages/Home.tsx`: footer label.

The navbar contains a Contact link to `/contact`, but `src/routes/PersonalShowcaseRoutes.tsx` currently defines only `/`. Do not advertise the Contact page as working until a route is implemented.

## Updating the browser tab and favicon

The browser tab is not configured in `AboutMeContent.tsx` or `NavBar.tsx`. For a branding update:

1. Open `index.html` and edit the document `<title>` separately from the visible `Home.tsx` footer and header branding.
2. Review the `<link rel="icon">` URL in `index.html`, which currently references a Cloudinary-hosted image. Verify the actual response's media type before setting the favicon `type` attribute; it currently claims SVG while the image resource is named `.jpg`.
3. Add or update a truthful search description only after the content owner has approved the copy. The current HTML has no `meta name="description"` entry.
4. Check the document's `lang="en"` against the final language of the public-facing copy; do not change the declaration without reviewing the page language.
5. Open the built site with `npm run preview` and check the tab title and icon in a private window. Browser checks are still required because a successful build does not validate remote favicon responses.

These steps are separate from changing a project image, and do not imply that metadata was updated automatically.

## Custom typography and reuse rights

`src/index.css` registers a local `@font-face` named `kenygraffiti`, sourced from `src/assets/fonts/Graffiti.ttf`, and `tailwind.config.js` exposes the corresponding `font-kenygraffiti` utility. These are two separate maintenance points: changing the asset file path or family name in only one place can break the intended typography without causing a TypeScript error. Check the built page in a browser with the font loaded and with the request blocked to confirm readable fallback text.

**Do not assume the font file may be redistributed** merely because the repository's source code has an MIT license. Before publishing a reusable template or distributing bundled assets, verify the font's actual license and replace it with a properly licensed alternative when necessary. This also applies to the remotely hosted photography and branding; do not copy those assets into new templates by default.

## Review before publishing

1. Verify each new image URL loads and its subject matches the title.
2. Check image crops on narrow and wide screens.
3. Verify external links and accessible image descriptions.
4. Run `npm run lint` and `npm run build`.
5. Preview the production build with `npm run preview`.

Do not commit private contact information or assets without permission to publish them.
