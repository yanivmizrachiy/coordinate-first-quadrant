/* ===========================================================================
   Workbook model — the single ordered list of pages plus the topic map used by
   the table of contents.

   Worksheets and the 8 games are interleaved by topic: each game is a numbered
   worksheet page that hosts the interactive game (see `gameId`). Page numbers
   are assigned by POSITION here, so a page can be inserted, split or reordered
   without hand-editing the number baked into every sheet.
   =========================================================================== */
import { LEGACY_PAGES } from './legacy-pages';
import { CONTINUATION_PAGES } from './continuation';
import { PLOT_A, PLOT_B } from './plot-pages';
import { GAMES, type GameDefinition } from '../../games';
import type { WorkbookPageContent, WorkbookTopic } from './types';

export type { WorkbookPageContent, WorkbookTopic } from './types';

const legacy = (n: number): WorkbookPageContent => {
  const p = LEGACY_PAGES.find((x) => x.n === n);
  if (!p) throw new Error(`legacy page ${n} missing`);
  return p;
};
const cont = (n: number): WorkbookPageContent => {
  const p = CONTINUATION_PAGES.find((x) => x.n === n);
  if (!p) throw new Error(`continuation page ${n} missing`);
  return p;
};
const game = (id: string): GameDefinition => {
  const g = GAMES.find((x) => x.id === id);
  if (!g) throw new Error(`game ${id} missing`);
  return g;
};

const FOOTER_HTML =
  '<footer class="gz-footer">' +
  '<div class="f1">יניב רז - מדריך מחוזי חט"ב בעיר ירושלים</div>' +
  '<div class="f2">הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין</div>' +
  '</footer>';

/** Re-stamp a sheet with its final page number (id, aria, visible number, tf group names). */
function renumber(page: WorkbookPageContent, n: number): WorkbookPageContent {
  if (page.n === n) return page;
  const o = page.n;
  const swap = (s: string, a: string, b: string): string => s.split(a).join(b);
  let html = page.html;
  html = swap(html, `id="page-${o}"`, `id="page-${n}"`);
  html = swap(html, `id="title-${o}"`, `id="title-${n}"`);
  html = swap(html, `aria-labelledby="title-${o}"`, `aria-labelledby="title-${n}"`);
  html = swap(html, `aria-label="עמוד ${o}"`, `aria-label="עמוד ${n}"`);
  html = swap(html, `class="sheet-number">${o}<`, `class="sheet-number">${n}<`);
  html = swap(html, `name="tf-${o}-`, `name="tf-${n}-`);
  return { ...page, n, id: `page-${n}`, html };
}

/** A game becomes a numbered worksheet page hosting the interactive game. */
function gamePage(g: GameDefinition, n: number): WorkbookPageContent {
  const html =
    `<section aria-labelledby="title-${n}" class="sheet game-sheet" id="page-${n}">` +
    `<header class="sheet-header"><div><h1 id="title-${n}">${g.icon} ${g.title}</h1><p>${g.short}</p></div>` +
    `<div aria-label="עמוד ${n}" class="sheet-number">${n}</div></header>` +
    `<main class="sheet-content"><div class="game-host" data-game-host="${g.id}"></div></main>` +
    FOOTER_HTML +
    '</section>';
  return {
    n,
    id: `page-${n}`,
    sectionClass: 'sheet game-sheet',
    title: g.title,
    subtitle: g.skill,
    html,
    gameId: g.id,
  };
}

type Slot = WorkbookPageContent | GameDefinition;
const isGame = (s: Slot): s is GameDefinition => typeof (s as GameDefinition).mount === 'function';

/* The canonical order — worksheets and games interleaved by topic. */
const ORDER: Slot[] = [
  legacy(1), legacy(2),
  legacy(3), legacy(4), cont(35), legacy(5), legacy(6),
  PLOT_A, PLOT_B, legacy(8), game('hidden-drawing'),
  legacy(9), legacy(10), legacy(11), legacy(12), game('secret-word'),
  legacy(13), legacy(14), game('color-decode'),
  legacy(15), legacy(16), game('same-axis'),
  legacy(17), legacy(18),
  legacy(19), legacy(20), legacy(21), legacy(22), game('encrypted-route'), game('coordinate-maze'),
  legacy(23), legacy(24), game('coordinate-safe'),
  legacy(25), legacy(26), game('suspect-point'),
  legacy(27), legacy(28), legacy(29), legacy(30),
  cont(36), cont(31), cont(32), cont(33), cont(34),
];

export const WORKBOOK: WorkbookPageContent[] = ORDER.map((slot, i) =>
  isGame(slot) ? gamePage(slot, i + 1) : renumber(slot, i + 1),
);

export const TOTAL_PAGES = WORKBOOK.length;

export const TOPICS: WorkbookTopic[] = [
  { id: 'intro', title: 'היכרות עם מערכת הצירים', pages: [1, 2] },
  { id: 'coords', title: 'שיעור x, שיעור y והזוג הסדור', pages: [3, 4, 5, 6, 7] },
  { id: 'plot', title: 'סימון נקודות', pages: [8, 9, 10, 11] },
  { id: 'read', title: 'קריאת נקודות ונקודות על הצירים', pages: [12, 13, 14, 15, 16] },
  { id: 'language', title: 'שפה של מיקום', pages: [17, 18, 19] },
  { id: 'same', title: 'שיעורים זהים וקטעים מקבילים', pages: [20, 21, 22] },
  { id: 'relations', title: 'יחסים בין שיעורים', pages: [23, 24] },
  { id: 'move', title: 'הזזה ומרחק במערכת הצירים', pages: [25, 26, 27, 28, 29, 30] },
  { id: 'missing', title: 'שיעור חסר ודפוסים', pages: [31, 32, 33] },
  { id: 'errors', title: 'זיהוי ותיקון טעויות', pages: [34, 35, 36] },
  { id: 'rect', title: 'מלבנים, ריבועים, היקף ושטח', pages: [37, 38, 39, 40] },
  { id: 'rightangle', title: 'מקביל, מאונך וזווית ישרה', pages: [41, 42, 43, 44, 45] },
];

const byNumber = new Map(WORKBOOK.map((p) => [p.n, p]));

export const pageByNumber = (n: number): WorkbookPageContent | undefined => byNumber.get(n);

export function topicOfPage(n: number): WorkbookTopic | undefined {
  return TOPICS.find((t) => t.pages.includes(n));
}
