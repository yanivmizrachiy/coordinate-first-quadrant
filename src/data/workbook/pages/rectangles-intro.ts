import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const RECTANGLES_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "מלבנים במערכת הצירים",
  subtitle: "קודקודים, צלעות מקבילות, היקף ושטח",
  content: `
<div class="cols-2">
<div aria-label="מלבן ABCD" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 1, "y": 1, "label": "A"}, {"x": 6, "y": 1, "label": "B"}, {"x": 6, "y": 4, "label": "C"}, {"x": 1, "y": 4, "label": "D"}]' data-polygons='[{"points": [[1, 1], [6, 1], [6, 4], [1, 4]]}]' data-segments="[]" role="img">
</div>
<div>
<section class="q-card">
<h3>א. לפי הגרף.</h3>
<p>קודקודים עם אותו x: <span class="blank" style="--blank-width:10ch"></span></p>
<p>קודקודים עם אותו y: <span class="blank" style="--blank-width:10ch"></span></p>
<p>צלעות מקבילות ל־x: <span class="blank" style="--blank-width:8ch"></span></p>
<p>צלעות מקבילות ל־y: <span class="blank" style="--blank-width:8ch"></span></p>
</section>
<section class="q-card">
<h3>ב. אורכים ושטח.</h3>
<p>AB=<span class="blank" style="--blank-width:3ch"></span>, BC=<span class="blank" style="--blank-width:3ch"></span></p>
<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div><div class="calc-final"><span>ההיקף: <span class="math-ltr" dir="ltr">P</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח'</span><span>השטח: <span class="math-ltr" dir="ltr">S</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח"ר</span></div></div>
</section>
</div>
</div>
<section class="q-card">
<h3>ג. הזיזו את המלבן 1 ימינה ו־2 למעלה.</h3>
<div class="cols-2">
<div>
<p>A′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> B′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>C′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> D′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
</div>
<div>
<p>מה השתנה? <span class="blank" style="--blank-width:12ch"></span></p>
<p>מה נשאר זהה? <span class="blank" style="--blank-width:12ch"></span></p>
<p>אורכים / היקף / שטח: <span class="blank" style="--blank-width:12ch"></span> יח'</p>
</div>
</div>
</section>
<div class="cols-2">
<section class="q-card">
<h3>ד. קודקוד חסר: P(2,2), Q(7,2), R(7,5). מצאו S והסבירו.</h3>
<div aria-label="מערכת צירים ברביע הראשון" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 2, "label": "P"}, {"x": 7, "y": 2, "label": "Q"}, {"x": 7, "y": 5, "label": "R"}]' data-polygons="[]" data-segments='[{"from": [2, 2], "to": [7, 2]}, {"from": [7, 2], "to": [7, 5]}]' role="img">
</div>
<p class="axis-answer-box">הקודקוד החסר: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div><div class="calc-final"><span>ההיקף: <span class="math-ltr" dir="ltr">P</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח'</span><span>השטח: <span class="math-ltr" dir="ltr">S</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח"ר</span></div></div>
</section>
<section class="q-card">
<h3>ה. עבור A(2,2), B(7,2), C(7,5) - הקיפו את הקודקוד הרביעי והסבירו.</h3>
<div class="choice-row"><span class="choice"><span class="math-ltr" dir="ltr">(2,5)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(5,2)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(5,7)</span></span>
</div>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</section>
</div>
`,
});
