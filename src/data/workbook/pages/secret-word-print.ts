import type { WorkbookPageContent } from '../types';
import { sheet, blank, ltr, pair, grid } from '../authoring';

/* מילת הצופן — הגרסה המודפסת. הדף הזה החליף שעשועון מקוון עם שדות הקלדה
   וכפתורי „בדקו": יניב — „המשימות שלנו רק להדפסה ולא מתוקשבות". אותה
   מיומנות (קריאת זוג סדור וזיהוי נקודה לפי תכונה), עכשיו על נייר: חמש
   אותיות מסומנות על מערכת אחת, חמש שאלות, והמילה נכתבת בסוף.

   האותיות במיקומן: נ(3,2) · ק(6,4) · ו(2,5) · ד(7,1) · ה(4,3) — המילה
   שמתקבלת, מימין לשמאל, היא „נקודה". */
export const SECRET_WORD_PRINT: WorkbookPageContent = sheet({
  sectionClass: 'sheet practice',
  title: 'מילת הצופן',
  subtitle: 'קוראים נקודות, מזהים תכונות — ומפענחים מילה',
  content: `
<section class="q-card">
<h3>א. חמש אותיות מוצפנות במערכת.</h3>
<p>לפניכם מערכת צירים ובה חמש נקודות, ולצד כל נקודה אות. כל תשובה נכונה חושפת אות אחת של מילת הצופן.</p>
${grid({
  size: 'lg',
  label: 'חמש נקודות מסומנות באותיות: נ במיקום (3,2), ק במיקום (6,4), ו במיקום (2,5), ד במיקום (7,1), ה במיקום (4,3)',
  points: [
    { x: 3, y: 2, label: 'נ' },
    { x: 6, y: 4, label: 'ק' },
    { x: 2, y: 5, label: 'ו' },
    { x: 7, y: 1, label: 'ד' },
    { x: 4, y: 3, label: 'ה' },
  ],
})}
</section>
<section class="q-card">
<h3>ב. מפענחים אות־אות.</h3>
<ul class="tasks">
<li>האות שממוקמת בנקודה ${ltr('(3,2)')} היא ${blank(2, 'letter')}.</li>
<li>שיעור ה־${ltr('x')} של הנקודה של האות <strong>ו</strong> הוא ${blank(3, 'number')}.</li>
<li>הנקודה של האות <strong>ד</strong> היא הנקודה ה${blank(5, 'property')} ביותר במערכת.</li>
<li>האות שממוקמת בנקודה ${ltr('(4,3)')} היא ${blank(2, 'letter')}.</li>
<li>הנקודה של האות <strong>ק</strong> רחוקה ${blank(3, 'number')} יחידות מציר ה־${ltr('y')}.</li>
</ul>
</section>
<section class="q-card">
<h3>ג. מילת הצופן.</h3>
<ul class="tasks compact">
<li>כתבו את חמש האותיות לפי סדר השאלות, מימין לשמאל: ${blank(10, 'concept')}.</li>
<li>סמנו את הנקודה של האות הראשונה במילה, וכתבו את שיעוריה: ${pair()}.</li>
</ul>
</section>
`,
});
