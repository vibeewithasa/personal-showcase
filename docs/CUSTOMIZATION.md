# Create your own portfolio

You only need to edit `src/content/portfolio.json` and add files to `public/images/`. No React changes are required for ordinary customization. Keep JSON valid: double quotes, no comments, no trailing commas.

## 1. Identity

Replace the default `identity` object, for example:

```json
"identity": {
  "name": "Your Name",
  "role": "Photographer & visual artist",
  "intro": "Portraits and visual stories for people with something to say.",
  "location": "Based in your city",
  "availability": "Available for selected projects",
  "logo": { "src": "images/my-logo.svg", "alt": "Your Name mark" },
  "portrait": { "src": "images/my-portrait.webp", "alt": "Your Name at work in the studio" }
}
```

`name`, `role`, and `intro` are required. Delete optional `location`, `availability`, `logo`, or `portrait` keys if you do not use them. Do not leave optional strings blank or set them to `null`. Without a logo, navigation displays your name. The optional portrait appears in the about section. The logo uses contain sizing; portfolio covers use a 4:3 crop. Short names and headings give the strongest composition; long names wrap instead of overflowing.

Set top-level `demo` to `false` to remove the demo labels. Also replace the descriptive demo text and all sample projects; the flag does not rewrite content for you.

## 2. About and services

```json
"about": {
  "title": "An observant eye.",
  "paragraphs": ["Your biography.", "How you approach your work."],
  "services": ["Portrait photography", "Creative direction"]
}
```

Use at least one paragraph. Use `"services": []` to omit services. Delete the entire `about` key to remove both the section and its navigation item.

## 3. Images

- Copy your own licensed files to `public/images/`. Nested folders are allowed, such as `public/images/project-one/cover.webp`.
- Use paths like `images/project-one/cover.webp`. Do not include `public/`, a leading slash, spaces, query parameters, or `..`.
- Supported extensions: `avif`, `gif`, `jpg`, `jpeg`, `png`, `svg`, `webp`, `ico` (lowercase).
- All image references are local by design. Download only assets you have rights to redistribute. External image URLs are rejected.
- Write descriptive alt text explaining the image, not its filename. Do not put essential project explanations only inside an image.
- Use roughly 1200–1800px-wide WebP/AVIF/JPEG images. Compress them before adding them; the template does not resize large source files automatically.
- Covers display in a 4:3 frame and crop with `object-fit: cover`; prepare a suitable crop. The enlarged viewer uses `contain` to show the whole image. Portraits use a square crop. All frames reserve space before loading.
- Only use SVG files from sources you trust. SVG can contain active content when opened directly; this template checks paths, not the contents of uploaded artwork.

`npm run validate` verifies required fields, file presence, and exact filename case on all platforms. Many production hosts are case-sensitive even if your Windows filesystem is not. If an image fails at runtime, a visible alternative appears and navigation remains usable.

## 4. Add or remove projects

Duplicate an object in `projects`, then replace its fields:

```json
{
  "slug": "a-new-perspective",
  "title": "A New Perspective",
  "category": "Photography",
  "year": "2026",
  "summary": "A short introduction shown on the work list and detail page.",
  "cover": {
    "src": "images/perspective-cover.webp",
    "alt": "A sunlit architectural detail in warm tones"
  },
  "description": ["The brief and your approach.", "What you made and why."],
  "gallery": [
    { "src": "images/perspective-cover.webp", "alt": "A sunlit architectural detail in warm tones" },
    { "src": "images/perspective-detail.webp", "alt": "Close-up of the building's repeating window pattern" }
  ],
  "url": "https://your-real-project-site.com"
}
```

`category`, `year`, and `url` are optional; delete unused keys. All other keys are required. Each slug must be unique and contain lowercase letters, digits, and single hyphens. Project order follows the JSON array. Remove an object to remove the project. The UI handles any number of projects, including `"projects": []`.

The gallery may be empty (`[]`); then the cover becomes its single viewer image. With one project, the next-project control becomes a return link. With multiple projects, it cycles in array order. Descriptions are plain text, not HTML or Markdown. All external `url` values must be complete HTTPS URLs without embedded credentials.

## 5. Contact and social links

```json
"contact": {
  "email": "you@your-real-domain.com",
  "phone": "+1 (555) 123-4567",
  "note": "Tell me a little about your project and timeline.",
  "links": [
    { "label": "Instagram", "url": "https://www.instagram.com/your-real-handle/" },
    { "label": "Journal", "url": "https://your-real-domain.com/journal" }
  ]
}
```

These are examples: replace them with real details before publishing. Delete unused `email`, `phone`, and `note` keys; keep `links` as an array, even if empty. The template opens the visitor's mail or phone app; it does not send or store messages. External links open in a new tab with that behavior included in their accessible label. With no contact methods it displays an unavailable state. Do not add a form unless you also implement a real delivery service and its error states.

## 6. Colours

The five `theme` keys are required six-digit hex values:

```json
"theme": {
  "background": "#12140f",
  "surface": "#20231b",
  "text": "#f3f3e9",
  "muted": "#b8bdad",
  "accent": "#d1ef82"
}
```

All CSS and initial HTML use these values. Text, muted text, and accent must each have at least 4.5:1 contrast against background and surface. The accent band/button use the background colour as their ink. Light themes are supported too: use dark text, muted, and accent values on light backgrounds. Validation explains which pair needs adjustment.

Layout and typography live in `src/index.css` if you want deeper design changes. There are no remote fonts to configure or license.

## 7. Metadata

Edit `seo.title` and `seo.description`; replace `seo.favicon` with your local icon. `seo.image` is optional. For sharing, use your own 1200×630 JPEG/PNG and a descriptive filename. The supplied sharing image is only a demo.

Add `"siteUrl": "https://your-real-domain.com/"` inside `seo` only once you know your actual public URL. For a subdirectory use its full trailing-slash URL, for example `https://your-real-domain.com/portfolio/`. Do not add a fictitious URL. Without it, the build omits canonical and absolute sharing URLs. Never put passwords, API keys, private data, or other secrets in the JSON: its content is public in the browser bundle.

Run `npm run build` again after changing metadata. Static HTML is generated from the same JSON. Project titles/descriptions also update in the browser; individual crawler-visible social cards require a future prerendering/server solution.

## 8. Before publishing

Run `npm run check` and `npm run test:e2e`. Open `npm run preview`; review each project, broken/empty states as relevant, mobile navigation, keyboard focus, image crops, contact destinations, and the demo flag. Follow the [deployment guide](DEPLOYMENT.md). Keep the MIT notice and rights information for any additional assets.
