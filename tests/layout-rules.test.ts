import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { WORKBOOK, pageByNumber } from '../src/data/workbook';

/* Yaniv's standing layout rules, as executable checks. Each one here is a bug
   that already reached a printed sheet once — the test is what stops it from
   coming back the next time a page is edited. */

const css = readFileSync(new URL('../src/styles/workbook.css', import.meta.url), 'utf8');
const grid = readFileSync(new URL('../src/lib/coordinateGrid.ts', import.meta.url), 'utf8');

describe('drawings stay big and readable', () => {
  it('a row that holds a coordinate system is capped at two columns', () => {
    // Three or four systems across a sheet collapse to thumbnails a learner
    // cannot write inside — the SVG keeps its ratio, so width drives height.
    for (const sel of ['.choice-grid', '.cols-3', '.cols-4', '.error-grid']) {
      expect(css, sel).toContain(`${sel}:has(.coordinate-grid)`);
    }
    const cap = css.slice(css.indexOf('.choice-grid:has(.coordinate-grid)'));
    expect(cap.slice(0, 400)).toContain('repeat(2, minmax(0, 1fr))');
  });

  it('the size ladder never drops below what stays legible in print', () => {
    const height = (cls: string): number =>
      Number(new RegExp(`\\.${cls} \\{ height: (\\d+)px`).exec(css)?.[1] ?? 0);
    expect(height('grid-xs')).toBeGreaterThanOrEqual(134);
    expect(height('grid-sm')).toBeGreaterThanOrEqual(165);
    expect(height('grid-md')).toBeGreaterThanOrEqual(210);
    expect(height('grid-hero')).toBeGreaterThanOrEqual(420);
    // and a system may never be rendered as a sliver, whatever the container
    expect(css).toContain('.coordinate-grid { min-height: 150px; }');
  });
});

describe('nothing is silently cut off the page', () => {
  it('game sheets grow instead of clipping their board', () => {
    // `.sheet` is re-declared further down the file; a single-class override
    // loses on source order and the board gets cut mid-question.
    expect(css).toContain('.sheet.game-sheet { height: auto;');
    expect(css).toContain('.sheet.game-sheet .gz-footer');
    expect(css).not.toMatch(/^\.game-sheet \{/m);
  });
});

describe('SVG text survives the RTL sheet', () => {
  it('EVERY label is direction-pinned in one place, not per call site', () => {
    // Pinning each `el('text', …)` by hand is how „ציר y” stayed reversed after
    // „ציר x” was fixed: the next label simply forgot. The helper does it now.
    const helper = grid.slice(grid.indexOf('function el('), grid.indexOf('/** Render'));
    expect(helper).toContain("if (tag === 'text') node.setAttribute('direction', 'ltr')");
  });

  it('an axis number is never left sitting under a point', () => {
    expect(grid).toContain('onXAxis');
    expect(grid).toContain('onYAxis');
  });
});

describe('the booklet opens the way Yaniv asked', () => {
  it('page 1 is the half-page coordinate system', () => {
    const first = pageByNumber(1)!;
    expect(first.html).toContain('grid-hero');
    expect(first.html).toMatch(/pair-blank|word-blank|class="blank"/);
  });

  it('page 1 only asks the learner to READ the drawing, not to mark on it', () => {
    // Marking points is taught later, on its own sheet.
    expect(pageByNumber(1)!.html).not.toContain('סמנו');
  });

  it('every sheet keeps the 13px body size', () => {
    expect(css).toContain('font-size: 13px;');
    for (const p of WORKBOOK) {
      expect(p.html.includes('font-size:1'), `page ${p.n} inline font-size`).toBe(false);
    }
  });
});
