import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { parsePortfolio, portfolioImages } from '../src/content/schema.ts';

test('content command checks real files and fails clearly for a missing asset', () => {
  const folder = mkdtempSync(join(tmpdir(), 'portfolio-assets-test-'));
  assert.ok(resolve(folder).startsWith(resolve(tmpdir()) + sep));
  try {
    for (const path of ['scripts', 'src/content', 'public/images']) mkdirSync(join(folder, path), { recursive: true });
    writeFileSync(join(folder, 'package.json'), '{"type":"module"}');
    for (const path of ['scripts/validate-content.ts', 'scripts/load-portfolio.ts', 'scripts/sessions.ts', 'src/content/schema.ts']) {
      copyFileSync(new URL(`../${path}`, import.meta.url), join(folder, path));
    }
    copyFileSync(new URL('./fixtures/portfolio.json', import.meta.url), join(folder, 'src/content/portfolio.json'));
    const config = parsePortfolio(JSON.parse(readFileSync(join(folder, 'src/content/portfolio.json'), 'utf8')));
    for (const path of portfolioImages(config)) writeFileSync(join(folder, 'public', path), '<svg xmlns="http://www.w3.org/2000/svg"/>');
    const run = () => spawnSync(process.execPath, ['--experimental-strip-types', join(folder, 'scripts/validate-content.ts')], { encoding: 'utf8' });
    const valid = run();
    assert.equal(valid.status, 0, valid.stderr);
    assert.match(valid.stdout, /Portfolio valid: 3 projects, 8 local image assets/);
    config.projects[0].cover.src = 'images/Field-Cover.svg';
    writeFileSync(join(folder, 'src/content/portfolio.json'), JSON.stringify(config));
    const wrongCase = run();
    assert.notEqual(wrongCase.status, 0);
    assert.match(wrongCase.stderr, /Check filename case/);
    config.projects[0].cover.src = 'images/field-cover.svg';
    writeFileSync(join(folder, 'src/content/portfolio.json'), JSON.stringify(config));
    unlinkSync(join(folder, 'public/images/field-cover.svg'));
    const invalid = run();
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /Missing portfolio image: images\/field-cover.svg/);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
