import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { PortfolioImage, PortfolioProject } from '../src/content/schema.ts';

const supported = /\.(jpe?g|png|webp|avif)$/i;
const natural = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const compare = (a: string, b: string) => natural.compare(a, b) || (a < b ? -1 : a > b ? 1 : 0);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const fields = ['slug', 'title', 'summary', 'description', 'category', 'date', 'cover', 'order', 'featured', 'imageOrder', 'photos'];
function fail(path: string, message: string): never { throw new Error(`Session ${path}: ${message}`); }
function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'expected a JSON object.');
  return value as Record<string, unknown>;
}
function text(value: unknown, path: string): string {
  if (typeof value !== 'string' || !value.trim()) fail(path, 'expected non-empty text.');
  return value as string;
}
function noLink(path: string) {
  if (lstatSync(path).isSymbolicLink()) fail(path, 'symbolic links are not supported. Copy the actual file or folder.');
}

export async function discoverSessions(publicRoot: string, cacheRoot: string) {
  if (existsSync(publicRoot)) noLink(publicRoot);
  const root = join(publicRoot, 'sessions');
  const warnings: string[] = [];
  const assets = new Map<string, string>();
  const sessions: { project: PortfolioProject; order: number; featured: boolean; folder: string }[] = [];
  if (!existsSync(root)) return { projects: [], assets, warnings };
  noLink(root);
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) => compare(a.name, b.name))) {
    if (entry.name.startsWith('.') || entry.name === 'README.md') continue;
    const folder = join(root, entry.name);
    noLink(folder);
    if (!entry.isDirectory()) { warnings.push(`Ignored sessions/${entry.name}: put photographs inside a session folder.`); continue; }
    const names = readdirSync(folder).sort(compare);
    for (const name of names) noLink(join(folder, name));
    const metadataPath = join(folder, 'session.json');
    let meta: Record<string, unknown> = {};
    if (existsSync(metadataPath)) {
      try { meta = record(JSON.parse(readFileSync(metadataPath, 'utf8')), metadataPath); }
      catch (error) { fail(metadataPath, `invalid JSON. ${(error as Error).message}`); }
    }
    for (const key of Object.keys(meta)) if (!fields.includes(key)) fail(metadataPath, `unknown field "${key}". See docs/SESSIONS.md.`);
    const photos = names.filter(name => supported.test(name) && lstatSync(join(folder, name)).isFile());
    for (const name of names) {
      if (!photos.includes(name) && name !== 'session.json' && !name.startsWith('.') && !/^(README\.md|Thumbs\.db)$/i.test(name)) {
        warnings.push(`Ignored sessions/${entry.name}/${name}: use JPG, JPEG, PNG, WebP or AVIF files directly in the folder; convert RAW/HEIC copies first. All files in public are published, including unsupported originals.`);
      }
    }
    if (!photos.length) { warnings.push(`Empty session sessions/${entry.name}: no supported photographs, not listed.`); continue; }
    const slug = meta.slug === undefined ? entry.name.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : text(meta.slug, metadataPath + '.slug');
    if (!slugPattern.test(slug)) fail(metadataPath, 'provide a lowercase slug such as coastal-light.');
    const title = meta.title === undefined ? entry.name.replace(/[-_]+/g, ' ').replace(/^./u, c => c.toLocaleUpperCase('en')) : text(meta.title, metadataPath + '.title');
    for (const key of ['summary', 'category', 'cover', 'date']) if (meta[key] !== undefined) text(meta[key], metadataPath + '.' + key);
    if (meta.date !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date as string) || !Number.isFinite(Date.parse(meta.date as string)) || new Date(meta.date as string).toISOString().slice(0, 10) !== meta.date)) fail(metadataPath, 'date must be a real YYYY-MM-DD date.');
    if (meta.order !== undefined && (typeof meta.order !== 'number' || !Number.isFinite(meta.order))) fail(metadataPath, 'order must be a finite number.');
    if (meta.featured !== undefined && typeof meta.featured !== 'boolean') fail(metadataPath, 'featured must be true or false.');
    const ordered = [...photos];
    if (meta.imageOrder !== undefined) {
      if (!Array.isArray(meta.imageOrder) || new Set(meta.imageOrder).size !== meta.imageOrder.length || meta.imageOrder.some(name => typeof name !== 'string' || !photos.includes(name))) fail(metadataPath, 'imageOrder must contain unique, exact filenames from this folder.');
      ordered.sort((a, b) => {
        const ai = (meta.imageOrder as string[]).indexOf(a), bi = (meta.imageOrder as string[]).indexOf(b);
        return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi) || compare(a, b);
      });
    }
    const perPhoto = meta.photos === undefined ? {} : record(meta.photos, metadataPath + '.photos');
    for (const [name, details] of Object.entries(perPhoto)) {
      if (!photos.includes(name)) fail(metadataPath, `photos refers to missing filename "${name}".`);
      const item = record(details, metadataPath + '.photos.' + name);
      for (const key of Object.keys(item)) if (!['alt', 'caption'].includes(key)) fail(metadataPath, `unknown photo field "${key}".`);
      for (const key of ['alt', 'caption']) if (item[key] !== undefined) text(item[key], metadataPath + '.photos.' + name + '.' + key);
    }
    const gallery: PortfolioImage[] = [];
    const { default: sharp } = await import('sharp');
    for (const [index, name] of ordered.entries()) {
      const path = join(folder, name);
      const size = lstatSync(path).size;
      if (size > 100 * 1024 * 1024) fail(path, 'larger than 100 MB. Export a smaller web copy; keep the original outside public.');
      if (size > 12 * 1024 * 1024) warnings.push(`Large photograph ${path}: ${(size / 1024 / 1024).toFixed(1)} MB. Previews are optimized, but public originals are still copied into dist.`);
      try {
        const input = readFileSync(path);
        const digest = createHash('sha256').update(input).update('webp-82-960-1920-v1').digest('hex').slice(0, 24);
        const info = await sharp(input, { limitInputPixels: 80_000_000 }).metadata();
        if (!['jpeg', 'png', 'webp', 'heif'].includes(info.format || '') || (info.format === 'heif' && info.compression !== 'av1')) fail(path, 'supported photo formats are JPEG, PNG, WebP and AVIF.');
        if (!info.width || !info.height || (info.pages || 1) > 1) fail(path, 'use a still photograph, not an animated/multipage image.');
        const rotated = info.orientation && info.orientation >= 5;
        const width = rotated ? info.height : info.width, height = rotated ? info.width : info.height;
        mkdirSync(cacheRoot, { recursive: true });
        for (const edge of [960, 1920]) {
          const file = `${digest}-${edge}.webp`;
          const cached = join(cacheRoot, file);
          if (!existsSync(cached)) await sharp(input, { limitInputPixels: 80_000_000 }).autoOrient().resize(edge, edge, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(cached);
          assets.set('media/' + file, cached);
        }
        const details = (perPhoto[name] || {}) as { alt?: string; caption?: string };
        gallery.push({
          src: 'sessions/' + [entry.name, name].map(encodeURIComponent).join('/'),
          alt: details.alt || `${title} — photograph ${index + 1}.`,
          ...(details.caption ? { caption: details.caption } : {}),
          width, height,
          thumbnail: `media/${digest}-960.webp`, display: `media/${digest}-1920.webp`,
        });
      } catch (error) { fail(path, `cannot decode photograph (80 megapixel limit). Export a valid JPG/WebP copy. ${(error as Error).message}`); }
    }
    const coverName = meta.cover as string | undefined || photos.find(name => /^cover\.(jpe?g|png|webp|avif)$/i.test(name)) || ordered[0];
    if (!photos.includes(coverName)) fail(metadataPath, `cover "${coverName}" must be an exact filename in this folder.`);
    const summary = meta.summary as string | undefined || `${gallery.length} ${gallery.length === 1 ? 'photograph' : 'photographs'}.`;
    const description = meta.description === undefined ? [summary] : typeof meta.description === 'string' ? [text(meta.description, metadataPath + '.description')] : meta.description;
    if (!Array.isArray(description) || !description.length) fail(metadataPath, 'description must be text or a non-empty array of paragraphs.');
    description.forEach((paragraph, index) => text(paragraph, metadataPath + '.description[' + index + ']'));
    sessions.push({
      project: { slug, title, summary, description: description as string[], gallery, cover: gallery[ordered.indexOf(coverName)], ...(meta.category ? { category: meta.category as string } : {}), ...(meta.date ? { date: meta.date as string, year: (meta.date as string).slice(0, 4) } : {}) },
      order: meta.order as number | undefined ?? 0, featured: meta.featured as boolean | undefined ?? false, folder: entry.name,
    });
  }
  sessions.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || compare(a.folder, b.folder));
  const slugs = new Set<string>();
  for (const { project } of sessions) {
    if (slugs.has(project.slug)) fail(root, `duplicate slug "${project.slug}". Give each session a unique slug in session.json.`);
    slugs.add(project.slug);
  }
  return { projects: sessions.map(item => item.project), assets, warnings };
}

export const sessionsPath = (projectRoot: string) => resolve(projectRoot, 'public/sessions');
