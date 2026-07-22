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
  it('only a label WITHOUT Hebrew is pinned to LTR', () => {
    /* „ציר y” must stay RTL so the Hebrew word sits on the right and is read
       first; „(2,5)” must be pinned or RTL mirrors its brackets. One place
       decides, from the text itself, so no call site can get it wrong. */
    const helper = grid.slice(grid.indexOf('function el('), grid.indexOf('/** Render'));
    expect(helper).toMatch(/tag === 'text' && text !== '' && !\/\[[^\]]+\]\/\.test\(text\)/);
    // and no call site may override that decision for a Hebrew label
    const axisName = grid.slice(grid.indexOf('spec.axisXName') - 220, grid.indexOf('spec.axisXName'));
    expect(axisName, 'the axis name is force-pinned again').not.toContain("direction: 'ltr'");
  });

  /* The drawing's JSON rides inside a single-quoted attribute. An apostrophe in
     a label — „מרחק 4 יח'” — closes it early and the browser drops every box on
     that drawing, with nothing in the console to say so. */
  it('a drawing survives an apostrophe in one of its labels', () => {
    for (const p of WORKBOOK) {
      for (const m of p.html.matchAll(/data-(?:labelboxes|points|xlabels|ylabels)='([^']*)'/g)) {
        expect(() => JSON.parse(m[1]!.replace(/&#39;/g, "'")), `page ${p.n}: broken ${m[0]!.slice(0, 22)}`).not.toThrow();
      }
      // and nothing may end an attribute early
      expect(p.html, `page ${p.n} has a raw apostrophe inside a data attribute`)
        .not.toMatch(/data-[a-z]+='[^']*'[^ >=]/);
    }
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
        /* The final answer of a calculation is a number because area is a
           number — that is arithmetic, not a lack of variety. */
        const body = card.replace(/<div class="calc-final">[\s\S]*?<\/div>\s*<\/div>/g, ' ');
        const kinds = [...body.matchAll(/data-missing="(\w+)"/g)].map((m) => m[1]);
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

describe('Hebrew and punctuation hold up to proofreading', () => {
  /* Checked on the markup a reader ends up seeing. An empty element (a blank)
     is not a space, so it is removed rather than replaced — the raw HTML would
     otherwise report a space before every full stop that follows a box. */
  const readable = (html: string): string =>
    html
      .replace(/<span class="(blank|word-blank|pair-blank)[^"]*"[^>]*><\/span>/g, '_')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ');

  it('no space sits before a comma or a full stop', () => {
    for (const p of WORKBOOK) {
      const m = /\S +[.,](\s|$)/.exec(readable(p.html));
      expect(m?.[0], `page ${p.n}: "${m?.[0]}"`).toBeUndefined();
    }
  });

  /* You answer a QUESTION, never a drawing or a point: „ענו עליה” is not
     Hebrew. And „קודם x ואחר כך y” describes an order of writing; the booklet
     says WHERE each number sits — „מצד שמאל” / „מצד ימין” (§5, §7). */
  it('the wording is Hebrew a teacher would sign', () => {
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(text, `page ${p.n}: "ענו עלי…" — one answers a question, not a drawing`)
        .not.toMatch(/ענו עלי[ווה]/);
      expect(text, `page ${p.n}: "קודם … ואחר כך" — say which SIDE, not which turn`)
        .not.toMatch(/קודם [xy] ואחר כך|נכתב ראשון|נכתב שני/);
    }
  });

  /* USER_MEMORY §5. „כפל כותרת” — every game repeated the sheet title as its
     own heading, so the reader met the same words twice before any task. */
  it('no heading inside a sheet repeats the sheet title', () => {
    for (const p of WORKBOOK) {
      const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(p.html)?.[1]?.replace(/<[^>]+>/g, '').trim();
      if (!h1) continue;
      const bare = h1.replace(/[^֐-׿a-zA-Z ]/g, '').trim();
      for (const m of p.html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)) {
        const head = m[1]!.replace(/<[^>]+>/g, '').trim();
        expect(head, `page ${p.n}: „${head}” repeats the sheet title`).not.toBe(bare);
      }
    }
  });

  /* A heading that asks something ends in a question mark. */
  it('a heading that asks a question is punctuated as one', () => {
    const asks = /^(?:[֐-׿]\.\s*)?(מדוע|האם|איזו|איזה|אילו|מי |מה |כמה|לאן|איך)/;
    for (const p of WORKBOOK) {
      for (const m of p.html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/g)) {
        const head = m[1]!.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (!asks.test(head)) continue;
        // „מי אני? כתבו את הזוג הסדור.” is fine — the mark sits with the question
        expect(head.includes('?'), `page ${p.n}: „${head}” asks without a question mark`).toBe(true);
      }
    }
  });

  /* A bare letter is not a point. „B ממוקמת” has nothing to agree with; it is
     „הנקודה B ממוקמת” (§7). */
  it('a statement about a point names it as a point', () => {
    for (const p of WORKBOOK) {
      for (const m of p.html.matchAll(/<(?:li|td)>([\s\S]*?)<\/(?:li|td)>/g)) {
        const text = m[1]!.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        expect(text, `page ${p.n}: „${text.slice(0, 40)}” starts with a bare letter`)
          .not.toMatch(/^[A-Z] (ממוקמ|נמצא|היא |הוא )/);
      }
    }
  });

  it('a Hebrew prefix before a Latin letter uses the Hebrew maqaf', () => {
    for (const p of WORKBOOK) {
      // „ל-x” is wrong; „ל־x” is right
      const m = /[א-ת]-[a-zA-Z0-9]/.exec(readable(p.html));
      expect(m?.[0], `page ${p.n}: "${m?.[0]}"`).toBeUndefined();
    }
  });
});

describe('a group never asks the same question four times', () => {
  /* USER_MEMORY §5. Four items reading "שיעור x הוא N ושיעור y הוא M" with
     nothing but the numbers changing is not practice, it is filler. */
  const shape = (li: string): string =>
    li
      .replace(/<[^>]+>/g, ' ')
      .replace(/\d+/g, '#')
      .replace(/\s+/g, ' ')
      .trim();

  it('no list repeats one wording with only the numbers changed', () => {
    for (const p of WORKBOOK) {
      for (const list of p.html.split('<ul class="tasks').slice(1)) {
        const items = [...list.split('</ul>')[0]!.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => shape(m[1]!));
        if (items.length < 4) continue;
        const counts = new Map<string, number>();
        for (const s of items) counts.set(s, (counts.get(s) ?? 0) + 1);
        const worst = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]!;
        expect(worst[1], `page ${p.n}: "${worst[0].slice(0, 46)}" appears ${worst[1]} times`).toBeLessThan(4);
      }
    }
  });

  it('a completion sentence reads like a textbook, not like an equation', () => {
    // „ערך ה־x הוא ____”, never „שיעור x = ____”
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(text, `page ${p.n} uses "= ___" inside a sentence`).not.toMatch(/(שיעור|ערך)\s*[xy]?\s*=\s*(_|$)/);
    }
  });

  /* USER_MEMORY §5. Yaniv: „פעם המילה שווה ופעם הסימן שווה — ככה רציתי גיוון”.
     Stating a given one single way through a whole task is the monotony he
     objects to; the two forms have to sit side by side. */
  it('a task that states given coordinates uses the word שווה AND the sign =', () => {
    const readable = (html: string): string => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const teaches = WORKBOOK.filter((p) => readable(p.html).includes('הזוג הסדור המתאים'));
    expect(teaches.length, 'no page builds an ordered pair from given coordinates').toBeGreaterThan(0);
    for (const p of teaches) {
      const text = readable(p.html);
      expect(text, `page ${p.n} never states a given with the word שווה`).toMatch(/שווה\s*\d/);
      expect(text, `page ${p.n} never states a given with the sign =`).toMatch(/[xy]\s*=\s*\d/);
    }
  });

  /* USER_MEMORY §8. The blank has to MOVE. Two consecutive items whose text is
     identical once the blank is taken out are the same question twice, however
     different the numbers or the axis letter look. */
  it('two items in a row never leave the same sentence with the blank in one place', () => {
    const skeleton = (li: string): string =>
      li
        .replace(/<span class="blank[^>]*><\/span>/g, ' ▮ ')
        .replace(/<[^>]+>/g, ' ')
        // Swapping x for y, A for B or AB for BC is not variety — the learner
        // answers the second item by copying how they answered the first.
        .replace(/\b[A-Z]{1,2}\b/g, '▲')
        .replace(/\b[xy]\b/g, '▯')
        .replace(/\d+/g, '#')
        .replace(/\s+/g, ' ')
        .trim();

    for (const p of WORKBOOK) {
      for (const list of p.html.split('<ul class="tasks').slice(1)) {
        const items = [...list.split('</ul>')[0]!.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => skeleton(m[1]!));
        for (let i = 1; i < items.length; i++) {
          if (!items[i]!.includes('▮')) continue;
          expect(
            items[i],
            `page ${p.n}: two items in a row read "${items[i]!.slice(0, 52)}"`,
          ).not.toBe(items[i - 1]);
        }
      }
    }
  });
});

