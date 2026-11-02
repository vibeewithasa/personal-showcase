# Owner customization

Use [SESSIONS.md](SESSIONS.md) for folder sessions. Owner identity is independent of session metadata: edit only src/content/portfolio.json for the settings below.

| Field | Purpose |
| --- | --- |
| demo | True for included demonstration content; false for your own publication |
| identity.name, role, intro | Your name/brand, profession and short introduction |
| identity.location, availability | Optional real location/status |
| identity.logo, portrait | Optional local images with src and meaningful alt |
| about | Optional title, paragraph array and service array; remove to hide |
| contact.email, phone, note, links | Real contact values; links is an array of label/HTTPS url |
| theme | Exactly background, surface, text, muted, accent as six-digit hex colours |
| seo | Homepage title/description/favicon, optional sharing image and deployed siteUrl |
| projects | Empty array for folder-only sites; optional legacy manual work |

No personal information is inferred from photographs. Do not add invented contact methods. The empty contact state is intentionally honest.

## Local owner assets

Add your logo, portrait and favicon under public/images. Owner/manual asset paths keep the existing safe format, for example images/my-logo.webp: no leading slash, spaces or traversal. Each image object has src and alt. Session photographs support their original camera/Unicode filenames separately through discovery.

Supported image extensions for owner/manual assets remain AVIF/GIF/JPEG/PNG/SVG/WebP/ICO. Use trusted SVGs; file validation is not SVG sanitization. Favicon can be an SVG/ICO/PNG. Fonts are local; the bundled EB Garamond OFL must remain with its files.

## Themes and names

The default is near-black with warm neutral text/accent. All five colours remain configurable. Validation requires 4.5:1 text/muted/accent contrast against both backgrounds. No theme values beyond those five keys enter generated CSS.

Long names wrap safely; narrow-screen typography avoids isolated trailing letters for ordinary words. Review your own unusually long unbroken name/title and non-Latin fallback fonts at 320px. Motion retains full text opacity so it does not weaken a valid light theme.

## SEO

Set seo.siteUrl only to the real deployed base URL, including any subdirectory. This enables canonical and absolute sharing URLs. Metadata is static for the homepage; hash projects do not have independently crawled HTML or social cards. See DEPLOYMENT.md.

## Existing manual projects

Manual projects still use slug/title/summary/cover/description/gallery and optional category/year/url. They appear before discovered sessions. To migrate, create the folder and optional metadata, remove the corresponding manual record, then validate. Duplicate slugs across either source fail clearly. Do not copy generated session paths into this list or maintain both records for one session.

The old licensed graphic studies remain only in tests/fixtures to preserve behavioral coverage. Replace public content freely; keep those test fixtures.

## Check your changes

Run npm run check, npm run test:e2e and npm run preview. Inspect real photographs, captions, metadata, links, keyboard navigation, image errors, custom colours and reduced motion. Build warnings tell you about empty/unsupported/large sessions. The [session guide](SESSIONS.md) explains sizes, formats, privacy and publication in full.
