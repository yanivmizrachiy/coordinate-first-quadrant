import { describe, it, expect } from 'vitest';
import { WORKBOOK, TOTAL_PAGES, TOPICS, pageByNumber } from '../src/data/workbook';

const FOOTER_F1 = 'יניב רז - מדריך מחוזי חט"ב בעיר ירושלים';
const FOOTER_F2 = 'הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין';

describe('workbook integrity (CLAUDE.md mandatory checks)', () => {
  it('has exactly 34 pages numbered 1..34', () => {
    expect(TOTAL_PAGES).toBe(34);
    for (let n = 1; n <= 34; n++) expect(pageByNumber(n), `page ${n}`).toBeDefined();
    expect(WORKBOOK.map((p) => p.n)).toEqual(Array.from({ length: 34 }, (_, i) => i + 1));
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
    expect(pageByNumber(1)!.title).toContain('השלימו את המשפטים');
  });

  it('topics cover all 34 pages exactly once', () => {
    const covered = TOPICS.flatMap((t) => t.pages).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: 34 }, (_, i) => i + 1));
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
