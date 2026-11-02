import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, symlinkSync, truncateSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { discoverSessions } from '../scripts/sessions.ts';
import { loadPortfolio } from '../scripts/load-portfolio.ts';
import { parsePortfolio } from '../src/content/schema.ts';

const sample = JSON.parse(readFileSync(new URL('./fixtures/portfolio.json', import.meta.url), 'utf8'));
const pixel = await sharp({ create: { width: 60, height: 90, channels: 3, background: '#91887c' } }).jpeg().toBuffer();

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-sessions-'));
  assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep));
  const publicRoot = join(root, 'public'), cache = join(root, 'cache');
  mkdirSync(join(publicRoot, 'sessions'), { recursive: true });
  const photo = (folder: string, file: string, buffer = pixel) => {
    const path = join(publicRoot, 'sessions', folder);
    mkdirSync(path, { recursive: true }); writeFileSync(join(path, file), buffer);
  };
  const meta = (folder: string, value: unknown) => writeFileSync(join(publicRoot, 'sessions', folder, 'session.json'), JSON.stringify(value));
  return { root, publicRoot, cache, photo, meta, scan: () => discoverSessions(publicRoot, cache), clean: () => rmSync(root, { recursive: true, force: true }) };
}

test('sessions: absent root, zero sessions and empty folders are safe and explicit', async () => {
  const f = fixture();
  try {
    assert.deepEqual((await f.scan()).projects, []);
    mkdirSync(join(f.publicRoot, 'sessions/empty'));
    assert.match((await f.scan()).warnings.join(' '), /Empty session/);
    rmSync(join(f.publicRoot, 'sessions'), { recursive: true });
    assert.deepEqual((await f.scan()).projects, []);
  } finally { f.clean(); }
});

test('sessions: one portrait has honest defaults, stable dimensions and optimized copies', async () => {
  const f = fixture();
  try {
    f.photo('new-session', 'DSC_0001.JPG');
    const before = readFileSync(join(f.publicRoot, 'sessions/new-session/DSC_0001.JPG'));
    const result = await f.scan(), p = result.projects[0];
    assert.equal(p.title, 'New session'); assert.equal(p.slug, 'new-session');
    assert.equal(p.summary, '1 photograph.'); assert.equal(p.gallery.length, 1);
    assert.equal(p.gallery[0].width, 60); assert.equal(p.gallery[0].height, 90);
    assert.equal(p.gallery[0].alt, 'New session — photograph 1.');
    assert.equal(p.cover.src, p.gallery[0].src); assert.equal(result.assets.size, 2);
    assert.deepEqual(readFileSync(join(f.publicRoot, 'sessions/new-session/DSC_0001.JPG')), before);
    for (const path of result.assets.values()) {
      const info = await sharp(readFileSync(path)).metadata(); assert.equal(info.format, 'webp'); assert.equal(info.width, 60);
    }
    assert.deepEqual((await f.scan()).projects, result.projects);
  } finally { f.clean(); }
});

test('sessions: natural order, Unicode/spaces/camera case, cover-name precedence and partial manual order', async () => {
  const f = fixture();
  try {
    for (const name of ['10.JPG', '2.jpeg', '1.jpg', 'Retrato final frío.webp', 'cover.PNG']) f.photo('sesión-playa', name);
    let p = (await f.scan()).projects[0];
    assert.equal(p.slug, 'sesion-playa');
    assert.deepEqual(p.gallery.slice(0, 3).map(x => decodeURIComponent(x.src.split('/').at(-1)!)), ['1.jpg', '2.jpeg', '10.JPG']);
    assert.match(p.cover.src, /cover.PNG$/);
    assert.ok(p.gallery.some(x => x.src.includes('Retrato%20final%20fr%C3%ADo.webp')));
    f.meta('sesión-playa', { cover: '2.jpeg', imageOrder: ['10.JPG', '1.jpg'] });
    p = (await f.scan()).projects[0];
    assert.match(p.cover.src, /2.jpeg$/); assert.match(p.gallery[0].src, /10.JPG$/);
    assert.match(p.gallery[1].src, /1.jpg$/);
  } finally { f.clean(); }
});

