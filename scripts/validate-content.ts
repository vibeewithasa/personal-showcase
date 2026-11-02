import { loadPortfolio } from './load-portfolio.ts';
import { portfolioImages } from '../src/content/schema.ts';
const result = await loadPortfolio();
for (const warning of result.warnings) console.warn(warning);
console.log(`Portfolio valid: ${result.config.projects.length} projects, ${new Set(portfolioImages(result.config)).size} local image assets.`);
