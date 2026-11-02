import data from './portfolio.json';
import sessions from 'virtual:portfolio-sessions';
import { parsePortfolio } from './schema';

export const portfolio = parsePortfolio({ ...data, projects: [...data.projects, ...sessions] });
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
