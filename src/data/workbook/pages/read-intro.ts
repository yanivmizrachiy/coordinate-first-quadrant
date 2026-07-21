import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const READ_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "קוראים נקודות",
  subtitle: "ממיקום במערכת אל זוג סדור",
  content: `
<div aria-label="מערכת צירים עם שש נקודות A עד F" class="coordinate-grid grid-lg" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 1, "y": 2, "label": "A"}, {"x": 4, "y": 5, "label": "B"}, {"x": 7, "y": 1, "label": "C"}, {"x": 6, "y": 4, "label": "D"}, {"x": 3, "y": 3, "label": "E"}, {"x": 8, "y": 6, "label": "F"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
<section class="q-card">
<h3>א. השלימו את הטבלה לפי הגרף.</h3>
<table class="work-table center">
<tbody>
<tr><th>נקודה</th><th>שיעור x</th><th>שיעור y</th><th>זוג סדור</th></tr>
<tr><td>A</td><td></td><td></td><td></td></tr>
<tr><td>B</td><td></td><td></td><td></td></tr>
<tr><td>C</td><td></td><td></td><td></td></tr>
<tr><td>D</td><td></td><td></td><td></td></tr>
<tr><td>E</td><td></td><td></td><td></td></tr>
<tr><td>F</td><td></td><td></td><td></td></tr>
</tbody>
</table>
</section>
<div class="cols-2">
<section class="q-card">
<h3>ב. כתבו את שם הנקודה.</h3>
<ul class="tasks compact">
<li><span class="math-ltr" dir="ltr">x = 4, y = 5</span> ← <span class="blank" data-missing="letter" style="--blank-width:4ch"></span></li>
<li>ערך <span class="math-ltr" dir="ltr">x</span> שווה 7 ושיעור <span class="math-ltr" dir="ltr">y</span> שווה 1 ← <span class="blank" data-missing="letter" style="--blank-width:4ch"></span></li>
<li>שני שיעוריה שווים ל־3 ← <span class="blank" style="--blank-width:4ch"></span></li>
<li>שיעור y שלה הוא 6 ← <span class="blank" style="--blank-width:4ch"></span></li>
</ul>
</section>
<section class="q-card">
<h3>ג. איזו נקודה?</h3>
<p>הרחוקה ביותר ימינה: <span class="blank" style="--blank-width:4ch"></span></p>
<p>הגבוהה ביותר: <span class="blank" style="--blank-width:4ch"></span></p>
</section>
</div>
<section class="q-card">
<h3>ד. כתבו זוג נקודות שגם שיעור x שלהן שונה וגם שיעור y שלהן שונה.</h3>הנקודות: <span class="blank" style="--blank-width:5ch"></span> ו־<span class="blank" style="--blank-width:5ch"></span>
</section>
<section class="q-card">
<h3>ה. האם שתי נקודות קרובות זו לזו חייבות להיות בעלות שיעורים זהים? הסבירו.</h3>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</section>
`,
});