describe('a poster sheet keeps the design and drops what the rules forbid', () => {
  const posters = WORKBOOK.filter((p) => p.sectionClass.includes('poster'));

  it('carries its page number, and no heading of ours over the artwork', () => {
    expect(posters.length).toBeGreaterThan(0);
    for (const p of posters) {
      // The number is there so a sheet can be found and referred to.
      expect(p.html, `page ${p.n} has no page number`).toContain('poster-number');
      expect(p.html, `page ${p.n} draws our header over the artwork`).not.toContain('sheet-header');
    }
  });

  it('still carries the canonical footer, like every other page', () => {
    for (const p of posters) expect(p.html, `page ${p.n}`).toContain('gz-footer');
  });

  it('shows the artwork whole — we do not redesign what Yaniv supplied', () => {
    expect(css, 'the crop frame is back').not.toContain('poster-frame');
    for (const p of posters) expect(p.html, `page ${p.n} is cropped`).not.toContain('poster-frame');
  });

  it('every poster is a coordinate task, not a word puzzle', () => {
    // A word search is a Hebrew puzzle with no mathematical thinking in it.
    for (const p of posters) expect(p.title, `page ${p.n}`).not.toContain('תפזורת');
  });
});

describe("a point's name stays attached to its brackets", () => {
  /* USER_MEMORY §7: „האות באנגלית משמאל לסוגריים”. Splitting the name and the
     brackets across two table cells cannot satisfy it — the sheet is RTL, so
     the first column lands on the right and it reads „(_,_) A”. */
  it('a name and its empty pair live in one element', () => {
    for (const p of WORKBOOK) {
      expect(
        p.html,
        `page ${p.n} puts a point's name in its own cell`,
      ).not.toMatch(/<td><span class="math-ltr" dir="ltr">[A-Z]'?<\/span><\/td>\s*<td><span class="pair/);
    }
  });
});

describe('a calculation gets units and room to work', () => {
  /* USER_MEMORY §10. Both rules were written down and neither was checked, so
     five sheets asked for a perimeter with nowhere to work it out and no unit
     on the answer. */
  const readable = (h: string): string => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const computes = (h: string): boolean => /(היקף|שטח)\s*[=:]/.test(readable(h));

  /* USER_MEMORY §5. „מרחק” is not extra vocabulary — it is what a coordinate
     MEANS, and Yaniv asked for it by name. The page that introduces שיעור x
     and שיעור y has to say it, and its drawing needs a dashed line to EACH
     axis: one line teaches half the idea. */
  it('the coordinates page teaches the word מרחק, and measures to both axes', () => {
    const page = WORKBOOK.find((p) => p.title.includes('שיעור x'));
    expect(page, 'the page that introduces the coordinates is gone').toBeDefined();
    const html = page!.html;
    expect(html, 'the word מרחק never appears').toMatch(/מרחק|רחוק/);
    const segs = JSON.parse(
      /data-segments='([^']*)'/.exec(html)![1]!.replace(/&#39;/g, "'"),
    ) as Array<{ from: number[]; to: number[] }>;
    const toX = segs.some((s) => s.from[1] === 0 || s.to[1] === 0);
    const toY = segs.some((s) => s.from[0] === 0 || s.to[0] === 0);
    expect(toX, 'no dashed line down to ציר x').toBe(true);
    expect(toY, 'no dashed line across to ציר y').toBe(true);
  });

  /* USER_MEMORY §8: „גם כלל או הגדרה מוצגים כמשפט השלמה, לא כמשפט מוכן”.
     A rule handed over finished is a rule the learner reads past. */
  it('a rule box states its rule as something to complete', () => {
    for (const p of WORKBOOK) {
      for (const rb of p.html.split('<div class="rule-box').slice(1)) {
        const body = rb.split('</div>\n</div>')[0]!;
        // the split leaves the tail of the opening tag („ completion-intro">”)
        const words = body.slice(body.indexOf('>') + 1)
          .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!words) continue;
        // A worked example is the one thing that must show its answer — that
        // is what makes it an example. It has to say so on its face.
        if (/^(הדגמה|דוגמה)/.test(words)) continue;
        expect(body, `page ${p.n}: rule box reads as a finished sentence — „${words.slice(0, 54)}”`)
          .toMatch(/class="(word-)?blank|pair-blank/);
      }
    }
  });

  /* USER_MEMORY §9. A box that floats loose is a box the learner has to guess
     at — Yaniv reported it twice, on two different drawings. Every label on a
     drawing states which point, tick or line it belongs to. */
  it('every label box on a drawing points at what it describes', () => {
    for (const p of WORKBOOK) {
      for (const m of p.html.matchAll(/data-labelboxes='([^']*)'/g)) {
        const boxes = JSON.parse(m[1]!.replace(/&#39;/g, "'")) as Array<{ text: string; to?: number[] }>;
        for (const b of boxes) {
          expect(b.to, `page ${p.n}: „${b.text}” floats with nothing to attach it to`).toBeDefined();
        }
      }
    }
  });

  /* Marking a point does not prove the learner can write it. */
  it('a "mark it on the drawing" task also asks for the ordered pair', () => {
    for (const p of WORKBOOK) {
      for (const card of p.html.split('<section class="q-card"').slice(1)) {
        const body = card.split('</section>')[0]!;
        // Marking a POINT — page 1 marks a number on an axis, which has no pair
        // and must not have one (§8: identification only).
        const head = (/<h3>([\s\S]*?)<\/h3>/.exec(body)?.[1] ?? '').replace(/<[^>]+>/g, '');
        // „סמנו … נקודות” — placing points. Not „בנקודה … וסמנו אם היא ישרה”,
        // which marks a checkbox and has no pair to write.
        const mark = head.indexOf('סמנו');
        const point = head.indexOf('נקוד');
        if (mark < 0 || point < mark) continue;
        if (body.includes('tf-options')) continue;
        // …unless the task already hands the point over AS a pair, in which
        // case copying it out again teaches nothing.
        if (/[A-Z]\(\d+,\d+\)/.test(body.replace(/<[^>]+>/g, ''))) continue;
        expect(body, `page ${p.n}: a marking task with no ordered pair to write`)
          .toContain('pair-blank');
      }
    }
  });

  it('an area or perimeter answer ends in its unit', () => {
    for (const p of WORKBOOK) {
      if (!computes(p.html)) continue;
      expect(readable(p.html), `page ${p.n} has no יח' / יח"ר`).toMatch(/יח'|יח"ר/);
    }
  });

  /* USER_MEMORY §10. „הדרך חשובה מאוד מאוד” — a calculation gets room to work
     in and then an answer that carries its unit, written with the letters an
     Israeli textbook uses: S for area, P for perimeter. */
  it('every area or perimeter answer is S or P, with its unit and room to work', () => {
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      if (!/שטח|היקף/.test(text)) continue;
      for (const f of p.html.matchAll(/<div class="calc-final">([\s\S]*?)<\/div>\s*<\/div>/g)) {
        const plain = f[1]!.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        expect(plain, `page ${p.n}: a final answer without S or P`).toMatch(/[SP] =/);
        expect(plain, `page ${p.n}: a final answer without its unit`).toMatch(/יח/);
      }
      /* Room to work means ruled lines OR the named exercise lines that replaced
         them — „PQ = ____ = ____ יח'”, written left to right. Either is room; a
         box with neither is a calculation with nowhere to do it. */
      for (const box of p.html.split('<div class="calc-box">').slice(1)) {
        const head = box.slice(0, 400);
        expect(
          /answer-line|calc-ltr/.test(head),
          `page ${p.n}: a calculation with no room to write the working`,
        ).toBe(true);
      }
    }
  });

  /* USER_MEMORY §10. A rectangle has an אורך and a רוחב — the longer side and
     the shorter one. „הצלע האופקית” describes the picture, not the shape. */
  it('a rectangle is described by its אורך and רוחב, not by which way it points', () => {
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(text, `page ${p.n}: „הצלע האופקית/האנכית” — say אורך and רוחב`)
        .not.toMatch(/הצלע ה(אופקית|אנכית)/);
    }
  });

  /* An exercise is worked left to right, whatever direction the sheet runs. */
  it('an exercise line is pinned left to right', () => {
    for (const p of WORKBOOK) {
      for (const m of p.html.matchAll(/<div class="calc-ltr"([^>]*)>/g)) {
        expect(m[1], `page ${p.n}: an exercise line that is not pinned LTR`).toContain('dir="ltr"');
      }
    }
  });

  /* USER_MEMORY §8. A claim is „נכונה בהכרח / ייתכן שנכונה / לא ייתכן”. The old
     „תמיד / לפעמים / לעולם לא” describes frequency, not necessity. */
  it('a claim is judged as necessary, possible or impossible', () => {
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(text, `page ${p.n}: „לעולם לא” — say „לא ייתכן”`).not.toContain('לעולם לא');
      if (/נכונה בהכרח/.test(text)) {
        expect(text, `page ${p.n}: the three options are not all offered`).toMatch(/ייתכן/);
      }
    }
  });

  /* A „find the mistake” task that states the mistake has already answered
     itself. Show the task and what was drawn; the gap is the work. */
  it('a find-the-mistake task does not give the mistake away', () => {
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(text, `page ${p.n}: „סימן … במקום …” hands the answer over`)
        .not.toMatch(/סימן [^.]{0,30}במקום/);
    }
  });

  /* USER_MEMORY §5. A shared coordinate is stated as a whole sentence naming
     both points — „לשתי הנקודות A ו־B יש שיעור y זהה” — never as a bare
     „השיעור הזהה: ____”, and the sheet then asks the learner to PRODUCE two
     such points, which is the half that cannot be copied. */
  it('a shared coordinate is a sentence, and the learner is asked to make one', () => {
    for (const p of WORKBOOK) {
      const text = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(text, `page ${p.n}: „השיעור הזהה:” — say „לשתי הנקודות … יש שיעור … זהה”`)
        .not.toContain('השיעור הזהה');
    }
    const asked = WORKBOOK.filter((p) =>
      /כתבו שתי נקודות משלכם שיש להן שיעור/.test(p.html.replace(/<[^>]+>/g, ' ')),
    );
    expect(asked.length, 'nowhere asks the learner to produce two points with a shared coordinate')
      .toBeGreaterThan(0);
  });

  /* USER_MEMORY §5, applied to the whole booklet rather than page by page: an
     open line is where a child writes nothing. Every ruled line either carries
     the working of a calculation or is a completion the sheet leads them into. */
  it('no sheet leaves an open line that is not the working of a calculation', () => {
    for (const p of WORKBOOK) {
      const open = (p.html.match(/<div class="answer-line">/g) ?? []).length;
      const inCalc = (p.html.match(/calc-box/g) ?? []).length * 2;
      expect(open, `page ${p.n}: ${open - inCalc} open line(s) with no guidance`).toBeLessThanOrEqual(inCalc);
    }
  });

  it('no sheet asks an open question instead of leading a completion', () => {
    for (const p of WORKBOOK) {
      const t = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      for (const w of ['הסבירו', 'ונמקו', 'שאלה פתוחה', 'שווה ל־', 'השיעור הזהה']) {
        expect(t, `page ${p.n}: „${w}”`).not.toContain(w);
      }
    }
  });

  /* USER_MEMORY §5. „הנקודה של היום הראשון” is possession; the point does not
     belong to the day, it CORRESPONDS to it. Yaniv's word is התאמה. */
  it('a point corresponds to its datum — it does not belong to it', () => {
    for (const p of WORKBOOK) {
      const t = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(t, `page ${p.n}: „הנקודה של …” — say „הנקודה שמתאימה ל…”`)
        .not.toMatch(/הנקוד(ה|ות) של ה?(יום|שנה|חודש|שעה|ריבוע|כיתה)/);
    }
  });

  /* A chapter carries one blue title; the subtitle is what tells the sheets
     apart. All six graph sheets are „קריאת גרפים ברביע הראשון”. */
  it('the graph chapter shows one title across all of its sheets', () => {
    const graphs = WORKBOOK.filter((p) => p.title.includes('קריאת גרפים'));
    expect(graphs.length, 'the graph chapter is gone').toBe(6);
    expect(new Set(graphs.map((p) => p.subtitle)).size, 'two sheets share a subtitle').toBe(6);
  });

  /* USER_MEMORY §8. Varying by rewriting the sentence is the opposite of the
     rule: the sentence is written once and the GAP moves inside it. „בשתי
     נקודותיו” is the shape that came from rewriting instead of moving. */
  it('a parallel-segment item keeps the one sentence and moves the gap', () => {
    for (const p of WORKBOOK) {
      const t = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      expect(t, `page ${p.n}: „בשתי נקודותיו” — say „בשתי הנקודות שעליו”`)
        .not.toContain('בשתי נקודותיו');
    }
  });

  it('a sheet that asks for a calculation leaves space to do it', () => {
    for (const p of WORKBOOK) {
      if (!computes(p.html)) continue;
      expect(p.html, `page ${p.n} has no calc-box`).toContain('calc-box');
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
