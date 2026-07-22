import type { WorkbookPageContent } from '../types';
import { sheet, blank, ltr, pair, grid } from '../authoring';

/* Reading a graph of points in the first quadrant — the genre Yaniv sent from
   the national tests. A real pair of axes with real names, and every question
   answered by reading one point off the drawing. */
export const GRAPH_READING_INTRO: WorkbookPageContent = sheet({
  sectionClass: 'sheet guided',
  title: 'קוראים תיאור גרפי של נקודות',
  subtitle: 'כל נקודה בגרף היא זוג סדור, וכל שיעור אומר משהו',
  content: `
<div class="rule-box completion-intro">
<div class="completion-sentence">בגרף של נתונים, ערך ה־${ltr('x')} אומר <b>מתי</b> או <b>כמה</b>, ושיעור ה־${ltr('y')} אומר את ה${blank(6, 'concept')} שהתקבלה.</div>
<div class="completion-sentence">כל נקודה בגרף נכתבת כזוג ${blank(5, 'concept')}, בדיוק כמו במערכת הצירים.</div>
</div>
<section class="q-card">
<h3>א. שמונה תלמידים מדדו כמה דקות למדו וכמה שאלות פתרו.</h3>
${grid({
  size: 'lg',
  axisX: 'דקות למידה (עשרות)',
  axisY: 'שאלות שנפתרו',
  label: 'גרף נקודות: דקות למידה מול מספר שאלות שנפתרו',
  points: [
    { x: 1, y: 2, label: 'A' },
    { x: 2, y: 3, label: 'B' },
    { x: 3, y: 3, label: 'C' },
    { x: 4, y: 5, label: 'D' },
    { x: 6, y: 5, label: 'E' },
    { x: 7, y: 6, label: 'F' },
  ],
})}
<ul class="tasks compact">
<li>שיעורי הנקודה ${ltr('D')} הם ${pair('D')}, כלומר 40 דקות למידה ו־${blank(3, 'number')} שאלות.</li>
<li>הנקודה ${blank(3, 'letter')} מתארת את התלמיד שפתר את מספר השאלות הגדול ביותר.</li>
<li>לשתי הנקודות ${ltr('B')} ו־${ltr('C')} יש שיעור ${blank(3, 'letter')} זהה, כלומר שני התלמידים פתרו אותו מספר שאלות.</li>
<li>לשתי הנקודות ${ltr('D')} ו־${ltr('E')} יש שיעור ${ltr('y')} זהה, אבל ערך ה־${ltr('x')} של ${ltr('E')} ${blank(5, 'relation')}.</li>
</ul>
</section>
<section class="q-card">
<h3>ב. השלימו לפי הגרף.</h3>
<ul class="tasks compact">
<li>ככל שערך ה־${ltr('x')} גדל, שיעור ה־${ltr('y')} בדרך כלל ${blank(5, 'relation')}.</li>
<li>ההפרש בין שיעור ה־${ltr('y')} של ${ltr('F')} ובין שיעור ה־${ltr('y')} של ${ltr('A')} הוא ${ltr('6 − 2 =')} ${blank(3, 'number')} שאלות.</li>
<li>סמנו על הגרף נקודה ${ltr('G')} של תלמיד שלמד 50 דקות ופתר 4 שאלות: ${pair('G')}.</li>
<li>הנקודה שסימנתם ממוקמת ${blank(5, 'direction')} לנקודה ${ltr('D')}.</li>
</ul>
</section>
`,
});
