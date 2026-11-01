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
  const paragraphs = (items: string[]) => items.map(item => `<p>${escape(item)}</p>`).join('');
  const image = (src: string, alt: string) => `<img src="${escape(base + src)}" alt="${escape(alt)}" width="1200" height="900" loading="lazy">`;
  const about = config.about ? `<section><h2>${escape(config.about.title)}</h2>${paragraphs(config.about.paragraphs)}<ul>${config.about.services.map(item => `<li>${escape(item)}</li>`).join('')}</ul></section>` : '';
  const projects = config.projects.map(project => `<article class="noscript-project"><h3>${escape(project.title)}</h3>${image(project.cover.src, project.cover.alt)}<p>${escape(project.summary)}</p>${paragraphs(project.description)}<ul>${project.gallery.map(item => `<li><a href="${escape(base + item.src)}">View image: ${escape(item.alt)}</a></li>`).join('')}</ul>${project.url ? `<a href="${escape(project.url)}">Visit project</a>` : ''}</article>`).join('');
  const contact = [
    config.contact.email ? `<a class="text-link" href="mailto:${escape(encodeURIComponent(config.contact.email).replace('%40', '@'))}">${escape(config.contact.email)}</a>` : '',
    config.contact.phone ? `<a class="text-link" href="tel:${config.contact.phone.replace(/[^+0-9]/g, '')}">${escape(config.contact.phone)}</a>` : '',
    ...config.contact.links.map(link => `<a class="text-link" href="${escape(link.url)}">${escape(link.label)}</a>`),
  ].filter(Boolean).join(' ');
  const fallback = `<div class="page-width noscript-page"><header><h1>${escape(config.identity.name)}</h1><p>${escape(config.identity.role)}</p><p>${escape(config.identity.intro)}</p></header><main><section><h2>Selected work</h2>${projects || '<p>New work is on its way.</p>'}</section>${about}<section><h2>Contact</h2><p>${escape(config.contact.note || (contact ? 'Get in touch using the details below.' : 'Contact details will be available here soon.'))}</p>${contact}</section></main></div>`;
  return [...tags.map(tag => ({ ...tag, injectTo: 'head' as const })), { tag: 'noscript', children: fallback, injectTo: 'body' }];
}
