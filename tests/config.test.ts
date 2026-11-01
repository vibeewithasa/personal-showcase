import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { contrast, parsePortfolio, portfolioImages } from '../src/content/schema.ts';

const sample = JSON.parse(readFileSync(new URL('../src/content/portfolio.json', import.meta.url), 'utf8'));

test('complete demo and all documented optional sections validate', () => {
  const config = parsePortfolio(structuredClone(sample));
  assert.equal(config.projects.length, 3);
  assert.equal(new Set(portfolioImages(config)).size, 8);
});

test('minimal configuration supports zero projects, no about, no contact methods', () => {
  const config = structuredClone(sample);
  delete config.about;
  config.projects = [];
  config.contact = { links: [] };
  config.identity = { name: 'A', role: 'Artist', intro: 'Independent artist.' };
  assert.equal(parsePortfolio(config).projects.length, 0);
});

test('single project, optional identity assets, and configured contact validate', () => {
  const config = structuredClone(sample);
  config.demo = false;
  config.projects = [config.projects[0]];
  config.projects[0].gallery = [];
  config.identity.logo = config.projects[0].cover;
  config.identity.portrait = config.projects[0].cover;
  config.contact = { email: 'artist@example.com', phone: '+1 (555) 123-4567', links: [{ label: 'Website', url: 'https://example.com' }] };
  config.seo.siteUrl = 'https://example.com/portfolio/';
  assert.equal(parsePortfolio(config).projects.length, 1);
});

const invalid: [string, (config: typeof sample) => void, RegExp][] = [
  ['missing identity', c => { delete c.identity; }, /identity/],
  ['blank name', c => { c.identity.name = ' '; }, /identity.name/],
  ['missing demo flag', c => { delete c.demo; }, /demo/],
  ['missing projects', c => { delete c.projects; }, /projects/],
  ['duplicate slug', c => { c.projects.push(c.projects[0]); }, /slug/],
  ['invalid slug', c => { c.projects[0].slug = '../bad'; }, /slug/],
  ['unsafe external link', c => { c.contact.links = [{ label: 'Bad', url: 'javascript:alert(1)' }]; }, /HTTPS/],
  ['HTTP external link', c => { c.projects[0].url = 'http://example.com'; }, /HTTPS/],
  ['incomplete HTTPS URL', c => { c.projects[0].url = 'https:example.com'; }, /HTTPS/],
  ['credential in URL', c => { c.seo.siteUrl = 'https://user:secret@example.com'; }, /credentials/],
  ['hash in site URL', c => { c.seo.siteUrl = 'https://example.com/#work'; }, /query or hash/],
  ['invalid email', c => { c.contact.email = 'not-an-email'; }, /email/],
  ['email header injection', c => { c.contact.email = 'a@example.com?subject=bad'; }, /email/],
  ['encoded email header injection', c => { c.contact.email = 'a@example.com%0d%0aBcc:other@example.com'; }, /email/],
  ['invalid phone', c => { c.contact.phone = '555\n1234'; }, /phone/],
  ['phone without digits', c => { c.contact.phone = '-----'; }, /phone/],
  ['remote image', c => { c.projects[0].cover.src = 'https://example.com/a.jpg'; }, /local path/],
  ['image traversal', c => { c.projects[0].cover.src = 'images/../secret.png'; }, /local path/],
  ['encoded traversal', c => { c.projects[0].cover.src = 'images/%2e%2e/secret.png'; }, /local path/],
  ['empty alt', c => { c.projects[0].cover.alt = ''; }, /alt/],
  ['missing paragraph', c => { c.projects[0].description = []; }, /paragraph/],
  ['invalid theme colour', c => { c.theme.accent = 'red'; }, /hex/],
  ['poor text contrast', c => { c.theme.text = c.theme.background; }, /contrast/],
];
for (const [name, change, error] of invalid) {
  test(`rejects ${name} with an actionable error`, () => {
    const config = structuredClone(sample);
    change(config);
    assert.throws(() => parsePortfolio(config), error);
  });
}

test('contrast uses WCAG relative luminance', () => {
  assert.equal(contrast('#000000', '#ffffff'), 21);
  assert.equal(contrast('#ffffff', '#ffffff'), 1);
});