test('sessions: full optional metadata and deterministic session priority', async () => {
  const f = fixture();
  try {
    for (const folder of ['session-10', 'session-2', 'session-1']) f.photo(folder, 'one.jpg');
    f.meta('session-10', { title: 'A title', slug: 'custom-slug', summary: 'A summary.', description: ['First.', 'Second.'], category: 'Personal', date: '2024-02-29', order: 9, featured: true, photos: { 'one.jpg': { alt: 'A meaningful description', caption: 'A caption' } } });
    f.meta('session-2', { order: -1, description: 'One paragraph.' });
    const projects = (await f.scan()).projects;
    assert.deepEqual(projects.map(p => p.slug), ['custom-slug', 'session-2', 'session-1']);
    assert.equal(projects[0].date, '2024-02-29'); assert.equal(projects[0].year, '2024'); assert.equal(projects[0].category, 'Personal');
    assert.equal(projects[0].gallery[0].caption, 'A caption');
    assert.equal(projects[0].cover.alt, 'A meaningful description'); assert.equal(projects[0].description.length, 2);
  } finally { f.clean(); }
});

for (const [name, metadata, error] of [
  ['invalid slug', { slug: '../escape' }, /lowercase slug/],
  ['unknown key', { titlle: 'Typo' }, /unknown field/],
  ['cover traversal', { cover: '../one.jpg' }, /exact filename/],
  ['missing cover', { cover: 'missing.jpg' }, /exact filename/],
  ['wrong case', { cover: 'ONE.jpg' }, /exact filename/],
  ['duplicate image order', { imageOrder: ['one.jpg', 'one.jpg'] }, /unique, exact/],
  ['missing image order', { imageOrder: ['missing.jpg'] }, /unique, exact/],
  ['missing photo metadata', { photos: { 'other.jpg': { alt: 'Other' } } }, /missing filename/],
  ['invalid caption', { photos: { 'one.jpg': { caption: '' } } }, /non-empty text/],
  ['invalid date', { date: '2025-02-29' }, /real YYYY-MM-DD/],
  ['invalid month', { date: '2025-99-99' }, /real YYYY-MM-DD/],
  ['invalid feature', { featured: 'yes' }, /true or false/],
] as const) test('sessions rejects ' + name, async () => {
  const f = fixture();
  try { f.photo('sample', 'one.jpg'); f.meta('sample', metadata); await assert.rejects(f.scan(), error); }
  finally { f.clean(); }
});

test('sessions: malformed JSON, duplicate slugs, broken photos and unsupported files are explained', async () => {
  const f = fixture();
  try {
    f.photo('first', 'one.jpg');
    writeFileSync(join(f.publicRoot, 'sessions/first/session.json'), '{');
    await assert.rejects(f.scan(), /invalid JSON/); unlinkSync(join(f.publicRoot, 'sessions/first/session.json'));
    f.photo('second', 'one.jpg'); f.meta('second', { slug: 'first' });
    await assert.rejects(f.scan(), /duplicate slug/);
    f.meta('second', {}); f.photo('second', 'broken.JPG', Buffer.from('not a photograph'));
    await assert.rejects(f.scan(), /cannot decode photograph/); unlinkSync(join(f.publicRoot, 'sessions/second/broken.JPG'));
    f.photo('second', 'camera.NEF', Buffer.from('raw'));
    assert.match((await f.scan()).warnings.join(' '), /convert RAW\/HEIC/);
  } finally { f.clean(); }
});

test('sessions: replace, rename and delete never retain stale photos or previews', async () => {
  const f = fixture();
  try {
    f.photo('one', '1.jpg');
    const first = (await f.scan()).projects[0].cover;
    const replacement = await sharp({ create: { width: 100, height: 50, channels: 3, background: '#264f61' } }).jpeg().toBuffer();
    f.photo('one', '1.jpg', replacement);
    const next = (await f.scan()).projects[0].cover;
    assert.notEqual(first.thumbnail, next.thumbnail); assert.equal(next.width, 100);
    renameSync(join(f.publicRoot, 'sessions/one'), join(f.publicRoot, 'sessions/renamed'));
    assert.equal((await f.scan()).projects[0].slug, 'renamed');
    unlinkSync(join(f.publicRoot, 'sessions/renamed/1.jpg'));
    const empty = await f.scan(); assert.equal(empty.projects.length, 0); assert.equal(empty.assets.size, 0);
  } finally { f.clean(); }
});

test('sessions: dozens of photographs stay deterministic without mandatory metadata', async () => {
  const f = fixture();
  try {
    for (let i = 30; i > 0; i--) f.photo('many', i + '.jpg');
    const p = (await f.scan()).projects[0];
    assert.equal(p.gallery.length, 30); assert.match(p.gallery[1].src, /2.jpg$/); assert.match(p.gallery[29].src, /30.jpg$/);
    assert.equal(p.year, undefined); assert.equal(p.category, undefined);
  } finally { f.clean(); }
});

