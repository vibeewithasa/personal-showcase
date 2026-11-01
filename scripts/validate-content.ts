import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parsePortfolio, portfolioImages } from '../src/content/schema.ts';

export const config = parsePortfolio(JSON.parse(readFileSync(new URL('../src/content/portfolio.json', import.meta.url), 'utf8')));
const paths = [...new Set(portfolioImages(config))];
for (const path of paths) {
  const file = new URL(`../public/${path}`, import.meta.url);
  try {
    if (!statSync(file).isFile()) throw new Error('Not a file');
  } catch {
    throw new Error(`Missing portfolio image: ${path}. Add it at ${fileURLToPath(file)} or update src/content/portfolio.json.`);
  }
}
console.log(`Portfolio valid: ${config.projects.length} projects, ${paths.length} local image assets.`);
