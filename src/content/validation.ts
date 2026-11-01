import type { PortfolioContent } from './portfolio.ts';
export function validatePortfolio(content: PortfolioContent): string[] {
  const errors: string[] = [];
  const https = (value: string, label: string) => {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password)
        throw Error();
    } catch {
      errors.push(`${label}: use a public HTTPS URL without credentials`);
    }
  };
  const dims = (
    w: number | undefined,
    h: number | undefined,
    label: string,
  ) => {
    if (
      (w !== undefined || h !== undefined) &&
      !(Number.isFinite(w) && Number.isFinite(h) && w! > 0 && h! > 0)
    )
      errors.push(`${label}: supply positive width and height together`);
  };
  if (!content.name.trim()) errors.push('Photographer name is required');
  dims(content.logoWidth, content.logoHeight, 'Logo');
  if (content.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email))
    errors.push('Contact email is invalid');
  if (
    new Set(content.categories).size !== content.categories.length ||
    content.categories.includes('All')
  )
    errors.push(
      'Categories must be unique and must not use the reserved All label',
    );
  content.socials.forEach((s) => {
    https(s.url, s.label);
    if (!s.label.trim()) errors.push('Social labels must not be empty');
  });
  const slugs = new Set<string>();
  for (const p of content.projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug))
      errors.push(`Invalid or duplicate project slug: ${p.slug}`);
    slugs.add(p.slug);
    if (!p.title.trim()) errors.push(`${p.slug}: title is required`);
    if (p.category && !content.categories.includes(p.category))
      errors.push(`${p.slug}: category is not configured`);
    if (
      p.coverAspectRatio !== undefined &&
      !(Number.isFinite(p.coverAspectRatio) && p.coverAspectRatio > 0)
    )
      errors.push(`${p.slug}: invalid cover aspect ratio`);
    const ids = new Set<string>();
    for (const photo of p.images) {
      if (!photo.id || ids.has(photo.id))
        errors.push(`${p.slug}: photo IDs must be unique and nonempty`);
      ids.add(photo.id);
      if (!photo.alt.trim())
        errors.push(
          `${p.slug}/${photo.id}: descriptive alternative text is required`,
        );
      https(photo.src, `${p.slug}/${photo.id}`);
      dims(photo.width, photo.height, `${p.slug}/${photo.id}`);
    }
    if (p.coverId && !ids.has(p.coverId))
      errors.push(`${p.slug}: coverId must refer to a gallery photograph`);
    if (p.video) {
      https(p.video.src, `${p.slug} video`);
      p.video.captions?.forEach((t) => https(t.src, `${p.slug} caption track`));
    }
  }
  return errors;
}
