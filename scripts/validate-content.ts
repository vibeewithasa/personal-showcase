import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePortfolio, portfolioImages } from '../src/content/schema.ts';

export const config = parsePortfolio(JSON.parse(readFileSync(new URL('../src/content/portfolio.json', import.meta.url), 'utf8')));
const paths = [...new Set(portfolioImages(config))];
for (const path of paths) {
  const file = new URL(`../public/${path}`, import.meta.url);
  try {
    let directory = fileURLToPath(new URL('../public/', import.meta.url));
    for (const segment of path.split('/')) {
      if (!readdirSync(directory).includes(segment)) throw new Error('Filename case does not match');
      directory = join(directory, segment);
    }
    if (!statSync(file).isFile()) throw new Error('Not a file');
  } catch {
    throw new Error(`Missing portfolio image: ${path}. Check filename case, add it at ${fileURLToPath(file)}, or update src/content/portfolio.json.`);
  }
}
console.log(`Portfolio valid: ${config.projects.length} projects, ${paths.length} local image assets.`);
