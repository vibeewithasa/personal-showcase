import { portfolio, projectCover } from './portfolio.ts';
import { site } from './site.ts';

export function publicOrigin(value: string) {
  if (!value) return undefined;
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error(
      'Site origin must be a public HTTPS origin without a path, query or credentials',
    );
  return url.origin;
}
export function pageMetadata(pathname: string, origin = site.origin) {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const project = portfolio.projects.find(
    (p) => path === `/projects/${p.slug}`,
  );
  const pages: Record<string, string> = {
    '/': 'Photography & film',
    '/portfolio': 'Portfolio',
    '/about': 'About',
    '/contact': 'Contact',
  };
  const found = Boolean(project || pages[path]);
  const base = publicOrigin(origin);
  return {
    title: `${project?.title || pages[path] || 'Page not found'} — ${portfolio.name}`,
    description: project?.description || site.description,
    image: (project && projectCover(project)?.src) || site.sharingImage,
    canonical: base && found ? `${base}${path}` : undefined,
    robots: found ? 'index,follow' : 'noindex,follow',
  };
}
export function sitePaths() {
  return [
    '/',
    '/portfolio',
    '/about',
    '/contact',
    ...portfolio.projects.map((p) => `/projects/${p.slug}`),
  ];
}
