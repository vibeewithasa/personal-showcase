import { lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePortfolio, portfolioImages } from '../src/content/schema.ts';
import { discoverSessions } from './sessions.ts';

export async function loadPortfolio(root = fileURLToPath(new URL('../', import.meta.url))) {
  const owner = parsePortfolio(JSON.parse(readFileSync(join(root, 'src/content/portfolio.json'), 'utf8')));
  const sessions = await discoverSessions(join(root, 'public'), join(root, 'node_modules/.cache/portfolio-images'));
  for (const session of sessions.projects) {
    if (owner.projects.some(project => project.slug === session.slug)) throw new Error(`Session slug collision "${session.slug}" between portfolio.json and public/sessions. Remove the migrated manual project or give the session a unique slug.`);
  }
  const config = parsePortfolio({ ...owner, projects: [...owner.projects, ...sessions.projects] });
  for (const path of new Set(portfolioImages(config))) {
    try {
      let directory = join(root, 'public');
      if (lstatSync(directory).isSymbolicLink()) throw new Error('Symbolic links are not supported.');
      for (const segment of path.split('/').map(decodeURIComponent)) {
        if (!readdirSync(directory).includes(segment)) throw new Error('Filename case does not match');
        directory = join(directory, segment);
        if (lstatSync(directory).isSymbolicLink()) throw new Error('Symbolic links are not supported.');
      }
      if (!statSync(directory).isFile()) throw new Error('Not a file');
    } catch (error) {
      throw new Error(`Missing portfolio image: ${path}. ${(error as Error).message}. Check filename case, add it under public/, or update src/content/portfolio.json/session.json.`);
    }
  }
  return { config, sessions: sessions.projects, assets: sessions.assets, warnings: sessions.warnings };
}
