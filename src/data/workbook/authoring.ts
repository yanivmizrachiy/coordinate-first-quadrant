/* Authoring helpers — the layer that makes a page easy to edit.
   A page file says what the sheet TEACHES; everything mechanical (the A4
   wrapper, the heading, the page number, the canonical footer) is built here,
   once. To change wording, open the page file and edit plain HTML: normal
   double quotes, no escaping, one element per line. */
import type { WorkbookPageContent } from './types';

const FOOTER =
  '<footer class="gz-footer">' +
  '<div class="f1">יניב רז - מדריך מחוזי חט"ב בעיר ירושלים</div>' +
  '<div class="f2">הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין</div>' +
  '</footer>';

/* Page numbers come from the position in BOOK (see index.ts), so a page is
   authored without one. This placeholder only has to be unique until then. */
let placeholder = 500;

export interface SheetSpec {
  /** `sheet guided`, `sheet practice`, `sheet guided dense`… */
  sectionClass: string;
  title: string;
  subtitle?: string;
  /** The sheet body: q-cards, rule boxes, drawings. Plain HTML. */
  content: string;
  /** `main` on most sheets; a few legacy sheets use `div`. */
  contentTag?: 'main' | 'div';
  gameId?: string;
}

export function sheet(spec: SheetSpec): WorkbookPageContent {
  const n = ++placeholder;
  const tag = spec.contentTag ?? 'main';
  const sub = spec.subtitle ? `<p>${spec.subtitle}</p>` : '';
  const html =
    `<section aria-labelledby="title-${n}" class="${spec.sectionClass}" id="page-${n}">` +
    `<header class="sheet-header"><div><h1 id="title-${n}">${spec.title}</h1>${sub}</div>` +
    `<div aria-label="עמוד ${n}" class="sheet-number">${n}</div></header>` +
    `<${tag} class="sheet-content">${spec.content}</${tag}>` +
    FOOTER +
    '</section>';
  return {
    n,
    id: `page-${n}`,
    sectionClass: spec.sectionClass,
    title: spec.title,
    subtitle: spec.subtitle ?? '',
    ...(spec.gameId === undefined ? {} : { gameId: spec.gameId }),
    html,
  };
}

/* ---- fragments used on nearly every sheet ---- */

/* What the learner has to supply. Yaniv's rule: consecutive completions must
   ask for DIFFERENT kinds of thing — never the same one three times in a row.
   Tagging each blank is what lets a test enforce that instead of hoping. */
export type Missing =
  | 'letter'    // שם הציר: x / y
  | 'property'  // תכונה: אופקי / אנכי
  | 'direction' // כיוון: ימינה / למעלה
  | 'concept'   // מושג: ראשית הצירים
  | 'number'    // מספר
  | 'relation'  // מה קורה: גדלים / קטנים / זהה
  | 'pair';     // זוג סדור

/** A line for the learner to write on: `blank(4, 'number')` → four wide. */
export const blank = (width = 4, missing?: Missing): string =>
  `<span class="blank"${missing ? ` data-missing="${missing}"` : ''} style="--blank-width:${width}ch"></span>`;

/** The wider box used inside a completion sentence. */
export const wordBlank = (size: 'short' | 'medium' | 'long', missing: Missing, aria: string): string =>
  `<span class="word-blank word-${size}" data-missing="${missing}" aria-label="${aria}"></span>`;

/** An empty ordered pair, optionally named: `pair('B')` → `B( __ , __ )`. */
export const pair = (name = ''): string =>
  `<span class="pair math-ltr" dir="ltr">${name}(<span class="pair-blank"></span>,` +
  '<span class="pair-blank"></span>)</span>';

/** Latin letters and equations inside Hebrew text must be pinned LTR. */
export const ltr = (math: string): string =>
  `<span class="math-ltr" dir="ltr">${math}</span>`;

export interface GridOptions {
  size?: 'hero' | 'lg' | 'md' | 'sm' | 'xs';
  label?: string;
  points?: unknown[];
  segments?: unknown[];
  polygons?: unknown[];
  arrows?: unknown[];
  labelboxes?: unknown[];
  /** false when naming the axes IS the task — printing them gives it away,
      so the drawing shows empty boxes to write the names in instead. */
  axisNames?: boolean;
  axisX?: string;
  axisY?: string;
  /** Numbers along an axis; `''` leaves an empty box for the learner to fill.
      Index = the value on that axis, so ['', 1, 2] blanks the first tick. */
  xlabels?: (number | string)[];
  ylabels?: (number | string)[];
}

/** A coordinate system. Keeps the JSON out of hand-escaped attributes. */
export function grid(o: GridOptions = {}): string {
  const data = (name: string, value: unknown[] | undefined): string =>
    ` data-${name}='${JSON.stringify(value ?? [])}'`;
  return (
    `<div class="coordinate-grid grid-${o.size ?? 'md'}" role="img"` +
    ` aria-label="${o.label ?? 'מערכת צירים ברביע הראשון'}"` +
    data('points', o.points) +
    data('segments', o.segments) +
    data('polygons', o.polygons) +
    data('arrows', o.arrows) +
    data('labelboxes', o.labelboxes) +
    (o.axisNames === false ? ' data-axisnames="false"' : '') +
    (o.axisX ? ` data-axisx="${o.axisX}"` : '') +
    (o.axisY ? ` data-axisy="${o.axisY}"` : '') +
    (o.xlabels ? ` data-xlabels='${JSON.stringify(o.xlabels)}'` : '') +
    (o.ylabels ? ` data-ylabels='${JSON.stringify(o.ylabels)}'` : '') +
    '></div>'
  );
}
