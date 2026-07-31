/* The contents page, as the second sheet of the booklet — right after the
   cover, before page 1. It is a real A4 sheet, so it prints with the rest; on
   screen every chapter is a button that jumps to that chapter's first page.

   The design Yaniv chose (31.07.2026): the centred No-numbering of a Chanel
   catalogue on the night-ink ground of the Jerusalem film, a faint gold
   coordinate grid behind, and the chapters dressed in NOBLE METALS rather
   than bright colour — platinum, champagne, rose gold, copper, antique gold.
   Large page numbers, large chapter names, and the five entries spread so the
   whole A4 page is used. Serif faces are bundled locally (no runtime fetch). */
import '@fontsource/frank-ruhl-libre/hebrew-300.css';
import '@fontsource/frank-ruhl-libre/hebrew-400.css';
import '@fontsource/frank-ruhl-libre/300.css';
import '@fontsource/frank-ruhl-libre/400.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import { elem } from '../lib/dom';
import { navigate } from '../router';
/* The contents Yaniv asked for: five chapters, named by him, each opening the
   page he named. It is NOT derived from BOOK any more — he wants a reader's
   map, not an index of every section, and „כל השאר תמחק מהתוכן".
   A test checks that every page number here exists. */
export const CONTENTS: ReadonlyArray<{ title: string; page: number }> = [
  { title: 'הרביע הראשון — מושגים בסיסיים', page: 1 },
  { title: 'נקודות במערכת הצירים', page: 12 },
  { title: 'קטעים מקבילים לצירים', page: 29 },
  { title: 'שטחים והיקפים במערכת הצירים', page: 51 },
  { title: 'קריאת גרפים ברביע הראשון', page: 63 },
];
import { DISTRICT_BADGE } from '../data/cover';

/* The noble-metal palette Yaniv picked (31.07.2026) — „אפשרות 2": platinum,
   champagne, rose gold, copper, antique gold. One metal per chapter, in this
   order. Every one of them clears 4.5:1 on the night ink; a test measures it. */
const METALS = [
  '#E4E0D5', '#D9C08A', '#D4A29A', '#C58B5F', '#B49B57',
] as const;

/** The night ink the whole sheet sits on. Exported for the contrast test. */
export const TOC_INK = '#121016';

export function renderTocSheet(): HTMLElement {
  const section = elem('section', {
    class: 'sheet toc-sheet', id: 'toc', 'aria-label': 'תוכן העניינים',
  });

  /* The heading is centred: the unit's name as a letterspaced gold kicker,
     then the title in light serif, then a small gold diamond between rules. */
  const head = elem('header', { class: 'toc-head' },
    elem('p', { class: 'toc-head__kicker', text: 'מערכת צירים · הרביע הראשון' }),
    elem('h1', { class: 'toc-head__title', text: 'תוכן העניינים' }),
    elem('span', { class: 'toc-head__gem', 'aria-hidden': 'true' },
      elem('span', { class: 'toc-head__gem-dot' }),
    ),
  );

  const list = elem('div', { class: 'toc-buttons' });
  for (const [i, topic] of CONTENTS.entries()) {
    const metal = METALS[i % METALS.length]!;
    const first = topic.page;
    const btn = elem('button', {
      class: 'toc-btn',
      type: 'button',
      style: `--toc-metal:${metal}`,
      'aria-label': `${topic.title}, מתחיל בעמוד ${first}`,
    },
      /* Reading order, top to bottom: the chapter's No, its name, then the
         page it starts on — the reader looks for a chapter, not a number. */
      elem('span', { class: 'toc-btn__kicker', dir: 'ltr' },
        elem('span', { text: 'N' }),
        elem('sup', { text: 'o' }),
        elem('span', { text: ` ${i + 1}` }),
      ),
      elem('span', { class: 'toc-btn__name', text: topic.title }),
      elem('span', { class: 'toc-btn__page' },
        elem('span', { class: 'toc-btn__page-word', text: 'עמוד' }),
        elem('span', { class: 'toc-btn__no', dir: 'ltr', text: String(first) }),
      ),
      /* the metal divider — a glowing dot between two hairlines */
      elem('span', { class: 'toc-btn__rule', 'aria-hidden': 'true' },
        elem('span', { class: 'toc-btn__dot' }),
      ),
    );
    btn.addEventListener('click', () => navigate(`#/workbook/${first}`));
    list.append(btn);
  }

  const badge = elem('picture', { class: 'gz-badge' });
  badge.append(
    elem('source', { srcset: DISTRICT_BADGE.webp, type: 'image/webp' }),
    elem('img', { src: DISTRICT_BADGE.png, alt: DISTRICT_BADGE.alt, width: 34, height: 34, decoding: 'async' }),
  );
  const foot = elem('footer', { class: 'gz-footer' },
    badge,
    elem('div', { class: 'gz-lines' },
      elem('div', { class: 'f1', text: 'יניב רז - מדריך מחוזי חט"ב בעיר ירושלים' }),
      elem('div', { class: 'f2', text: 'הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין' }),
    ),
  );

  section.append(head, elem('main', { class: 'sheet-content' }, list), foot);
  return section;
}

/** Each chapter with the span of pages it covers. The page picker's presets and
    the flipbook's contents both need spans rather than starting pages, and
    deriving them here is what keeps one list of chapters in the project. */
export function chapterSpans(total: number): Array<{ title: string; from: number; to: number }> {
  return CONTENTS.map((c, i) => ({
    title: c.title,
    from: c.page,
    to: (CONTENTS[i + 1]?.page ?? total + 1) - 1,
  }));
}

/** Go to the contents page — it is the booklet's second sheet, so this opens the
    booklet and brings that sheet into view. Every „תוכן העניינים" button in the
    app calls this, so there is one behaviour and not three. */
export function goToContents(): void {
  navigate('#/book');
  requestAnimationFrame(() => {
    document.getElementById('toc')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
}
