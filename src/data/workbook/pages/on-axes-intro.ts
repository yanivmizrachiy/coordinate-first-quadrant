import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const ON_AXES_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "נקודות על הצירים",
  subtitle: "מתי x=0 ומתי y=0",
  content: `
<div class="cols-3 rules">
<div class="rule-box completion-intro"><div class="completion-sentence">על ציר <span class="math-ltr" dir="ltr">x</span> שיעור <span class="math-ltr" dir="ltr">y</span> הוא <span class="word-blank word-short" data-missing="number" aria-label="מקום להשלמת המספר אפס"></span>.</div></div>
<div class="rule-box completion-intro"><div class="completion-sentence">על ציר <span class="word-blank word-short" data-missing="letter" aria-label="מקום להשלמת האות y"></span> ערך <span class="math-ltr" dir="ltr">x</span> הוא 0.</div></div>
<div class="rule-box completion-intro"><div class="completion-sentence">ראשית הצירים נכתבת <span class="pair math-ltr" dir="ltr">O(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>.</div></div>
</div>
<section class="q-card">
<h3>א. סמנו או בדקו את הנקודות: A(4,0), B(0,5), C(7,0), D(0,2), O(0,0), E(3,4).</h3>
<div aria-label="נקודות על הצירים וברביע" class="coordinate-grid grid-lg" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 4, "y": 0, "label": "A"}, {"x": 0, "y": 5, "label": "B"}, {"x": 7, "y": 0, "label": "C"}, {"x": 0, "y": 2, "label": "D"}, {"x": 0, "y": 0, "label": "O"}, {"x": 3, "y": 4, "label": "E"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
</section>
<section class="q-card">
<h3>ב. מיינו את הנקודות לטבלה.</h3>
<table class="work-table center">
<tbody>
<tr><th>על ציר x</th><th>על ציר y</th><th>ברביע ולא על ציר</th><th>ראשית</th></tr>
<tr><td class="tall"></td><td></td><td></td><td></td></tr>
</tbody>
</table>
</section>
<section class="q-card">
<h3>ג. השלימו.</h3>
<div class="cols-2 task-grid">
<div><span class="pair math-ltr" dir="ltr">P(6,<span class="pair-blank"></span>)</span> על ציר x.
</div>
<div><span class="pair math-ltr" dir="ltr">Q(<span class="pair-blank"></span>,4)</span> על ציר y.
</div>
<div>נקודה על ציר x עם <span class="math-ltr" dir="ltr">x=2</span>: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,0)</span>
</div>
<div>נקודה על ציר y עם <span class="math-ltr" dir="ltr">y=6</span>: <span class="pair math-ltr" dir="ltr">(0,<span class="pair-blank"></span>)</span>
</div>
</div>
</section>
<section class="q-card">
<h3>ד. האם O ממוקמת על ציר x, על ציר y או על שניהם?</h3>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</section>
`,
});
