import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SOLUTION_PAGES, SOLUTION_SPECS } from '../src/data/solutions';
import { WORKBOOK } from '../src/data/workbook';

function gitBlobSha(path: string): string {
  const bytes = readFileSync(path);
  const header = Buffer.from(`blob ${bytes.byteLength}\0`, 'utf8');
  return createHash('sha1').update(header).update(bytes).digest('hex');
}

describe('dynamic solutions', () => {
  it('covers every canonical workbook page exactly once', () => {
    expect(SOLUTION_SPECS).toHaveLength(WORKBOOK.length);
    expect(new Set(SOLUTION_SPECS.map((spec) => spec.source)).size).toBe(WORKBOOK.length);
  });

  it('resolves every solution from the canonical WORKBOOK instead of a stored page number', () => {
    for (const entry of SOLUTION_PAGES) {
      expect(WORKBOOK.includes(entry.page)).toBe(true);
      expect(entry.topic.pages).toContain(entry.page.n);
    }
  });

  it('prints the solution booklet in canonical page order 1 through 78', () => {
    expect(SOLUTION_PAGES.map((entry) => entry.page.n)).toEqual(
      Array.from({ length: WORKBOOK.length }, (_, index) => index + 1),
    );
  });

  it('has no duplicate page sources or exercise ids', () => {
    expect(new Set(SOLUTION_SPECS.map((spec) => spec.source)).size).toBe(SOLUTION_SPECS.length);
    for (const spec of SOLUTION_SPECS) {
      const ids = spec.exercises.map((exercise) => exercise.id);
      expect(new Set(ids).size, spec.sourceFile).toBe(ids.length);
      expect(ids.every(Boolean), spec.sourceFile).toBe(true);
    }
  });

  it('fails when a solved worksheet source or visible poster asset changes without re-verifying its answers', () => {
    for (const spec of SOLUTION_SPECS) {
      expect(gitBlobSha(spec.sourceFile), spec.sourceFile).toBe(spec.sourceBlobSha);
      for (const asset of spec.sourceAssets ?? []) {
        expect(gitBlobSha(asset.path), asset.path).toBe(asset.blobSha);
      }
    }
  });

  it('never publishes an empty answer', () => {
    for (const spec of SOLUTION_SPECS) {
      for (const exercise of spec.exercises) {
        expect(exercise.answer.trim().length, `${spec.sourceFile}#${exercise.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps exactly one visible heading per solution page', () => {
    const view = readFileSync('src/views/solutions.ts', 'utf8');
    expect(view).toContain('text: `תשובות לעמוד ${entry.page.n}`');
    expect((view.match(/elem\('h2'/g) ?? [])).toHaveLength(1);
    expect(view).not.toContain("elem('h1'");
    expect(view).not.toContain("elem('h3'");
    expect(view).not.toContain('solutions__topic');
    expect(view).not.toContain('solutions__page-number');
    expect(view).not.toContain('solutions__page-title');
    expect(view).not.toContain('solutions__page-chapter');
  });

  it('keeps the solutions booklet print-only and non-interactive', () => {
    const view = readFileSync('src/views/solutions.ts', 'utf8');
    const css = readFileSync('src/styles/solutions.css', 'utf8');

    expect(view).not.toContain("elem('button'");
    expect(view).not.toContain("elem('input'");
    expect(view).not.toContain("elem('select'");
    expect(view).not.toContain("elem('a'");
    expect(view).not.toContain('navigate(');
    expect(view).not.toContain('addEventListener');
    expect(view).not.toContain('solutions__tools');
    expect(view).not.toContain('solutions__search');
    expect(view).not.toContain('solutions__select');
    expect(view).not.toContain('solutions__open-page');

    expect(css).toContain('@page');
    expect(css).toContain('size: A4 portrait');
    expect(css).toContain('width: 210mm');
    expect(css).toContain('min-height: 297mm');
    expect(css).toContain('break-after: page');
    expect(css).not.toContain('solutions__tools');
    expect(css).not.toContain('solutions__search');
    expect(css).not.toContain('solutions__select');
    expect(css).not.toContain('solutions__open-page');
  });

  it('publishes the external solutions entry as PDF only', () => {
    const external = readFileSync('public/solutions/index.html', 'utf8');
    const builder = readFileSync('scripts/build-solutions-pdf.mjs', 'utf8');
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };

    expect(external).toContain('../solutions.pdf');
    expect(external).not.toContain('<iframe');
    expect(external).not.toContain('#/solutions');
    expect(builder).toContain("path: 'public/solutions.pdf'");
    expect(builder).toContain('EXPECTED_PAGES = 78');
    expect(pkg.scripts['solutions:pdf']).toBe('node scripts/build-solutions-pdf.mjs');
  });
});
