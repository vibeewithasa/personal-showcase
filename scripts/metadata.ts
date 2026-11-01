import type { HtmlTagDescriptor } from 'vite';
import type { Portfolio } from '../src/content/schema.ts';

export function metadata(config: Portfolio, base: string): HtmlTagDescriptor[] {
  const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
  const meta = (key: string, value: string, property = false): HtmlTagDescriptor => ({
    tag: 'meta', attrs: { [property ? 'property' : 'name']: key, content: escape(value) },
  });
  const tags: HtmlTagDescriptor[] = [
    { tag: 'title', children: escape(config.seo.title) },
    { tag: 'style', children: `:root{${Object.entries(config.theme).map(([name, value]) => `--${name}:${value}`).join(';')}}` },
    { tag: 'link', attrs: { rel: 'icon', href: `${base}${config.seo.favicon}` } },
    meta('description', config.seo.description),
    meta('theme-color', config.theme.background),
    meta('og:type', 'website', true),
    meta('og:title', config.seo.title, true),
    meta('og:description', config.seo.description, true),
    meta('og:site_name', config.identity.name, true),
    meta('twitter:card', config.seo.siteUrl && config.seo.image ? 'summary_large_image' : 'summary'),
  ];
  if (config.seo.siteUrl) {
    const url = config.seo.siteUrl.replace(/\/?$/, '/');
    tags.push(meta('og:url', url, true), { tag: 'link', attrs: { rel: 'canonical', href: escape(url) } });
    if (config.seo.image) tags.push(meta('og:image', new URL(config.seo.image, url).href, true), meta('twitter:image', new URL(config.seo.image, url).href));
  }
  return tags;
}
