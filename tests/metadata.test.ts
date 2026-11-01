import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parsePortfolio } from '../src/content/schema.ts';
import { metadata } from '../scripts/metadata.ts';

const sample = JSON.parse(readFileSync(new URL('../src/content/portfolio.json', import.meta.url), 'utf8'));

test('metadata has no invented domain or personal external dependency', () => {
  const tags = metadata(parsePortfolio(sample), './');
  assert.ok(tags.some(tag => tag.tag === 'title'));
  assert.ok(tags.some(tag => tag.attrs?.rel === 'icon' && tag.attrs.href === './images/favicon.svg'));
  assert.ok(!tags.some(tag => tag.attrs?.rel === 'canonical' || tag.attrs?.property === 'og:url' || tag.attrs?.property === 'og:image'));
});

test('configured site URL produces absolute sharing URLs including subdirectory', () => {
  const config = structuredClone(sample);
  config.seo.siteUrl = 'https://example.com/portfolio';
  const tags = metadata(parsePortfolio(config), './');
  assert.equal(tags.find(tag => tag.attrs?.rel === 'canonical')?.attrs?.href, 'https://example.com/portfolio/');
  assert.equal(tags.find(tag => tag.attrs?.property === 'og:image')?.attrs?.content, 'https://example.com/portfolio/images/share.svg');
});

test('user metadata is escaped before entering static HTML', () => {
  const config = structuredClone(sample);
  config.seo.title = '</title><script>alert("x")</script>';
  config.seo.description = 'Design "A" & <B>';
  const tags = metadata(parsePortfolio(config), './');
  assert.equal(tags.find(tag => tag.tag === 'title')?.children, '&lt;/title&gt;&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  assert.equal(tags.find(tag => tag.attrs?.name === 'description')?.attrs?.content, 'Design &quot;A&quot; &amp; &lt;B&gt;');
});
