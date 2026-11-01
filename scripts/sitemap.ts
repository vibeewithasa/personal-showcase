// Run after building: node --experimental-strip-types scripts/sitemap.ts https://your-domain.example
import { writeFileSync } from 'node:fs';
import { portfolio } from '../src/content/portfolio.ts';
const base = new URL(process.argv[2] || '');
if (
  base.protocol !== 'https:' ||
  base.pathname !== '/' ||
  base.search ||
  base.hash ||
  base.username ||
  base.password
)
  throw new Error(
    'Supply your public HTTPS origin without path, query or credentials',
  );
const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const paths = [
  '/',
  '/portfolio',
  '/about',
  '/contact',
  ...portfolio.projects.map((p) => `/projects/${p.slug}`),
];
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escape(new URL(path, base).href)}</loc></url>`).join('')}</urlset>`,
);
