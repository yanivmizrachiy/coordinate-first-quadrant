import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const DISTANCE_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided ultra-dense",
  title: "מרחק נקודה מהצירים",
  subtitle: "מרחק לציר x, לציר y, אופקי ואנכי",
  content: `
<div class="cols-2 compact-top">
<div class="rule-box completion-intro">
<div class="completion-sentence">כדי להגיע אל ציר <span class="math-ltr" dir="ltr">y</span> משנים את ערך <span class="math-ltr" dir="ltr">x</span> ל־<span class="word-blank word-short" data-missing="number" aria-label="מקום להשלמת המספר אפס"></span>.</div>
<div class="completion-sentence">כדי להגיע אל ציר <span class="word-blank word-short" data-missing="letter" aria-label="מקום להשלמת האות x"></span> משנים את שיעור <span class="math-ltr" dir="ltr">y</span> ל־0.</div>
</div>
<div aria-label="מערכת צירים ברביע הראשון" class="coordinate-grid grid-sm" data-arrows='[{"from": [6, 4], "to": [0, 4], "label": "6 שמאלה"}, {"from": [6, 4], "to": [6, 0], "label": "4 למטה"}]' data-labelboxes="[]" data-points='[{"x": 6, "y": 4, "label": "P"}, {"x": 0, "y": 4, "label": ""}, {"x": 6, "y": 0, "label": ""}]' data-polygons="[]" data-segments="[]" role="img">
</div>
</div>
<section class="q-card">
<h3>א. השלימו את הטבלה.</h3>
<table class="work-table center small">
<tbody>
<tr><th>נקודה</th><th>מרחק לציר y</th><th>על ציר y</th><th>מרחק לציר x</th><th>על ציר x</th></tr>
<tr><td><span class="math-ltr" dir="ltr">A(3,5)</span></td><td></td><td></td><td></td><td></td></tr>
<tr><td><span class="math-ltr" dir="ltr">B(7,2)</span></td><td></td><td></td><td></td><td></td></tr>
<tr><td><span class="math-ltr" dir="ltr">C(4,4)</span></td><td></td><td></td><td></td><td></td></tr>
<tr><td><span class="math-ltr" dir="ltr">D(1,6)</span></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table>
</section>
<section class="q-card">
<h3>ב. לאיזה ציר קרובה יותר כל נקודה?</h3>
<div class="task-grid">
<div>A: 
<div class="choice-row"><span class="choice">ציר x</span><span class="choice">ציר y</span><span class="choice">מרחקים זהים</span>
</div>
</div>
<div>B: 
<div class="choice-row"><span class="choice">ציר x</span><span class="choice">ציר y</span><span class="choice">מרחקים זהים</span>
</div>
</div>
<div>C: 
<div class="choice-row"><span class="choice">ציר x</span><span class="choice">ציר y</span><span class="choice">מרחקים זהים</span>
</div>
</div>
</div>
</section>
<div class="cols-2">
<section class="q-card">
<h3>ג. מרחק אופקי: A(2,5), B(7,5).</h3>
<p>השיעור הזהה: <span class="blank" style="--blank-width:4ch"></span></p>
<p>המרחק: <span class="blank" style="--blank-width:4ch"></span></p>
</section>
<section class="q-card">
<h3>ד. מרחק אנכי: C(4,1), D(4,6).</h3>
<p>השיעור הזהה: <span class="blank" style="--blank-width:4ch"></span></p>
<p>המרחק: <span class="blank" style="--blank-width:4ch"></span></p>
</section>
</div>
<section class="q-card">
<h3>ה. אורי חישב את המרחק בין (2,5) ל־(7,5) באמצעות 7+2. הסבירו ותקנו.</h3>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</section>
<section class="q-card">
<h3>ו. נקודה שמרחקה זהה משני הצירים - מה אפשר לומר על שיעוריה?</h3>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</section>
`,
});
