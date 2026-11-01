import data from './portfolio.json';
import { parsePortfolio } from './schema';

export const portfolio = parsePortfolio(data);
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
