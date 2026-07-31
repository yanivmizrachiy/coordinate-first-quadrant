/* פענוח צבעוני — צובעים את התאים שברשימת הזוגות הסדורים, ומהם מתגלה סמל.

   הקובץ הזה מחזיק **נתונים בלבד**. השעשועון המקוון הוסר (31.07.2026): הדף
   הוא עכשיו `COLOR_DECODE_PRINT` — „אנחנו רק דפים להדפסה ולא מתוקשב" —
   ורשימת התאים נשארת כאן כמקור אמת אחד לדף המודפס ולבדיקות. */
import { isFirstQuadrant, type Point } from '../lib/coordinateMath';

/** גבולות הרשת — ערך x ושיעור y הגדולים ביותר שיש להם תא. הדף המודפס בונה
    את הרשת מהם, כדי שהמידות לא יהיו כתובות פעמיים. */
export const decodeXMax = 6;
export const decodeYMax = 5;

/** Cells that, when coloured, reveal a check mark (וי). */
export const decodeTargets: Point[] = [
  { x: 1, y: 4 }, { x: 2, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 4 }, { x: 6, y: 5 },
];

const keyOf = (p: Point): string => `${p.x},${p.y}`;

export function decodeSolved(colored: Iterable<string>): boolean {
  const set = new Set(colored);
  const targetKeys = decodeTargets.map(keyOf);
  return set.size === targetKeys.length && targetKeys.every((k) => set.has(k));
}

/** Exposed for tests. */
export function targetsAreFirstQuadrant(): boolean {
  return decodeTargets.every(isFirstQuadrant);
}
