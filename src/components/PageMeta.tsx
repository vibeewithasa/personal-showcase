import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageMetadata } from '../content/metadata';
export default function PageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = pageMetadata(pathname);
    document.title = meta.title;
    const set = (name: string, content?: string) => {
      const key = name.startsWith('og:') ? 'property' : 'name';
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[${key}="${name}"]`,
      );
      if (!content) {
        tag?.remove();
        return;
      }
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(key, name);
        document.head.append(tag);
      }
      tag.content = content;
    };
    for (const [name, content] of Object.entries({
      description: meta.description,
      'og:title': meta.title,
      'og:description': meta.description,
      'og:image': meta.image,
      'og:url': meta.canonical,
      'twitter:title': meta.title,
      'twitter:description': meta.description,
      'twitter:image': meta.image,
      robots: meta.robots,
    }))
      set(name, content);
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (meta.canonical) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.append(canonical);
      }
      canonical.href = meta.canonical;
    } else canonical?.remove();
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}
