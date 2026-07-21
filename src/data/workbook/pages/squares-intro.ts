import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const SQUARES_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided ultra-dense",
  title: "ריבועים, שטח, היקף וסיכום",
  subtitle: "השוואה, הזזה וטענות מתמטיות",
  content: `
<div class="cols-2">
<div aria-label="ריבוע ABCD" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 1, "label": "A"}, {"x": 6, "y": 1, "label": "B"}, {"x": 6, "y": 5, "label": "C"}, {"x": 2, "y": 5, "label": "D"}]' data-polygons='[{"points": [[2, 1], [6, 1], [6, 5], [2, 5]]}]' data-segments="[]" role="img">
</div>
<section class="q-card">
<h3>א. הריבוע ABCD.</h3>
<p>צלעות מקבילות ל־x: <span class="blank" style="--blank-width:8ch"></span></p>
<p>אורך צלע: <span class="blank" style="--blank-width:3ch"></span></p>
<p>היקף: <span class="blank" style="--blank-width:4ch"></span> יח' | שטח: <span class="blank" style="--blank-width:4ch"></span> יח"ר</p>
<p>כיצד יודעים שזה ריבוע?</p>
<div class="answer-line">
</div>
</section>
</div>
<section class="q-card">
<h3>ב. חשבו שטח והיקף לשני המלבנים.</h3>
<div class="cols-2">
<div><b>מלבן א:</b> <span class="math-ltr" dir="ltr">(1,1),(7,1),(7,3),(1,3)</span>
<div aria-label="מערכת צירים ברביע הראשון" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 1, "y": 1}, {"x": 7, "y": 1}, {"x": 7, "y": 3}, {"x": 1, "y": 3}]' data-polygons='[{"points": [[1, 1], [7, 1], [7, 3], [1, 3]]}]' data-segments="[]" role="img">
</div>
<p>היקף=<span class="blank" style="--blank-width:4ch"></span> יח' שטח=<span class="blank" style="--blank-width:4ch"></span> יח"ר</p>
<div class="calc-box calc-box--slim"><b>דרך החישוב:</b> <span class="blank" style="--blank-width:24ch"></span></div>
</div>
<div><b>מלבן ב:</b> <span class="math-ltr" dir="ltr">(2,1),(5,1),(5,5),(2,5)</span>
<div aria-label="מערכת צירים ברביע הראשון" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 1}, {"x": 5, "y": 1}, {"x": 5, "y": 5}, {"x": 2, "y": 5}]' data-polygons='[{"points": [[2, 1], [5, 1], [5, 5], [2, 5]]}]' data-segments="[]" role="img">
</div>
<p>היקף=<span class="blank" style="--blank-width:4ch"></span> יח' שטח=<span class="blank" style="--blank-width:4ch"></span> יח"ר</p>
</div>
</div>
<p>האם אותו שטח מחייב אותו היקף? <span class="blank" style="--blank-width:6ch"></span></p>
</section>
<div class="cols-2">
<section class="q-card">
<h3>ג. הזיזו את הריבוע (1,1),(4,1),(4,4),(1,4) - 3 ימינה ו־2 למעלה.</h3>
<p>A′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> B′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>C′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> D′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>היקף=<span class="blank" style="--blank-width:4ch"></span> יח' שטח=<span class="blank" style="--blank-width:4ch"></span> יח"ר</p>
<p>מה נשאר זהה? <span class="blank" style="--blank-width:10ch"></span></p>
</section>
<section class="q-card">
<h3>ד. A(2,2), B(2,6), C(7,6). מצאו D למלבן.</h3>
<p>D=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>קטעים מקבילים ל־x: <span class="blank" style="--blank-width:8ch"></span></p>
<p>היקף=<span class="blank" style="--blank-width:4ch"></span> יח' שטח=<span class="blank" style="--blank-width:4ch"></span> יח"ר</p>
<p>הזיזו יחידה ימינה - קודקודים חדשים:</p>
<div class="answer-line">
</div>
</section>
</div>
<section class="q-card">
<h3>ה. תמיד / לפעמים / לעולם לא - הקיפו והסבירו.</h3>
<div class="always-row"><span>1. אם לשתי נקודות אותו שיעור x, הקטע ביניהן מקביל לציר y.</span>
<div class="choice-row"><span class="choice">תמיד</span><span class="choice">לפעמים</span><span class="choice">לעולם לא</span>
</div><span class="reason-line"></span>
</div>
<div class="always-row"><span>2. אם לשתי נקודות אותו שיעור y, הן ממוקמות באותו גובה.</span>
<div class="choice-row"><span class="choice">תמיד</span><span class="choice">לפעמים</span><span class="choice">לעולם לא</span>
</div><span class="reason-line"></span>
</div>
<div class="always-row"><span>3. אם שני שיעורי נקודה זהים, היא ממוקמת על ציר.</span>
<div class="choice-row"><span class="choice">תמיד</span><span class="choice">לפעמים</span><span class="choice">לעולם לא</span>
</div><span class="reason-line"></span>
</div>
<div class="always-row"><span>4. הזזה של מלבן משנה את שטחו.</span>
<div class="choice-row"><span class="choice">תמיד</span><span class="choice">לפעמים</span><span class="choice">לעולם לא</span>
</div><span class="reason-line"></span>
</div>
<div class="always-row"><span>5. שני מלבנים בעלי אותו שטח הם בעלי אותו היקף.</span>
<div class="choice-row"><span class="choice">תמיד</span><span class="choice">לפעמים</span><span class="choice">לעולם לא</span>
</div><span class="reason-line"></span>
</div>
</section>
`,
});
