import { elem } from '../lib/dom';
import { printPages } from '../lib/printPages';

/* בחירת צבע להדפסה — „רק אם לוחצים על כפתור הדפסה יש אפשרות לבחור בין
   הדפסה בצבע לבין הדפסה בשחור-לבן". התצוגה על המסך תמיד צבעונית; השאלה
   נשאלת ברגע ההדפסה בלבד, בחלונית קטנה עם שתי תשובות. */

export function openPrintChoice(pages: ReadonlySet<number> | 'all'): void {
  const overlay = elem('div', { class: 'pick', role: 'presentation' });
  const modal = elem('div', {
    class: 'pick__modal pick__modal--choice', role: 'dialog', 'aria-modal': 'true',
    'aria-label': 'בחירת צבע להדפסה', dir: 'rtl',
  });

  const closeBtn = elem('button', {
    class: 'btn btn--ghost btn--sm pick__close', type: 'button', text: 'ביטול ✕', 'aria-label': 'ביטול',
  }) as HTMLButtonElement;

  const colourBtn = elem('button', { class: 'btn btn--gold', type: 'button', text: '🖨️ הדפסה בצבע' }) as HTMLButtonElement;
  const bwBtn = elem('button', { class: 'btn btn--ghost', type: 'button', text: '🖨️ הדפסה בשחור־לבן' }) as HTMLButtonElement;

  const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') close(); };
  const opener = document.activeElement as HTMLElement | null;
  function close(): void {
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('hashchange', close);
    overlay.remove();
    opener?.focus?.();
  }
  const go = (bw: boolean): void => { close(); printPages(pages, bw); };
  colourBtn.addEventListener('click', () => go(false));
  bwBtn.addEventListener('click', () => go(true));
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);
  window.addEventListener('hashchange', close);

  modal.append(
    elem('div', { class: 'pick__head' },
      elem('strong', { class: 'pick__title', text: 'איך להדפיס?' }),
      closeBtn,
    ),
    elem('div', { class: 'pick__choice' }, colourBtn, bwBtn),
  );
  overlay.append(modal);
  document.body.append(overlay);
  colourBtn.focus();
}
