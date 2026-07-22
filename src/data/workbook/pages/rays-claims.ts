import type { WorkbookPageContent } from '../types';
import { sheet, blank, ltr, pair, grid } from '../authoring';

/* From the misparim „זווית לכיתה ז'” unit: the claims, the two pupils who
   disagree, and the city where every street runs parallel to an axis. */
export const RAYS_CLAIMS: WorkbookPageContent = sheet({
  sectionClass: 'sheet practice',
  title: 'זוויות ברביע הראשון',
  subtitle: 'טענות — מכריעים בין שתי דעות ומתכננים שדרה חדשה',
  content: `
<section class="q-card">
<h3>א. שתי דעות — מי צודק?</h3>
<p>נתונות הנקודה ${ltr('A(0,0)')} והנקודה ${ltr('B(3,0)')}.</p>
<ul class="tasks compact">
<li><b>דנה</b> טוענת: „הנקודה ${ltr('C(3,5)')} יוצרת זווית ישרה ${ltr('ABC')}.”</li>
<li><b>יואב</b> טוען: „דווקא הנקודה ${ltr('C(0,5)')} מתאימה.”</li>
<li>סמנו את שתי הנקודות על הסרטוט ובדקו. צודק/צודקת: ${blank(5, 'letter')}.</li>
<li>הנימוק: הקטע ${ltr('AB')} מקביל לציר ${ltr('x')}, ולכן הקטע שיוצר איתו זווית ישרה חייב להיות ${blank(5, 'property')}.</li>
</ul>
${grid({
  size: 'md',
  label: 'הנקודות A ו־B, ומקום לבדוק את שתי ההצעות',
  points: [{ x: 0, y: 0, label: 'A' }, { x: 3, y: 0, label: 'B' }],
  segments: [{ from: [0, 0], to: [3, 0], type: 'shape' }],
})}
</section>
<section class="q-card">
<h3>ב. הקיפו: מה נכון לגבי כל טענה?</h3>
<p>הטענה <b>נכונה בהכרח</b> · <b>ייתכן שנכונה</b> · <b>לא ייתכן</b>.</p>
<div class="always-row"><span>1. שתי קרניים שיוצאות מראשית הצירים ועוברות דרך נקודות שעל אותו ציר יוצרות זווית ישרה.</span>
<span class="choice-row"><span class="choice">נכונה בהכרח</span><span class="choice">ייתכן שנכונה</span><span class="choice">לא ייתכן</span></span>
</div>
<div class="always-row"><span>2. קרן שעוברת דרך הנקודה ${ltr('(7,0)')} יוצרת זווית ישרה עם קרן שעוברת דרך נקודה שערך ה־${ltr('x')} שלה 0.</span>
<span class="choice-row"><span class="choice">נכונה בהכרח</span><span class="choice">ייתכן שנכונה</span><span class="choice">לא ייתכן</span></span>
</div>
<div class="always-row"><span>3. אם הזווית בין שתי קרניים היא זווית ישרה, אז אחת מהן ממוקמת על ציר ${ltr('x')} והשנייה על ציר ${ltr('y')}.</span>
<span class="choice-row"><span class="choice">נכונה בהכרח</span><span class="choice">ייתכן שנכונה</span><span class="choice">לא ייתכן</span></span>
</div>
</section>
<section class="q-card">
<h3>ג. שדרה חדשה בעיר.</h3>
<p>בעיר חדשה כל הרחובות ישרים ומקבילים לצירים. שדרת האורן יוצאת ממרכז העיר — ראשית הצירים — ועוברת דרך הכיכר שבנקודה ${ltr('(6,0)')}. מתכננים שדרה חדשה שתצא ממרכז העיר ותיצור עם שדרת האורן זווית ישרה.</p>
<ul class="tasks compact">
<li>שדרת האורן מקבילה לציר ${blank(3, 'letter')}, ולכן השדרה החדשה תהיה מקבילה לציר ${ltr('y')}.</li>
<li>שתי נקודות שהשדרה החדשה יכולה לעבור דרכן: ${pair()} ו־${pair()}.</li>
<li>בשתיהן ערך ה־${ltr('x')} הוא ${blank(3, 'number')}, וזה מה שמעמיד אותן על אותה שדרה.</li>
</ul>
</section>
`,
});
