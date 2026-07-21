import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const ORDERED_PAIR_DRILL: WorkbookPageContent = sheet({
  sectionClass: "sheet guided",
  title: "הזוג הסדור — סדר, סוגריים ותרגול",
  subtitle: "x מצד שמאל, y מצד ימין — יש סדר, ולכן זוג סדור",
  contentTag: 'div',
  content: `
<div class="rule-box">כל נקודה נכתבת כ<b>זוג סדור</b> בתוך סוגריים: <span class="math-ltr" dir="ltr">(x,y)</span>. המספר ה<b>שמאלי</b> הוא שיעור <span class="math-ltr" dir="ltr">x</span>, והמספר ה<b>ימני</b> הוא שיעור <span class="math-ltr" dir="ltr">y</span>. הסדר קובע — ולכן זהו זוג <b>סדור</b>.
</div>
<section class="q-card">
<h3>א. נתונה נקודה — כתבו את שיעוריה.</h3>
<ul class="tasks">
<li>נקודה <span class="math-ltr" dir="ltr">A(3,5)</span>: שיעור <span class="math-ltr" dir="ltr">x =</span> <span class="blank" style="--blank-width:3ch"></span>, שיעור <span class="math-ltr" dir="ltr">y =</span> <span class="blank" style="--blank-width:3ch"></span></li>
<li>נקודה <span class="math-ltr" dir="ltr">B(6,2)</span>: שיעור <span class="math-ltr" dir="ltr">x =</span> <span class="blank" style="--blank-width:3ch"></span>, שיעור <span class="math-ltr" dir="ltr">y =</span> <span class="blank" style="--blank-width:3ch"></span></li>
</ul>
</section>
<section class="q-card">
<h3>ב. נתונים שיעורים — כתבו את הזוג הסדור.</h3>
<ul class="tasks">
<li>שיעור <span class="math-ltr" dir="ltr">x</span> הוא 4 ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 7: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
<li>שיעור <span class="math-ltr" dir="ltr">x</span> הוא 8 ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 1: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
</ul>
</section>
<section class="q-card">
<h3>ג. הסדר משנה!</h3>
<p>האם נקודה <span class="math-ltr" dir="ltr">(2,6)</span> ונקודה <span class="math-ltr" dir="ltr">(6,2)</span> הן אותה נקודה? <span class="blank" style="--blank-width:6ch"></span></p>
<p>הסבירו מדוע:</p>
<div class="answer-line">
</div>
</section>
<section class="q-card">
<h3>ד. כתבו כל נקודה — האות משמאל לסוגריים.</h3>
<ul class="tasks">
<li>נקודה בשם <span class="math-ltr" dir="ltr">C</span> ששיעוריה 5 ו־3: <span class="pair math-ltr" dir="ltr">C(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
<li>נקודה בשם <span class="math-ltr" dir="ltr">D</span> ששיעוריה 0 ו־4: <span class="pair math-ltr" dir="ltr">D(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
</ul>
</section>
<section class="q-card">
<h3>ד. השלימו — מהזוג הסדור אל השיעורים.</h3>
<ul class="tasks">
<li>בזוג הסדור <span class="math-ltr" dir="ltr">(7,2)</span> שיעור <span class="math-ltr" dir="ltr">x</span> הוא <span class="blank" data-missing="number" style="--blank-width:3ch"></span>.</li>
<li>בזוג הסדור <span class="math-ltr" dir="ltr">(7,2)</span> המספר 2 הוא שיעור <span class="blank" data-missing="letter" style="--blank-width:3ch"></span>.</li>
<li>הזוג הסדור נכתב תמיד בתוך <span class="blank" data-missing="concept" style="--blank-width:7ch"></span>.</li>
</ul>
</section>
<section class="q-card">
<h3>ה. השלימו — מהשיעורים אל הזוג הסדור.</h3>
<ul class="tasks">
<li>שיעור <span class="math-ltr" dir="ltr">x</span> הוא 5, שיעור <span class="math-ltr" dir="ltr">y</span> הוא 5 &nbsp;←&nbsp; <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
<li>שיעור <span class="math-ltr" dir="ltr">x</span> הוא 9, שיעור <span class="math-ltr" dir="ltr">y</span> הוא 3 &nbsp;←&nbsp; <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
<li>שיעור <span class="math-ltr" dir="ltr">x</span> הוא 4, שיעור <span class="math-ltr" dir="ltr">y</span> הוא 6 &nbsp;←&nbsp; <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
</ul>
</section>
`,
});
