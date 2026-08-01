/* ציור נסתר — תוכנית הציור: זוגות סדורים שמסמנים לפי הסדר ומחברים, ומהם
   מתגלה מפרשית.

   התוכנית באה ב**קווים**, כמו שמציירים באמת: העיפרון מורם בין הגוף לתורן,
   ולכן הציור הוא משהו ששווה לגלות ולא מתאר סגור אחד. ומכיוון שהציור הגמור
   הוא צורה אמיתית אפשר לשאול עליו — שדרית אופקית, תורן אנכי ומפרש משופע הם
   שלוש תשובות שונות ל„מקביל לאיזה ציר?".

   הקובץ הזה מחזיק **נתונים בלבד**. השעשועון המקוון הוסר (31.07.2026): הדף
   הוא עכשיו `HIDDEN_DRAWING_PRINT` — „אנחנו רק דפים להדפסה ולא מתוקשב" —
   והתוכנית נשארת כאן כמקור אמת אחד לדף המודפס ולבדיקות. */
import { isFirstQuadrant, type Point } from '../lib/coordinateMath';

/** The drawing plan, one array per stroke of the pencil. */
export const drawingStrokes: Point[][] = [
  // גוף המפרשית — טרפז שצלעותיו העליונה והתחתונה מקבילות לציר x
  [{ x: 1, y: 2 }, { x: 7, y: 2 }, { x: 6, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
  // התורן והמפרש — קו אנכי, ואז משולש ישר־זווית
  [{ x: 4, y: 2 }, { x: 4, y: 6 }, { x: 7, y: 3 }, { x: 4, y: 3 }],
];

/** Every point in plotting order — what the learner is asked for, one at a time. */
export const drawingPlan: Point[] = drawingStrokes.flat();

/** Exposed for tests: every stroke stays in the first quadrant, the outline that
    encloses the hull closes on itself, and no stroke is a single stray point. */
export function planIsWellFormed(): boolean {
  if (drawingStrokes.length < 2) return false;
  if (!drawingPlan.every(isFirstQuadrant)) return false;
  if (drawingStrokes.some((s) => s.length < 2)) return false;
  const hull = drawingStrokes[0]!;
  const first = hull[0]!;
  const last = hull[hull.length - 1]!;
  return first.x === last.x && first.y === last.y;
}
