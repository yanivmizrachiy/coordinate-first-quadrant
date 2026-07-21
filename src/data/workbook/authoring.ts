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

/** A line for the learner to write on: `blank(4)` → four characters wide. */
export const blank = (width = 4): string =>
  `<span class="blank" style="--blank-width:${width}ch"></span>`;

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
  /** false when naming the axes IS the task — printing them gives it away. */
  axisNames?: boolean;
  axisX?: string;
  axisY?: string;
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
    '></div>'
  );
}
