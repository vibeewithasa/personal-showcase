# Updating portfolio content

The current site stores its visible content in React components rather than a CMS or central JSON configuration.

## Project cards

Edit `src/pages/Home.tsx` to change the three existing `Project` elements. Each receives:

- `title`: visible uppercase project name and accessible label.
- `image`: image URL; use a publicly accessible asset and verify its usage rights.
- `reverse` (optional): swaps image and title order on medium and larger screens.

The cards are displayed in source order. The second and third are wrapped in `AnimatedSection` for viewport entrance effects. When adding a card, check the mobile and desktop layouts.

## Branding and links

- `src/components/AboutMeContent.tsx`: main logo image and profession caption.
- `src/components/NavBar.tsx`: navigation labels, header logo, and social profile links.
- `src/pages/Home.tsx`: footer label.

The navbar contains a Contact link to `/contact`, but `src/routes/PersonalShowcaseRoutes.tsx` currently defines only `/`. Do not advertise the Contact page as working until a route is implemented.

## Review before publishing

1. Verify each new image URL loads and its subject matches the title.
2. Check image crops on narrow and wide screens.
3. Verify external links and accessible image descriptions.
4. Run `npm run lint` and `npm run build`.
5. Preview the production build with `npm run preview`.

Do not commit private contact information or assets without permission to publish them.
