# Add your photographs — no React editing required

This is a static portfolio. Your identity lives in one owner file; each photographic session lives in its own folder. You do not maintain a central list of photograph paths.

## 1. Download and open

Install Node.js 22.16 or newer and npm, then:

```bash
git clone https://github.com/vibeewithasa/personal-showcase.git
cd personal-showcase
git switch feat/portfolio-editorial-sessions
npm ci
npm run dev
```

Open the local address printed by Vite. A ZIP of this branch also works: extract it and begin with npm ci inside that folder. Do not open index.html directly.

## 2. Make the owner information yours

Edit `src/content/portfolio.json` in a text editor:

- identity: name, profession/role, introduction, optional location, availability, logo and portrait;
- about: optional title, paragraphs and services; remove the whole about object when unnecessary;
- contact: real email/phone/social links; an empty array of links is valid;
- theme: five contrast-checked colours;
- seo: title, description, favicon, optional image and real deployed siteUrl;
- demo: change to false after replacing the demonstration identity and artwork.

Keep `projects: []` when using folders exclusively. No photograph list belongs in this owner file. Optional owner logos/portraits/favicons can live under public/images with safe names such as images/my-logo.svg. The existing owner fields and contrast validation remain supported.

## 3. Copy a session folder

```text
public/
  sessions/
    coastal-light/
      DSC_0001.JPG
      02 Roca fría.webp
      session.json
    quiet-forms/
      01.jpg
      02.webp
    my-new-session/
      IMG_1234.jpeg
      Retrato final.webp
```

Each immediate folder becomes a project automatically. JPG/JPEG, PNG, WebP and AVIF are supported, case-insensitively. Names from cameras, spaces and Unicode are supported. Names are preserved on disk; URL segments are encoded for the browser.

HEIC, RAW/NEF/CR2/ARW/DNG, TIFF, videos and nested image folders are not discovered. Export non-destructive JPEG/WebP copies first. A folder with no supported pictures is omitted with a warning. Unsupported files are reported rather than silently treated as photos.

Without metadata, the title comes from the folder name, the summary is the image count, and generic alt text identifies the session and image number. No dates, clients, locations or visual descriptions are invented. Add useful alt descriptions when you know the contents.

## 4. Add optional metadata

Create `public/sessions/my-new-session/session.json`:

```json
{
  "title": "My new session",
  "slug": "my-new-session",
  "summary": "Write a short introduction to this sequence.",
  "description": [
    "Describe your own session in your own words.",
    "Add another paragraph only when it helps the viewer."
  ],
  "category": "Personal work",
  "cover": "Retrato final.webp",
  "order": 2,
  "featured": false,
  "imageOrder": ["Retrato final.webp", "IMG_1234.jpeg"],
  "photos": {
    "Retrato final.webp": {
      "alt": "Replace this with a meaningful description of your photograph.",
      "caption": "An optional visible caption."
    },
    "IMG_1234.jpeg": {
      "alt": "Describe this photograph too."
    }
  }
}
```

Every field is optional. Do not paste the explanatory alt strings unchanged into a real portfolio. An optional date must be an actual ISO date such as YYYY-MM-DD; omit it when unknown. Description accepts a string or an array of paragraphs. Unknown fields and invalid values are errors with the filename and a useful message.

File references are exact filenames, including their letter case. Do not write public/, paths to other folders, or ../ in cover/imageOrder/photos. A typo or missing filename fails validation.

## 5. Choose order and cover

Sessions sort by featured first, then numeric order (lower first), then natural folder name. Without metadata, folder-1, folder-2, folder-10 have a stable natural order.

Images sort naturally by filename: 1, 2, 10. Optional imageOrder lists preferred filenames first; unlisted images follow naturally. It is not a required list of all photographs.

The cover is selected by:

1. explicit cover filename;
2. a file named cover with a supported extension;
3. the first ordered photograph.

Choosing a cover does not reorder the gallery. Set imageOrder too when you want the cover first in the sequence.

Folders generate lowercase URL slugs; accents are simplified, for example sesión-playa becomes sesion-playa. A folder whose name cannot generate a Latin slug needs an explicit slug. Use unique lowercase letters/numbers separated by hyphens. Duplicate or invalid slugs are errors.

## 6. Add, replace, rename or remove

With npm run dev running, copy a new folder into public/sessions. The browser reloads after the filesystem settles; no manifest command or server restart is needed. Editing metadata, replacing a photograph, renaming a folder and removing a session are also detected. Invalid content shows a development error; fixing the file recovers the site.

Rename the folder or set an explicit slug to control its address. Keep an explicit slug when changing a display title/folder but preserving old shared URLs. Delete a folder to remove its session. Back up your photographs yourself; no importer moves, overwrites or deletes originals.

## 7. Check and publish

```bash
npm run validate
npm run check
npx playwright install chromium firefox webkit
npm run test:e2e
npm run build
npm run preview
```

Validation reports unsupported files, empty folders and photographs over 12 MB. Invalid metadata, unreadable supported images, symlinks, slug conflicts, missing references, images above 80 megapixels and files above 100 MB fail clearly. Export a smaller web copy instead of weakening the checks.

Review your real content at desktop, tablet and phone sizes, including keyboard controls, long captions and reduced motion. The build writes dist. Upload its contents to your chosen static host; these commands do not deploy anything. Hash URLs work without rewrite rules at a domain root or subdirectory. See DEPLOYMENT.md for hosting and existing SEO limits.

## Previews, performance and privacy

Sharp is a build-only dependency. It reads EXIF orientation and dimensions, generates WebP previews capped at 960/1920 pixels on the long edge, preserves the full composition, and never enlarges small photographs. Previews use fresh content hashes after replacement. They are cached under node_modules/.cache/portfolio-images, served locally in development and emitted under dist/media for production. Only current referenced previews are emitted. Cache files are reproducible and not committed.

Home/gallery thumbnails use the 960px copy; the viewer loads the 1920px copy when opened. Loading is lazy outside the first visible print, decoding is asynchronous, and known dimensions reserve each photograph's ratio. The lightbox fits the entire photograph.

**Everything inside public is public and is copied into dist, including originals, metadata and unsupported files.** Web previews omit EXIF metadata; the original files remain untouched and may still contain GPS/camera data. Put only approved web copies in public, keep camera masters/private files elsewhere, remove unsupported files before publishing, and strip sensitive metadata from your publication copies.

This feature does not authorize publishing real client photographs to GitHub. Check consent, asset rights and repository visibility before committing your own photos. There is no upload service, backend, tracking, paid API or CMS.

## Existing manual projects

The legacy projects array remains supported for existing sites and non-photographic work. Manual projects appear first; discovered sessions follow their own ordering. The combined list must have unique slugs. A collision fails with migration guidance.

To migrate one manual project: copy its photographs into a folder, put its text in session.json, remove that manual entry from portfolio.json, then validate. Do not keep both records for the same project. There is no generated JSON file to edit and no second source of truth for folder sessions.

## Included demo and fonts

coastal-light demonstrates metadata, explicit cover, per-photo alt text/captions, camera naming and Unicode. quiet-forms demonstrates discovery without metadata. The four scenes are AI-generated demonstration artwork, not real clients or commissioned photography. Source/prompt notes are in public/sessions/README.md. Replace the demo folders for a real portfolio.

EB Garamond is hosted locally as WOFF2, with its SIL Open Font License in public/fonts/OFL.txt. Arial/Helvetica and serif fallbacks are system fonts. No font/image CDN is needed at runtime.
