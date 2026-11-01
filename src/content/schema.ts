export interface PortfolioImage { src: string; alt: string }
export interface PortfolioLink { label: string; url: string }
export interface PortfolioProject {
  slug: string;
  title: string;
  summary: string;
  category?: string;
  year?: string;
  cover: PortfolioImage;
  description: string[];
  gallery: PortfolioImage[];
  url?: string;
}
export interface Portfolio {
  demo: boolean;
  identity: {
    name: string; role: string; intro: string;
    location?: string; availability?: string;
    logo?: PortfolioImage; portrait?: PortfolioImage;
  };
  about?: { title: string; paragraphs: string[]; services: string[] };
  contact: { email?: string; phone?: string; note?: string; links: PortfolioLink[] };
  seo: { title: string; description: string; favicon: string; image?: string; siteUrl?: string };
  theme: { background: string; surface: string; text: string; muted: string; accent: string };
  projects: PortfolioProject[];
}

function requireValue(condition: unknown, path: string, message: string): asserts condition {
  if (!condition) throw new Error(`Portfolio configuration: ${path} ${message}`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  requireValue(value && typeof value === 'object' && !Array.isArray(value), path, 'must be an object.');
  return value as Record<string, unknown>;
}

function text(value: unknown, path: string): asserts value is string {
  requireValue(typeof value === 'string' && value.trim().length > 0, path, 'must be a non-empty string.');
}

function optionalText(value: unknown, path: string) {
  if (value !== undefined) text(value, path);
}

function array(value: unknown, path: string): unknown[] {
  requireValue(Array.isArray(value), path, 'must be an array (use [] when empty).');
  return value;
}

function paragraphs(value: unknown, path: string) {
  const items = array(value, path);
  requireValue(items.length > 0, path, 'must contain at least one paragraph.');
  items.forEach((item, index) => text(item, `${path}[${index}]`));
}

function imagePath(value: unknown, path: string) {
  text(value, path);
  requireValue(/^images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:avif|gif|jpe?g|png|svg|webp|ico)$/.test(value), path,
    'must be a local path such as images/my-project.webp (no leading slash, spaces, or traversal).');
}

function image(value: unknown, path: string) {
  const item = object(value, path);
  imagePath(item.src, `${path}.src`);
  text(item.alt, `${path}.alt`);
}

function httpsUrl(value: unknown, path: string) {
  text(value, path);
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`Portfolio configuration: ${path} must be a complete HTTPS URL.`); }
  requireValue(/^https:\/\//i.test(value) && url.protocol === 'https:' && !url.username && !url.password, path, 'must be a complete HTTPS URL without credentials.');
  return url;
}

export function contrast(first: string, second: string) {
  const luminance = (hex: string) => {
    const [r, g, b] = hex.slice(1).match(/../g)!.map(part => {
      const channel = parseInt(part, 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function parsePortfolio(value: unknown): Portfolio {
  const config = object(value, 'root');
  requireValue(typeof config.demo === 'boolean', 'demo', 'must be true or false.');
  const identity = object(config.identity, 'identity');
  ['name', 'role', 'intro'].forEach(key => text(identity[key], `identity.${key}`));
  ['location', 'availability'].forEach(key => optionalText(identity[key], `identity.${key}`));
  ['logo', 'portrait'].forEach(key => { if (identity[key] !== undefined) image(identity[key], `identity.${key}`); });
  if (config.about !== undefined) {
    const about = object(config.about, 'about');
    text(about.title, 'about.title');
    paragraphs(about.paragraphs, 'about.paragraphs');
    array(about.services, 'about.services').forEach((item, index) => text(item, `about.services[${index}]`));
  }
  const contact = object(config.contact, 'contact');
  optionalText(contact.note, 'contact.note');
  if (contact.email !== undefined) {
    text(contact.email, 'contact.email');
    requireValue(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(contact.email), 'contact.email', 'must be an email address.');
  }
  if (contact.phone !== undefined) {
    text(contact.phone, 'contact.phone');
    requireValue(/^\+?[0-9 ()-]{5,30}$/.test(contact.phone) && contact.phone.replace(/\D/g, '').length >= 5, 'contact.phone', 'must be a phone number.');
  }
  array(contact.links, 'contact.links').forEach((value, index) => {
    const link = object(value, `contact.links[${index}]`);
    text(link.label, `contact.links[${index}].label`);
    httpsUrl(link.url, `contact.links[${index}].url`);
  });
  const seo = object(config.seo, 'seo');
  text(seo.title, 'seo.title');
  text(seo.description, 'seo.description');
  imagePath(seo.favicon, 'seo.favicon');
  if (seo.image !== undefined) imagePath(seo.image, 'seo.image');
  if (seo.siteUrl !== undefined) {
    const url = httpsUrl(seo.siteUrl, 'seo.siteUrl');
    requireValue(!url.search && !url.hash, 'seo.siteUrl', 'must not contain a query or hash.');
  }
  const theme = object(config.theme, 'theme');
  ['background', 'surface', 'text', 'muted', 'accent'].forEach(key => {
    requireValue(typeof theme[key] === 'string' && /^#[0-9a-f]{6}$/i.test(theme[key] as string), `theme.${key}`, 'must be a six-digit hex colour.');
  });
  for (const background of ['background', 'surface']) {
    for (const foreground of ['text', 'muted', 'accent']) {
      requireValue(contrast(theme[background] as string, theme[foreground] as string) >= 4.5,
        `theme.${foreground}`, `needs at least 4.5:1 contrast against theme.${background}.`);
    }
  }
  const slugs = new Set<string>();
  array(config.projects, 'projects').forEach((value, index) => {
    const path = `projects[${index}]`, project = object(value, path);
    ['slug', 'title', 'summary'].forEach(key => text(project[key], `${path}.${key}`));
    const slug = project.slug as string;
    requireValue(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !slugs.has(slug), `${path}.slug`, 'must be a unique lowercase slug, such as field-notes.');
    slugs.add(slug);
    ['category', 'year'].forEach(key => optionalText(project[key], `${path}.${key}`));
    image(project.cover, `${path}.cover`);
    paragraphs(project.description, `${path}.description`);
    array(project.gallery, `${path}.gallery`).forEach((item, i) => image(item, `${path}.gallery[${i}]`));
    if (project.url !== undefined) httpsUrl(project.url, `${path}.url`);
  });
  return value as Portfolio;
}

export function portfolioImages(config: Portfolio) {
  return [config.seo.favicon, config.seo.image, config.identity.logo?.src, config.identity.portrait?.src,
    ...config.projects.flatMap(project => [project.cover.src, ...project.gallery.map(item => item.src)])]
    .filter((path): path is string => Boolean(path));
}
