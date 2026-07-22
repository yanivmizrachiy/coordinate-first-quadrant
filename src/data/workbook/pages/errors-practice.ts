import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const ERRORS_PRACTICE: WorkbookPageContent = sheet({
  sectionClass: "sheet practice",
  title: "זיהוי ותיקון טעויות",
  subtitle: "מנסחים כללים מדויקים ומתקנים חשיבה שגויה",
  content: `
<div class="two-col">
<section class="q-card">
<h3>החלפת סדר</h3>
<p>דניאל התבקש לסמן את <span class="math-ltr" dir="ltr">(4,2)</span> אך סימן את <span class="math-ltr" dir="ltr">(2,4)</span>.</p>
<p>מה הייתה הטעות? <span class="blank" style="--blank-width:20ch"></span></p>
<p>כתבו הוראה קצרה שתמנע את הטעות.</p>
<div class="answer-line">
</div>
</section>
<section class="q-card">
<h3>טעות בצירים</h3>
<p>נועה אמרה: “כל נקודה על ציר <span class="math-ltr" dir="ltr">x</span> מקיימת <span class="math-ltr" dir="ltr">x=0</span>”.</p>
<p>תקנו את המשפט:</p>
<div class="answer-line">
</div>
<p>תנו דוגמה לנקודה על ציר <span class="math-ltr" dir="ltr">x</span>: <span class="blank" style="--blank-width:10ch"></span></p>
</section>
<section class="q-card">
<h3>טעות בהזזה</h3>
<p>מ־<span class="math-ltr" dir="ltr">(3,2)</span> זזים 4 ימינה. יואב כתב <span class="math-ltr" dir="ltr">(7,6)</span>.</p>
<p>מה צריך להישאר זהה? <span class="blank" style="--blank-width:10ch"></span></p>
<p>התשובה הנכונה: <span class="blank" style="--blank-width:10ch"></span></p>
</section>
<section class="q-card">
<h3>טעות בקטעים</h3>
<p>נאמר שהקטע בין <span class="math-ltr" dir="ltr">(2,1)</span> ל־<span class="math-ltr" dir="ltr">(2,5)</span> מקביל לציר <span class="math-ltr" dir="ltr">x</span>.</p>
<p>האם המשפט נכון? <span class="blank" style="--blank-width:8ch"></span></p>
<p>תקנו ונמקו בעזרת הביטוי “שיעור <span class="math-ltr" dir="ltr">x</span> זהה”.</p>
<div class="answer-line">
</div>
</section>
<section class="q-card span-2">
<h3>טעות במלבן</h3>
<p>שלושה קודקודים של מלבן הם <span class="math-ltr" dir="ltr">(1,1), (6,1), (6,4)</span>. איתי הציע את <span class="math-ltr" dir="ltr">(2,4)</span> כקודקוד הרביעי.</p>
<p>הקודקוד הנכון: <span class="blank" style="--blank-width:10ch"></span></p>
<p>הסבירו באמצעות האורך והרוחב של המלבן.</p>
<div class="answer-line">
</div>
</section>
<section class="q-card span-2">
<h3>בודקים ניסוח</h3>
<p>החליפו את הביטוי הלא מדויק “שיעור <span class="math-ltr" dir="ltr">y</span> קטן פי 2” בניסוח חד־משמעי:</p>
<p><span class="blank" style="--blank-width:32ch"></span></p>
</section>
</div>
<section class="q-card">
<h3>טעות בנקודה שעל ציר</h3>
<p>אורי אמר: „הנקודה <span class="math-ltr" dir="ltr">(0,7)</span> ממוקמת על ציר <span class="math-ltr" dir="ltr">x</span>”.</p>
<p>תקנו את המשפט:</p>
<div class="answer-line"></div>
<ul class="tasks">
<li>הנקודה <span class="math-ltr" dir="ltr">(0,7)</span> ממוקמת על ציר <span class="blank" data-missing="letter" style="--blank-width:3ch"></span>.</li>
<li>אצל כל נקודה שעל ציר <span class="math-ltr" dir="ltr">y</span>, שיעור <span class="math-ltr" dir="ltr">x</span> שווה ל־<span class="blank" data-missing="number" style="--blank-width:3ch"></span>.</li>
<li>נקודה שממוקמת על שני הצירים יחד היא <span class="blank" data-missing="concept" style="--blank-width:7ch"></span> הצירים.</li>
</ul>
</section>
`,
});
