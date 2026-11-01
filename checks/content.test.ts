import {mkdtempSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portfolio, projectCover } from '../src/content/portfolio.ts';
import { validatePortfolio } from '../src/content/validation.ts';
import { pageMetadata, publicOrigin } from '../src/content/metadata.ts';
test('published catalog is valid without invented dimensions', () =>
  assert.deepEqual(validatePortfolio(portfolio), []));
test('invalid slugs, dimensions and unsafe media cannot pass a build', () => {
  const copy = structuredClone(portfolio);
  copy.projects[0].slug = '../escape';
  copy.projects[0].images[0].src = 'javascript:alert(1)';
  copy.projects[0].images[0].width = -1;
  assert.equal(validatePortfolio(copy).length, 3);
});
test('duplicate photos and invalid cover selections are rejected', () => {
  const copy = structuredClone(portfolio);
  copy.projects[0].images.push(copy.projects[0].images[0]);
  copy.projects[0].coverId = 'missing';
  assert.equal(validatePortfolio(copy).length, 2);
});
test('cover selection does not change gallery order', () => {
  const project = {
    ...portfolio.projects[0],
    images: [
      ...portfolio.projects[0].images,
      { ...portfolio.projects[0].images[0], id: 'second' },
    ],
    coverId: 'second',
  };
  assert.equal(projectCover(project)?.id, 'second');
  assert.notEqual(project.images[0].id, 'second');
});
test('project sharing metadata is specific and canonical URLs require a real configured origin', () => {
  const meta = pageMetadata('/projects/devon-x-chriz');
  assert.equal(meta.title, 'DEVON X CHRIZ — CHRIZ');
  assert.equal(meta.image, portfolio.projects[0].images[0].src);
  assert.equal(meta.canonical, undefined);
  assert.equal(
    pageMetadata('/portfolio/', 'https://portfolio.example').canonical,
    'https://portfolio.example/portfolio',
  );
  assert.equal(
    pageMetadata('/missing', 'https://portfolio.example').robots,
    'noindex,follow',
  );
  assert.throws(() => publicOrigin('https://secret@portfolio.example/path'));
});

test('configured-origin build produces canonical metadata, sitemap, robots and per-route redirects', () => {
 const output = mkdtempSync(join(tmpdir(), 'chriz-site-check-'));
 try {
  writeFileSync(join(output,'index.html'), '<html><head><title>Template</title></head><body></body></html>');
  const run = spawnSync(process.execPath, ['--experimental-strip-types','scripts/prepare-site.ts','https://portfolio.example',output], {encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);
  assert.match(readFileSync(join(output,'projects/devon-x-chriz/index.html'),'utf8'), /rel="canonical" href="https:\/\/portfolio.example\/projects\/devon-x-chriz"/);
  assert.equal((readFileSync(join(output,'sitemap.xml'),'utf8').match(/<url>/g)||[]).length,7);
  assert.match(readFileSync(join(output,'robots.txt'),'utf8'), /Sitemap: https:\/\/portfolio.example\/sitemap.xml/);
  assert.match(readFileSync(join(output,'404.html'),'utf8'), /noindex,follow/);
  assert.ok(readFileSync(join(output,'_redirects'),'utf8').startsWith('/portfolio /portfolio/index.html 200'));
 } finally { rmSync(output,{recursive:true,force:true}); }
});
