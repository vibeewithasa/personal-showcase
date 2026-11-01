import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { portfolio } from '../src/content/portfolio.ts';
import { validatePortfolio } from '../src/content/validation.ts';
import { site } from '../src/content/site.ts';
import {
  pageMetadata,
  sitePaths,
  publicOrigin,
} from '../src/content/metadata.ts';
const output = process.argv[3] || 'dist';
const configuredOrigin = process.argv[2] ?? site.origin;
const errors = validatePortfolio(portfolio);
if (errors.length) throw new Error(`Invalid content:\n${errors.join('\n')}`);
const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const shell = readFileSync(join(output, 'index.html'), 'utf8');
for (const path of [...sitePaths(), '/404']) {
  const meta = pageMetadata(path, configuredOrigin);
  let html = shell.replace(
    /<title>.*?<\/title>/s,
    `<title>${escape(meta.title)}</title>`,
  );
  for (const [name, value] of Object.entries({
    description: meta.description,
    'og:title': meta.title,
    'og:description': meta.description,
    'og:image': meta.image,
    'twitter:card': 'summary_large_image',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
    'twitter:image': meta.image,
    robots: meta.robots,
  })) {
    const key = name.startsWith('og:') ? 'property' : 'name';
    html = html.replace(new RegExp(`<meta\\s+${key}="${name}"[^>]*>`, 'g'), '');
    html = html.replace(
      '</head>',
      `<meta ${key}="${name}" content="${escape(value)}" />\n</head>`,
    );
  }
  if (meta.canonical)
    html = html.replace(
      '</head>',
      `<link rel="canonical" href="${escape(meta.canonical)}" /><meta property="og:url" content="${escape(meta.canonical)}" />\n</head>`,
    );
  const file =
    path === '/'
      ? join(output, 'index.html')
      : path === '/404'
        ? join(output, '404.html')
        : join(output, path.slice(1), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
const origin = publicOrigin(configuredOrigin);
if (origin) {
  writeFileSync(
    join(output, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitePaths()
      .map((p) => `<url><loc>${escape(origin + p)}</loc></url>`)
      .join('')}</urlset>`,
  );
  writeFileSync(
    join(output, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  );
}
console.log(
  `Validated catalog and generated metadata HTML for ${sitePaths().length} routes. ${origin ? 'Canonical URLs, sitemap and robots configured.' : 'No production origin set: canonical URLs and sitemap intentionally omitted.'}`,
);

writeFileSync(join(output, '_redirects'), sitePaths().filter(p => p !== '/').map(p => `${p} ${p}/index.html 200`).join('\n') + '\n/* /index.html 200\n');