test('schema rejects encoded session traversal, separators and invalid dimensions', () => {
  for (const path of ['sessions/a/%2e%2e', 'sessions/a/%2fetc.jpg', 'sessions/a/%5cfile.jpg', 'sessions/a/%00.jpg', 'sessions/a/%zz.jpg', 'sessions/a/file#photo.jpg', 'sessions/a/file?photo.jpg']) {
    const config = structuredClone(sample); config.projects[0].cover.src = path; assert.throws(() => parsePortfolio(config), /session|encoding/);
  }
  const config = structuredClone(sample); config.projects[0].cover.width = -2; config.projects[0].cover.height = 60;
  assert.throws(() => parsePortfolio(config), /positive image dimension/);
});

test('manual projects and discovered sessions cannot silently share a slug', async () => {
  const f = fixture();
  try {
    mkdirSync(join(f.root, 'src/content'), { recursive: true });
    writeFileSync(join(f.root, 'src/content/portfolio.json'), JSON.stringify(sample));
    f.photo('field-notes', 'one.jpg');
    await assert.rejects(loadPortfolio(f.root), /Session slug collision.*field-notes/);
  } finally { f.clean(); }
});

test('sessions: EXIF orientation is applied to dimensions/previews without changing originals', async () => {
  const f = fixture();
  try {
    const rotated = await sharp({ create: { width: 90, height: 60, channels: 3, background: '#465a60' } }).withMetadata({ orientation: 6 }).jpeg().toBuffer();
    f.photo('rotation', 'camera.JPG', rotated);
    const p = (await f.scan()).projects[0].cover;
    assert.equal(p.width, 60); assert.equal(p.height, 90);
    assert.deepEqual(readFileSync(join(f.publicRoot, 'sessions/rotation/camera.JPG')), rotated);
  } finally { f.clean(); }
});

test('sessions: symlink folders cannot read photographs outside the sessions root', async () => {
  const f = fixture();
  try {
    const outside = join(f.root, 'outside'); mkdirSync(outside);
    writeFileSync(join(outside, 'photo.jpg'), pixel);
    symlinkSync(outside, join(f.publicRoot, 'sessions/linked'), 'junction');
    await assert.rejects(f.scan(), /symbolic links/);
  } finally { f.clean(); }
});

test('sessions: oversized byte and pixel inputs fail before decoding; large valid files warn', async () => {
  const f = fixture();
  try {
    f.photo('large', 'one.jpg', Buffer.concat([pixel, Buffer.alloc(12 * 1024 * 1024)]));
    assert.match((await f.scan()).warnings.join(' '), /Large photograph.*originals are still copied/);
    const path = join(f.publicRoot, 'sessions/large/one.jpg');
    truncateSync(path, 100 * 1024 * 1024 + 1);
    await assert.rejects(f.scan(), /larger than 100 MB/);
    const header = Buffer.from(pixel), marker = header.indexOf(Buffer.from([255, 192]));
    assert.ok(marker > 0); header.writeUInt16BE(10000, marker + 5); header.writeUInt16BE(10000, marker + 7);
    writeFileSync(path, header);
    await assert.rejects(f.scan(), /80 megapixel limit/);
  } finally { f.clean(); }
});

test('sessions: actual PNG, WebP and AVIF decode, while disguised SVG is rejected', async () => {
  const f = fixture();
  try {
    f.photo('formats', '1.png', await sharp(pixel).png().toBuffer());
    f.photo('formats', '2.webp', await sharp(pixel).webp().toBuffer());
    f.photo('formats', '3.avif', await sharp(pixel).avif().toBuffer());
    assert.equal((await f.scan()).projects[0].gallery.length, 3);
    f.photo('formats', '4.JPG', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'));
    await assert.rejects(f.scan(), /supported photo formats/);
  } finally { f.clean(); }
});

test('owner asset references also reject symbolic links instead of following them', async () => {
  const f = fixture();
  try {
    const config = structuredClone(sample); config.projects = [];
    mkdirSync(join(f.root, 'src/content'), { recursive: true });
    writeFileSync(join(f.root, 'src/content/portfolio.json'), JSON.stringify(config));
    const outside = join(f.root, 'outside'); mkdirSync(outside);
    writeFileSync(join(outside, 'favicon.svg'), '<svg/>');
    writeFileSync(join(outside, 'share.png'), 'placeholder');
    symlinkSync(outside, join(f.publicRoot, 'images'), 'junction');
    await assert.rejects(loadPortfolio(f.root), /Symbolic links/);
  } finally { f.clean(); }
});
