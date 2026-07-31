import type { WorkbookPageContent } from '../types';
import { sheet, blank, ltr, pair, colorGrid, wordBank, wordBlank } from '../authoring';
import { decodeTargets, decodeXMax, decodeYMax } from '../../../games/colorDecode';

/* פענוח צבעוני — הגרסה המודפסת. הדף הזה החליף שעשועון מקוון שבו צובעים תאים
   בלחיצה: יניב — „אנחנו רק דפים להדפסה ולא מתוקשב!!" (31.07.2026, כמו
   „ציור נסתר" ו„מילת הצופן"). אותה מיומנות בדיוק — צביעת תאים לפי זוגות
   סדורים — עכשיו בעיפרון, על רשת מודפסת. התאים (`decodeTargets`) זהים
   לאלה של השעשועון, והסמל המתגלה הוא סימן וי. */
const listText = decodeTargets.map((p) => `(${p.x},${p.y})`).join(' · ');

export const COLOR_DECODE_PRINT: WorkbookPageContent = sheet({
  sectionClass: 'sheet practice',
  title: 'פענוח צבעוני',
  subtitle: 'צובעים תאים לפי זוגות סדורים, ומגלים סמל נסתר',
  content: `
<div class="rule-box">
כל זוג סדור מתאים לתא אחד ברשת: המספר שמצד <b>שמאל</b> הוא ערך ${ltr('x')}, והמספר
שמצד <b>ימין</b> הוא שיעור ${ltr('y')}. צבעו בעיפרון את כל התאים שברשימה — ומהם
יתגלה סמל.
</div>
<section class="q-card">
<h3>א. צבעו את התאים שברשימה.</h3>
<p>צבעו את התאים: ${ltr(listText)}</p>
${colorGrid(decodeXMax, decodeYMax)}
${wordBank(['וי', 'איקס', 'משולש'])}
<p>הסמל שהתגלה הוא ${wordBlank('short', 'concept', 'מקום להשלמת שם הסמל שהתגלה')}.</p>
</section>
<section class="q-card">
<h3>ב. אחרי שהסמל התגלה — השלימו עליו.</h3>
<ul class="tasks compact">
<li>התא הנמוך ביותר שצבעתם הוא ${pair()}, וזה גם התא שבו הסמל מתחיל לעלות.</li>
<li>לשני התאים ${ltr('(1,4)')} ו־${ltr('(5,4)')} יש שיעור ${ltr('y')} ${blank(4, 'relation')}.</li>
<li>בחצי הימני של הסמל, ככל שערך ה־${ltr('x')} גדל, שיעור ה־${ltr('y')} ${blank(4, 'relation')}.</li>
<li>התא הגבוה ביותר בסמל ממוקם ${blank(5, 'direction')} מכל שאר התאים, והוא ${pair()}.</li>
<li>ההפרש בין שיעור ה־${ltr('y')} של התא הגבוה ${ltr('(6,5)')} ובין הנמוך ${ltr('(3,2)')} הוא ${blank(3, 'number')} יחידות.</li>
</ul>
</section>
`,
});
