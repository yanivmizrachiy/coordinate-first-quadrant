import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOTAL_PAGES } from '../data/workbook';
import { grayscale } from '../lib/storage';
import { printPages } from '../lib/printPages';
import { openPagePicker } from './pagePicker';
import { goToContents } from './tocSheet';

/* ===========================================================================
   סרגלי הקריאה — אותה שפה בדיוק כמו סרגלי דפי-העבודה של פרויקט הזוויות:
   נייבי דביק למעלה, חזרה לאתר מימין, הכותרת במרכז, והפעולות משמאל —
   „הורדה / הדפסה" בזהב, וכל השאר כפתורי מסגרת (ghost).

   שני סרגלים, כמו אצלם: סרגל החוברת המלאה (WsBookletAllBar) וסרגל הדף
   הבודד (WsReaderBar). ההורדה עוברת דרך חלון ההדפסה — „שמירה כ-PDF" היא
   יעד באותו חלון, ולכן כפתור אחד משרת את שתי הפעולות.
   =========================================================================== */

const BW = 'bw-print';

const ghost = (text: string, onClick: () => void): HTMLButtonElement => {
  const b = elem('button', { class: 'btn btn--ghost btn--sm', type: 'button', text }) as HTMLButtonElement;
  b.addEventListener('click', onClick);
  return b;
};
const gold = (text: string, onClick: () => void): HTMLButtonElement => {
  const b = elem('button', { class: 'btn btn--gold btn--sm', type: 'button', text }) as HTMLButtonElement;
  b.addEventListener('click', onClick);
  return b;
};

/** מעבר צבע / שחור-לבן — משנה את הדפים על המסך ובנייר, ונשמר לביקור הבא. */
const bwToggle = (): HTMLButtonElement => {
  const b = elem('button', { class: 'btn btn--ghost btn--sm', type: 'button' }) as HTMLButtonElement;
  const sync = (): void => {
    const on = document.body.classList.contains(BW);
    b.textContent = on ? 'תצוגה צבעונית' : 'תצוגת שחור־לבן';
    b.setAttribute('aria-pressed', String(on));
  };
  b.addEventListener('click', () => {
    const on = !document.body.classList.contains(BW);
    document.body.classList.toggle(BW, on);
    grayscale.set(on);
    sync();
  });
  sync();
  return b;
};

/** סרגל החוברת המלאה — המקבילה של WsBookletAllBar. */
export function bookletBar(): HTMLElement {
  return elem('div', { class: 'wsbar no-print', 'data-noprint': '' },
    elem('span', { class: 'wsbar__side' },
      ghost('‹ חזרה לאתר', () => navigate('#/')),
      ghost('☰ תוכן העניינים', goToContents),
    ),
    elem('span', { class: 'wsbar__title', text: `חוברת העבודה · ${TOTAL_PAGES} עמודים ממוספרים` }),
    elem('span', { class: 'wsbar__side wsbar__side--acts' },
      bwToggle(),
      ghost('דפים נבחרים', () => openPagePicker()),
      gold('הורדה / הדפסה', () => printPages('all')),
    ),
  );
}

/** סרגל הדף הבודד — המקבילה של WsReaderBar. */
export function readerBar(page: number): HTMLElement {
  const prev = ghost('› הקודם', () => navigate(`#/workbook/${page - 1}`));
  const next = ghost('הבא ‹', () => navigate(`#/workbook/${page + 1}`));
  prev.disabled = page <= 1;
  next.disabled = page >= TOTAL_PAGES;
  prev.classList.toggle('btn--disabled', prev.disabled);
  next.classList.toggle('btn--disabled', next.disabled);

  return elem('div', { class: 'wsbar no-print', 'data-noprint': '' },
    elem('span', { class: 'wsbar__side' },
      ghost('‹ חזרה לאתר', () => navigate('#/')),
      elem('span', { class: 'wsbar__nav' }, prev, next),
    ),
    elem('span', { class: 'wsbar__title', text: `דף עבודה מספר ${page} מתוך ${TOTAL_PAGES}` }),
    elem('span', { class: 'wsbar__side wsbar__side--acts' },
      bwToggle(),
      ghost('דפים נבחרים', () => openPagePicker([page])),
      gold('הורדה / הדפסה', () => window.print()),
    ),
  );
}
