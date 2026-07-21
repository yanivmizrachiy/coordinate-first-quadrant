import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const RECTANGLES_PRACTICE: WorkbookPageContent = sheet({
  sectionClass: "sheet practice",
  title: "מלבנים במערכת הצירים",
  subtitle: "קודקודים, צלעות אופקיות ואנכיות, היקף ושטח",
  content: `
<div class="two-col">
<section class="q-card">
<h3>משלימים מלבן</h3>
<p>נתונים שלושה קודקודים: <span class="math-ltr" dir="ltr">A(1,1), B(6,1), C(6,4)</span>.</p>
<div aria-label="שלושה קודקודים של מלבן" class="coordinate-grid grid-xs" data-arrows="[]" data-points='[{"x": 1, "y": 1, "label": "A", "dx": 10, "dy": -10}, {"x": 6, "y": 1, "label": "B", "dx": 10, "dy": -10}, {"x": 6, "y": 4, "label": "C", "dx": 10, "dy": -10}]' data-polygons="[]" data-segments='[{"from": [1, 1], "to": [6, 1], "type": "shape"}, {"from": [6, 1], "to": [6, 4], "type": "shape"}]' role="img">
</div>
<p class="axis-answer-box">סמנו את הקודקוד הרביעי <span class="math-ltr" dir="ltr">D</span> וכתבו את שיעוריו כזוג סדור: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
</section>
<section class="q-card">
<h3>אורכי צלעות</h3>
<div aria-label="מלבן PQRS במערכת צירים" class="coordinate-grid grid-xs" data-arrows="[]" data-points='[{"x": 2, "y": 2, "label": "P", "dx": 10, "dy": -10}, {"x": 7, "y": 2, "label": "Q", "dx": 10, "dy": -10}, {"x": 7, "y": 5, "label": "R", "dx": 10, "dy": -10}, {"x": 2, "y": 5, "label": "S", "dx": 10, "dy": -10}]' data-polygons='[{"points": [[2, 2], [7, 2], [7, 5], [2, 5]], "type": "shape"}]' data-segments="[]" role="img">
</div>
<ul class="tasks compact">
<li>אורך הצלע האופקית <span class="math-ltr" dir="ltr">PQ</span>: <span class="blank" style="--blank-width:4ch"></span> יחידות.</li>
<li>אורך הצלע האנכית <span class="math-ltr" dir="ltr">QR</span>: <span class="blank" style="--blank-width:4ch"></span> יחידות.</li>
<li>היקף המלבן: <span class="blank" style="--blank-width:5ch"></span> יחידות.</li>
<li>שטח המלבן: <span class="blank" style="--blank-width:5ch"></span> יחידות ריבועיות.</li>
</ul>
<div class="calc-box"><b>דרך החישוב (היקף ושטח):</b>
<div class="answer-line">
</div>
</div>
</section>
<section class="q-card span-2">
<h3>מזהים קודקודים</h3>
<p>למלבן צלעות מקבילות לצירים. שני קודקודים נגדיים הם <span class="math-ltr" dir="ltr">(1,2)</span> ו־<span class="math-ltr" dir="ltr">(7,5)</span>.</p>
<p>כתבו את שני הקודקודים האחרים כזוגות סדורים:</p>
<p><span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> &nbsp;&nbsp; <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>אורך המלבן: <span class="blank" style="--blank-width:4ch"></span> יחידות &nbsp; רוחב המלבן: <span class="blank" style="--blank-width:4ch"></span> יחידות</p>
<p>איזו מהנקודות הבאות נמצאת על <b>היקף</b> המלבן? הקיפו.</p>
<div class="choice-row"><span class="choice"><span class="math-ltr" dir="ltr">(4,2)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(3,3)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(8,5)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(2,6)</span></span>
</div>
</section>
<section class="q-card span-2">
<h3>בונים מלבן</h3>
<p>ציירו מלבן שאחד מקודקודיו הוא <span class="math-ltr" dir="ltr">(2,1)</span>, אורכו 4 יחידות ורוחבו 3 יחידות. כל הקודקודים חייבים להיות ברביע הראשון.</p>
<div aria-label="מערכת צירים ריקה לבניית מלבן" class="coordinate-grid grid-xs" data-arrows="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img">
</div>
<p class="axis-answer-box">כתבו את ארבעת הקודקודים כזוגות סדורים: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>היקף: <span class="blank" style="--blank-width:4ch"></span> יחידות &nbsp; שטח: <span class="blank" style="--blank-width:4ch"></span> יחידות ריבועיות.</p>
</section>
</div>
`,
});
