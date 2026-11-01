# Static deployment

No hosting account or deployment is assumed. This project produces static files; these instructions do not create resources or publish anything automatically.

## Build and review

```bash
npm ci
npm run check
npm run test:e2e
npm run preview
```

Install the Playwright browser once before browser tests (`npx playwright install chromium`). Open the URL printed by the preview command, normally `http://127.0.0.1:4173`. Check your real content and contact destinations before uploading anything. `preview` serves the existing `dist/`; rebuild after changes. It is a local review server, not a production server.

## Publish the build

Upload **the contents of `dist/`**, including `index.html`, `assets/`, and `images/`, to your static host's public directory. Never upload `node_modules`, private files, or the source checkout as the public root. For a host that builds from Git, select the branch containing your customized template and set:

- Install: `npm ci`
- Build: `npm run build`
- Output/publish directory: `dist`
- Node: 22.16 or newer, preferably a currently supported LTS version

A plain static file server is sufficient. Use HTTPS on the public site. No environment variables or secrets are required. Do not add a fictional `siteUrl`: use your real final URL and rebuild to enable canonical and absolute Open Graph image URLs.

## Subdirectories

The build uses relative asset paths (`base: './'`) and hash routing. You can place the contents of `dist/` at the domain root or inside `/portfolio/` without rebuilding for a different Vite base. Include the trailing slash in the directory URL so relative paths resolve inside it.

Examples of URL shapes (substitute your real domain):

```text
https://your-domain.com/#/work/field-notes
https://your-domain.com/portfolio/#/work/field-notes
```

Set `seo.siteUrl` to `https://your-domain.com/portfolio/` for the second case. The browser tests exercise the actual production build at both root and subdirectory paths with no rewrite fallback.

## Routing and SEO

Hash routes deliberately avoid requiring SPA rewrites or a hosting-specific 404 file. Opening and refreshing a project URL asks the server for the same `index.html`; the browser selects the project from the hash. A nonexistent client route displays the portfolio's missing-page view, but the HTTP response remains the static server's normal 200 response.

The initial HTML includes configurable title, description, favicon, theme colour, Open Graph text, and Twitter card type. With a real `seo.siteUrl` and image it also includes canonical, absolute Open Graph image, and Twitter image URLs. The included sharing artwork is an example; use your own JPEG/PNG for broad platform support.

Project titles and descriptions update after JavaScript runs. Search engines and social scrapers do not all execute JavaScript or index hash routes as separate pages, so this template does **not** promise independently indexed project pages or per-project social cards. If those are important, add prerendered page output or an SSR/static-site solution and reassess routing. This static-template implementation makes no such service dependency.

## Operational checks

- Test every contact/external destination; a syntactically valid URL may still point to a missing account.
- Ensure filenames match case exactly on the host.
- Keep cache lifetimes long for hashed `assets/` files and short for `index.html`. Replace image filenames or purge caches after updating same-name public images.
- Check the browser console and network panel for missing files after upload.
- Rerun checks after dependency updates. `npm audit --omit=dev` checks production dependencies; the complete audit includes local development tools too.

No deploy, domain registration, email integration, or paid service was performed as part of the template conversion.
