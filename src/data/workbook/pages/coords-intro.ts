import type { WorkbookPageContent } from '../types';
import { sheet, blank, ltr, pair, grid } from '../authoring';

export const COORDS_INTRO: WorkbookPageContent = sheet({
  sectionClass: 'sheet guided dense',
  title: 'שיעור x ושיעור y',
  subtitle: 'קוראים את מיקום הנקודה לפי שני מספרים',
  content: `
<div class="rule-box">שיעור ${ltr('x')} מתאר את המיקום האופקי, והוא גם ה<b>מרחק</b> של הנקודה מציר ${ltr('y')}.<br>
שיעור ${ltr('y')} מתאר את המיקום האנכי, והוא גם ה<b>מרחק</b> של הנקודה מציר ${ltr('x')}.
</div>
<section class="q-card">
<h3>א. דוגמה: הנקודה ${ltr('A(4,3)')}.</h3>
${grid({
  size: 'md',
  label: 'הנקודה A(4,3) ושני קווים מקווקווים ממנה: אחד אל ציר x ואחד אל ציר y, עם המרחק המסומן על כל אחד',
  points: [{ x: 4, y: 3, label: 'A(4,3)' }],
  // One dashed line to EACH axis: the pair of them is what makes a coordinate
  // visible as a distance — with only the drop to ציר x, half the idea is missing.
  segments: [
    { from: [4, 0], to: [4, 3], dashed: true, type: 'guide' },
    { from: [0, 3], to: [4, 3], dashed: true, type: 'guide' },
  ],
  // Each distance label is tied to the line it measures, so there is never a
  // question of which dashed line a box is talking about.
  labelboxes: [
    { text: 'שיעור x = 4', at: [2, 0.8] },
    { text: 'שיעור y = 3', at: [6.6, 3.4] },
    { text: "מרחק 4 יח'", at: [2, 3.9], to: [2, 3] },
    { text: "מרחק 3 יח'", at: [6.1, 1.3], to: [4, 1.3] },
  ],
})}
</section>
<section class="q-card">
<h3>ב. מרחק מהצירים.</h3>
<ul class="tasks compact">
<li>הנקודה ${ltr('A')} רחוקה מציר ${ltr('y')} ${blank(4, 'number')} יחידות, וזה בדיוק שיעור ${ltr('x')} שלה.</li>
<li>הנקודה ${ltr('A')} רחוקה מציר ${blank(4, 'letter')} 3 יחידות, וזה בדיוק שיעור ${ltr('y')} שלה.</li>
<li>ככל שנקודה רחוקה יותר מציר ${ltr('y')}, שיעור ${ltr('x')} שלה ${blank(6, 'relation')}.</li>
<li>נקודה שרחוקה 6 יחידות מציר ${ltr('y')} ו־2 יחידות מציר ${ltr('x')} נכתבת ${pair()}.</li>
</ul>
</section>
<section class="q-card">
<h3>ג. סמנו כל נקודה על הסרטוט, כתבו לידה את שמה, וכתבו את הזוג הסדור שלה.</h3>
<ul class="tasks">
<li>בנקודה ${ltr('A')} שיעור ${ltr('x')} הוא 2, ושיעור ${ltr('y')} הוא 5. &nbsp; ${pair('A')}</li>
<li>נקודה ${ltr('B')} רחוקה 6 יחידות מציר ${ltr('y')} ו־2 יחידות מציר ${ltr('x')}. &nbsp; ${pair('B')}</li>
<li>נקודה ${ltr('C')} ממוקמת על ציר ${ltr('x')}, ושיעור ${ltr('x')} שלה 3. &nbsp; ${pair('C')}</li>
</ul>
${grid({ size: 'lg', label: 'מערכת צירים לסימון שלוש הנקודות' })}
</section>
`,
});
