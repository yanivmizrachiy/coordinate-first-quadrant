/* ===========================================================================
   Workbook model — the single ordered list of pages plus the topic map used by
   the table of contents.

   Worksheets and the 8 games are interleaved by topic: each game is a numbered
   worksheet page that hosts the interactive game (see `gameId`). Page numbers
   are assigned by POSITION here, so a page can be inserted, split or reordered
   without hand-editing the number baked into every sheet.
   =========================================================================== */
import {
  AXES_IDENTIFY,
  HERO_INTRO,
  PLOT_A,
  PLOT_B,
  PLOT_SHAPE,
  GRAPH_REAL,
  SHAPE_MOVE,
  READ_PAIRS,
  ORDERED_PAIR_DRILL,
  PARALLEL_PERPENDICULAR,
  RIGHT_ANGLE_INTRO,
  RIGHT_ANGLE_PRACTICE,
  RIGHT_ANGLE_BUILD,
  RIGHT_ANGLE_SUMMARY,
  AXES_INTRO,
  AXES_PRACTICE,
  COORDS_INTRO,
  COORDS_PRACTICE,
  ORDERED_PAIR_INTRO,
  ORDERED_PAIR_PRACTICE,
  PLOT_PRACTICE,
  READ_INTRO,
  READ_PRACTICE,
  ON_AXES_INTRO,
  ON_AXES_PRACTICE,
  POSITION_LANGUAGE_INTRO,
  POSITION_LANGUAGE_PRACTICE,
  SAME_COORD_INTRO,
  SAME_COORD_PRACTICE,
  RELATIONS_INTRO,
  RELATIONS_PRACTICE,
  MOVE_INTRO,
  MOVE_PRACTICE,
  DISTANCE_INTRO,
  DISTANCE_PRACTICE,
  MISSING_COORD_INTRO,
  MISSING_COORD_PRACTICE,
  ERRORS_INTRO,
  ERRORS_PRACTICE,
  RECTANGLES_INTRO,
  RECTANGLES_PRACTICE,
  SQUARES_INTRO,
  SQUARES_PRACTICE,
} from './pages';
import { GAMES, type GameDefinition } from '../../games';
import type { WorkbookPageContent, WorkbookTopic } from './types';

export type { WorkbookPageContent, WorkbookTopic } from './types';

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

/* The canonical order — worksheets and games interleaved, grouped by topic.
   Page numbers AND the topic map are both derived from this one list, so
   inserting or splitting a page is a single-line change: never renumber by
   hand, and a topic can never drift out of sync with the pages it names. */
const BOOK: { id: string; title: string; slots: Slot[] }[] = [
  { id: 'intro', title: 'היכרות עם מערכת הצירים', slots: [
    // Identification first: names of the axes and the origin, nothing more.
    // The ordered pair only starts in the next topic (Yaniv's rule).
    AXES_IDENTIFY, AXES_INTRO, AXES_PRACTICE,
  ] },
  { id: 'coords', title: 'שיעור x, שיעור y והזוג הסדור', slots: [
    HERO_INTRO,
    COORDS_INTRO, READ_PAIRS, COORDS_PRACTICE, ORDERED_PAIR_DRILL, ORDERED_PAIR_INTRO, ORDERED_PAIR_PRACTICE,
  ] },
  { id: 'plot', title: 'סימון נקודות', slots: [
    PLOT_A, PLOT_B, PLOT_PRACTICE, PLOT_SHAPE, game('hidden-drawing'),
  ] },
  { id: 'read', title: 'קריאת נקודות ונקודות על הצירים', slots: [
    READ_INTRO, READ_PRACTICE, ON_AXES_INTRO, ON_AXES_PRACTICE, GRAPH_REAL, game('secret-word'),
  ] },
  { id: 'language', title: 'שפה של מיקום', slots: [
    POSITION_LANGUAGE_INTRO, POSITION_LANGUAGE_PRACTICE, game('color-decode'),
  ] },
  { id: 'same', title: 'שיעורים זהים וקטעים מקבילים', slots: [
    SAME_COORD_INTRO, SAME_COORD_PRACTICE, game('same-axis'),
  ] },
  { id: 'relations', title: 'יחסים בין שיעורים', slots: [
    RELATIONS_INTRO, RELATIONS_PRACTICE,
  ] },
  { id: 'move', title: 'הזזה ומרחק במערכת הצירים', slots: [
    MOVE_INTRO, MOVE_PRACTICE, DISTANCE_INTRO, DISTANCE_PRACTICE, SHAPE_MOVE,
    game('encrypted-route'), game('coordinate-maze'),
  ] },
  { id: 'missing', title: 'שיעור חסר ודפוסים', slots: [
    MISSING_COORD_INTRO, MISSING_COORD_PRACTICE, game('coordinate-safe'),
  ] },
  { id: 'errors', title: 'זיהוי ותיקון טעויות', slots: [
    ERRORS_INTRO, ERRORS_PRACTICE, game('suspect-point'),
  ] },
  { id: 'rect', title: 'מלבנים, ריבועים, היקף ושטח', slots: [
    RECTANGLES_INTRO, RECTANGLES_PRACTICE, SQUARES_INTRO, SQUARES_PRACTICE,
  ] },
  { id: 'rightangle', title: 'מקביל, מאונך וזווית ישרה', slots: [
    PARALLEL_PERPENDICULAR, RIGHT_ANGLE_INTRO, RIGHT_ANGLE_PRACTICE, RIGHT_ANGLE_BUILD, RIGHT_ANGLE_SUMMARY,
  ] },
];

const ORDER: Slot[] = BOOK.flatMap((t) => t.slots);

export const WORKBOOK: WorkbookPageContent[] = ORDER.map((slot, i) =>
  isGame(slot) ? gamePage(slot, i + 1) : renumber(slot, i + 1),
);

export const TOTAL_PAGES = WORKBOOK.length;

/* Derived from BOOK — never hand-numbered. */
export const TOPICS: WorkbookTopic[] = (() => {
  let n = 0;
  return BOOK.map((t) => ({
    id: t.id,
    title: t.title,
    pages: t.slots.map(() => ++n),
  }));
})();

const byNumber = new Map(WORKBOOK.map((p) => [p.n, p]));

export const pageByNumber = (n: number): WorkbookPageContent | undefined => byNumber.get(n);

export function topicOfPage(n: number): WorkbookTopic | undefined {
  return TOPICS.find((t) => t.pages.includes(n));
}
