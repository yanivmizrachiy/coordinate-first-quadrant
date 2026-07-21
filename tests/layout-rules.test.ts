import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
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
    expect(height('grid-hero')).toBeGreaterThanOrEqual(390); // still ~2x a normal grid
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

describe('completions ask for something different each time', () => {
  /* Yaniv's rule (USER_MEMORY §8): "בכל השלמה חסר רכיב מסוג אחר".
     It was written down for a long time and still got broken, because nothing
     checked it — a sheet can pass every other test while asking the learner
     the very same thing four times. Tagged blanks make it checkable. */
  const cards = (html: string): string[] =>
    html.split('<section class="q-card">').slice(1).concat(html.includes('rule-box') ? [html] : []);

  it('no group of completions asks for the same kind three times running', () => {
    for (const page of WORKBOOK) {
      for (const card of cards(page.html)) {
        const kinds = [...card.matchAll(/data-missing="(\w+)"/g)].map((m) => m[1]);
        if (kinds.length < 3) continue;
        const distinct = new Set(kinds);
        expect(
          distinct.size,
          `page ${page.n}: ${kinds.length} completions all ask for "${kinds[0]}"`,
        ).toBeGreaterThan(1);
      }
    }
  });

  it('the opening sheet tags every blank, so the variety rule can see them', () => {
    const first = pageByNumber(1)!.html;
    const blanks = (first.match(/class="(blank|word-blank[^"]*)"/g) ?? []).length;
    const tagged = (first.match(/data-missing=/g) ?? []).length;
    expect(tagged, 'untagged blanks on page 1').toBe(blanks);
  });

  it('a two-word answer gets two boxes — in the text AND on the drawing', () => {
    // „ראשית הצירים” is two words, so it is never one long line, and never a
    // single box on the drawing either.
    const first = pageByNumber(1)!.html;
    const concept = (first.match(/data-missing="concept"/g) ?? []).length;
    expect(concept, 'ראשית הצירים needs two boxes in the sentence').toBeGreaterThanOrEqual(2);
    expect(first, 'ראשית הצירים needs two boxes on the drawing').toContain('data-originname="true"');
  });

  it('numbers are digits and fractions, the way a textbook sets them', () => {
    const text = pageByNumber(1)!.html.replace(/<[^>]+>/g, ' ');
    for (const spelled of ['שלוש וחצי', 'חמש וחצי', 'שתיים וחצי', 'שבע וחצי']) {
      expect(text, `spelled-out number "${spelled}"`).not.toContain(spelled);
    }
    expect(text, 'decimal point instead of a fraction').not.toMatch(/\d\.\d/);
    expect(pageByNumber(1)!.html, 'no stacked fraction').toContain('frac__d');
  });

  it('a position is "ממוקם", never "נמצא" — on every page, not just page 1', () => {
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ');
      expect(text, `page ${p.n} says נמצא`).not.toMatch(/נמצא/);
    }
    expect(pageByNumber(1)!.html).toContain('ממוקם');
  });

  it('a fill-in task offers a word bank instead of a paragraph of directions', () => {
    const first = pageByNumber(1)!.html;
    expect(first, 'no מחסן מילים').toContain('word-bank');
    for (const word of ['ציר x', 'ציר y', 'ראשית', 'הצירים']) {
      expect(first, `word bank missing "${word}"`).toContain(`word-bank__item">${word}<`);
    }
  });
});

describe('pages stay easy to edit', () => {
  const dir = new URL('../src/data/workbook/pages/', import.meta.url);
  const files = readdirSync(dir).filter((f) => f !== 'index.ts');

  it('every worksheet is its own file, named for what it teaches', () => {
    expect(files.length).toBeGreaterThan(25);
    for (const f of files) expect(f, f).toMatch(/^[a-z][a-z-]+\.ts$/);
  });

  it('no page file re-declares the wrapper the authoring layer owns', () => {
    // A hand-written header or footer is how a sheet ends up without the
    // canonical footer, or with a page number baked into the markup.
    for (const f of files) {
      const src = readFileSync(new URL(f, dir), 'utf8');
      expect(src, `${f} builds its own header`).not.toContain('sheet-header');
      expect(src, `${f} builds its own footer`).not.toContain('gz-footer');
      expect(src, `${f} hardcodes a page number`).not.toMatch(/id="page-\d/);
    }
  });

  it('page text is plain HTML — no escaped quotes to fight with', () => {
    for (const f of files) {
      const src = readFileSync(new URL(f, dir), 'utf8');
      expect(src, `${f} still has &quot;`).not.toContain('&quot;');
      expect(src, `${f} still has escaped quotes`).not.toContain('\\"');
    }
  });
});

describe('the booklet opens the way Yaniv asked', () => {
  it('page 1 is the half-page coordinate system, and asks the learner to write', () => {
    const first = pageByNumber(1)!;
    expect(first.html).toContain('grid-hero');
    expect(first.html).toMatch(/word-blank|class="blank"/);
  });

  it('page 1 asks about identification only — never the ordered pair', () => {
    // You cannot write an ordered pair before you know what each axis is
    // called, so page 1 names the axes and nothing else.
    const first = pageByNumber(1)!;
    const text = first.html.replace(/<[^>]+>/g, ' ');
    expect(first.html, 'ordered-pair boxes').not.toContain('pair-blank');
    expect(text, 'the words זוג סדור').not.toContain('זוג סדור');
    expect(text, 'the word שיעור').not.toContain('שיעור');
    expect(text, '(x,y) notation').not.toMatch(/\(\s*[\dxy]\s*,/);
    // and the drawing must not hand over the answer
    expect(first.html, 'axis names given away').toContain('data-axisnames="false"');
  });

  it('every sheet keeps the 13px body size', () => {
    expect(css).toContain('font-size: 13px;');
    for (const p of WORKBOOK) {
      expect(p.html.includes('font-size:1'), `page ${p.n} inline font-size`).toBe(false);
    }
  });
});
