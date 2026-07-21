import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const MOVE_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "הזזה של נקודות",
  subtitle: "איזה שיעור משתנה בכל כיוון",
  content: `
<div class="rule-box">ימינה או שמאלה משנות את שיעור x. למעלה או למטה משנות את שיעור y.
</div>
<section class="q-card">
<h3>א. הקיפו את התשובה הנכונה.</h3>
<div class="mc-stack">
<div><span class="math-ltr" dir="ltr">A(2,4)</span> אחרי 3 ימינה: 
<div class="choice-row"><span class="choice"><span class="math-ltr" dir="ltr">(5,4)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(2,7)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(3,4)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(2,1)</span></span>
</div>
</div>
<div><span class="math-ltr" dir="ltr">B(6,3)</span> אחרי 4 שמאלה: 
<div class="choice-row"><span class="choice"><span class="math-ltr" dir="ltr">(2,3)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(6,7)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(4,3)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(6,0)</span></span>
</div>
</div>
<div><span class="math-ltr" dir="ltr">C(3,2)</span> אחרי 3 למעלה: 
<div class="choice-row"><span class="choice"><span class="math-ltr" dir="ltr">(3,5)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(6,2)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(3,0)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(1,2)</span></span>
</div>
</div>
<div><span class="math-ltr" dir="ltr">D(7,5)</span> אחרי 2 למטה: 
<div class="choice-row"><span class="choice"><span class="math-ltr" dir="ltr">(7,3)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(5,5)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(7,7)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(2,5)</span></span>
</div>
</div>
</div>
</section>
<section class="q-card">
<h3>ב. השלימו את הנקודה שמתקבלת.</h3>
<div class="cols-2 task-grid">
<div><span class="math-ltr" dir="ltr">(2,3)</span> - 4 ימינה ← <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>
</div>
<div><span class="math-ltr" dir="ltr">(7,4)</span> - 5 שמאלה ← <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>
</div>
<div><span class="math-ltr" dir="ltr">(5,1)</span> - 4 למעלה ← <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>
</div>
<div><span class="math-ltr" dir="ltr">(3,6)</span> - 3 למטה ← <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>
</div>
</div>
</section>
<section class="q-card">
<h3>ג. מסלול: מ־P(2,1), 4 ימינה ואז 3 למעלה.</h3>
<div class="cols-2">
<div aria-label="מערכת צירים ברביע הראשון" class="coordinate-grid grid-md" data-arrows='[{"from": [2, 1], "to": [6, 1]}, {"from": [6, 1], "to": [6, 4]}]' data-labelboxes="[]" data-points='[{"x": 2, "y": 1, "label": "P"}, {"x": 6, "y": 1, "label": ""}, {"x": 6, "y": 4, "label": ""}]' data-polygons="[]" data-segments="[]" role="img">
</div>
<div>
<p>נקודת ביניים: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>נקודה סופית: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>בשלב הראשון השתנה: <span class="blank" style="--blank-width:4ch"></span></p>
<p>בשלב השני השתנה: <span class="blank" style="--blank-width:4ch"></span></p>
</div>
</div>
</section>
<section class="q-card">
<h3>ד. שאלה הפוכה: <span class="math-ltr" dir="ltr">K(6,5)</span> התקבלה לאחר הזזה של 3 ימינה. מהי נקודת המקור?</h3>נקודת המקור: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>
</section>
`,
});
