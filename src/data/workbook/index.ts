/* ===========================================================================
   Workbook model — the single ordered list of 34 pages plus the topic map used
   by the table of contents. Legacy pages 1–30 are generated from the original
   booklet; pages 31–34 are authored natively (continuation.ts).
   =========================================================================== */
import { LEGACY_PAGES } from './legacy-pages';
import { CONTINUATION_PAGES } from './continuation';
import type { WorkbookPageContent, WorkbookTopic } from './types';

export type { WorkbookPageContent, WorkbookTopic } from './types';

export const WORKBOOK: WorkbookPageContent[] = [...LEGACY_PAGES, ...CONTINUATION_PAGES].sort(
  (a, b) => a.n - b.n,
);

export const TOTAL_PAGES = WORKBOOK.length;

export const TOPICS: WorkbookTopic[] = [
  { id: 'intro', title: 'היכרות עם מערכת הצירים', pages: [1, 2] },
  { id: 'coords', title: 'שיעור x, שיעור y והזוג הסדור', pages: [3, 4, 5, 6] },
  { id: 'plot', title: 'סימון נקודות', pages: [7, 8] },
  { id: 'read', title: 'קריאת נקודות ונקודות על הצירים', pages: [9, 10, 11, 12] },
  { id: 'language', title: 'שפה של מיקום', pages: [13, 14] },
  { id: 'same', title: 'שיעורים זהים וקטעים מקבילים', pages: [15, 16] },
  { id: 'relations', title: 'יחסים בין שיעורים', pages: [17, 18] },
  { id: 'move', title: 'הזזה ומרחק במערכת הצירים', pages: [19, 20, 21, 22] },
  { id: 'missing', title: 'שיעור חסר ודפוסים', pages: [23, 24] },
  { id: 'errors', title: 'זיהוי ותיקון טעויות', pages: [25, 26] },
  { id: 'rect', title: 'מלבנים, ריבועים, היקף ושטח', pages: [27, 28, 29, 30] },
  { id: 'rightangle', title: 'זווית ישרה במערכת הצירים', pages: [31, 32, 33, 34] },
];

const byNumber = new Map(WORKBOOK.map((p) => [p.n, p]));

export const pageByNumber = (n: number): WorkbookPageContent | undefined => byNumber.get(n);

export function topicOfPage(n: number): WorkbookTopic | undefined {
  return TOPICS.find((t) => t.pages.includes(n));
}
