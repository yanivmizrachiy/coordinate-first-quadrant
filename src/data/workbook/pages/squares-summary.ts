import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

/* Split off ריבועים ומלבנים: five calculations, each with room for the working
   and its answer, do not fit on one sheet — and Yaniv's rule is that the
   working matters more than saving a page. */
export const SQUARES_SUMMARY: WorkbookPageContent = sheet({
  sectionClass: "sheet practice",
  title: "מלבן חסר, ומה תמיד נכון",
  subtitle: "משלימים קודקוד, ואז מכריעים בין תמיד, לפעמים ולעולם לא",
  content: `
<section class="q-card">
<h3>א. A(2,2), B(2,6), C(7,6). מצאו D למלבן.</h3>
<p>D=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>קטעים מקבילים ל־x: <span class="blank" style="--blank-width:8ch"></span></p>
<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div><div class="calc-final"><span>ההיקף: <span class="math-ltr" dir="ltr">P</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח'</span><span>השטח: <span class="math-ltr" dir="ltr">S</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח"ר</span></div></div>
<p>הזיזו יחידה ימינה - קודקודים חדשים:</p>
<div class="answer-line">
</div>
</section>
</div>
<section class="q-card">
<h3>ב. תמיד / לפעמים / לעולם לא - הקיפו והסבירו.</h3>
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
<section class="q-card span-2">
<h3>ג. תרגיל מסכם.</h3>
<p>מלבן וריבוע חולקים את הקודקוד <span class="math-ltr" dir="ltr">(2,2)</span>. לריבוע צלע באורך 3. למלבן אורך 5 ורוחב 2. כל הצלעות מקבילות לצירים.</p>
<p>ציירו אפשרות אחת לכל צורה וכתבו את קודקודיה.</p>
<div aria-label="מערכת צירים ריקה לתרגיל מסכם" class="coordinate-grid grid-xs" data-arrows="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img">
</div>
<p class="axis-answer-box">קודקודי הריבוע: <span class="blank" style="--blank-width:34ch"></span></p>
<p>קודקודי המלבן: <span class="blank" style="--blank-width:34ch"></span></p>
</section>
</div>
`,
});
