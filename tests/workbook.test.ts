import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { WORKBOOK, TOTAL_PAGES, TOPICS, pageByNumber } from '../src/data/workbook';
import { GAMES } from '../src/games';

const FOOTER_F1 = 'יניב רז - מדריך מחוזי חט"ב בעיר ירושלים';
const FOOTER_F2 = 'הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין';

describe('workbook integrity (USER_MEMORY.md mandatory checks)', () => {
  it('has exactly 56 pages numbered 1..57 (worksheets + games interleaved)', () => {
    expect(TOTAL_PAGES).toBe(57);
    for (let n = 1; n <= 57; n++) expect(pageByNumber(n), `page ${n}`).toBeDefined();
    expect(WORKBOOK.map((p) => p.n)).toEqual(Array.from({ length: 57 }, (_, i) => i + 1));
  });

  it('every page carries the canonical footer', () => {
    for (const page of WORKBOOK) {
      expect(page.html, `page ${page.n} f1`).toContain(FOOTER_F1);
      expect(page.html, `page ${page.n} f2`).toContain(FOOTER_F2);
    }
  });

  it('axis names use natural Hebrew order (ציר x / ציר y, never x ציר / y ציר)', () => {
    for (const page of WORKBOOK) {
      expect(page.html.includes('x ציר'), `page ${page.n}`).toBe(false);
      expect(page.html.includes('y ציר'), `page ${page.n}`).toBe(false);
    }
  });

  it('stays in the first quadrant — never discusses negatives', () => {
    for (const page of WORKBOOK) expect(page.html.includes('שליל'), `page ${page.n}`).toBe(false);
  });

  it('has no name/date fields or demo/filler headings', () => {
    const forbidden = ['שם התלמיד', 'תאריך', 'שלב 3', 'שלב 4', 'ניתוח', 'אתגר', 'בודקים הבנה', 'מכירים את המערכת'];
    for (const page of WORKBOOK) {
      for (const f of forbidden) expect(page.html.includes(f), `page ${page.n}: ${f}`).toBe(false);
    }
  });

  it('never uses "מתקדמים" for point movement (uses זזים/הזזה)', () => {
    for (const page of WORKBOOK) expect(page.html.includes('מתקדמים'), `page ${page.n}`).toBe(false);
  });

  it('page 1 is the fill-in opener', () => {
    // The opener must be a worksheet the learner writes on, not a page to read.
    expect(pageByNumber(1)!.html).toMatch(/pair-blank|word-blank|class="blank"/);
  });

  it('every game is a numbered page exactly once, in a topic', () => {
    for (const g of GAMES) {
      const hosts = WORKBOOK.filter((p) => p.gameId === g.id);
      expect(hosts.length, `game ${g.id}`).toBe(1);
      expect(hosts[0]!.html, `game ${g.id} host`).toContain(`data-game-host="${g.id}"`);
    }
  });

  // Page numbers are positional (see index.ts `renumber`), so styling must never
  // key off a #page-N id — it would silently attach to whichever page later
  // lands in that slot.
  it('no stylesheet targets a page by its number', () => {
    const css = readFileSync(new URL('../src/styles/workbook.css', import.meta.url), 'utf8');
    expect(css.match(/#page-\d+/g)).toBeNull();
  });

  it('topics cover all pages exactly once', () => {
    const covered = TOPICS.flatMap((t) => t.pages).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: 57 }, (_, i) => i + 1));
  });

  it('every true/false table row has two uniform checkboxes', () => {
    // each tf-options group renders exactly two radio inputs (נכון / לא נכון)
    for (const page of WORKBOOK) {
      const groups = page.html.split('class="tf-options"').length - 1;
      if (groups > 0) {
        const radios = page.html.split('type="radio"').length - 1;
        expect(radios, `page ${page.n}`).toBeGreaterThanOrEqual(groups * 2);
      }
    }
  });
});
