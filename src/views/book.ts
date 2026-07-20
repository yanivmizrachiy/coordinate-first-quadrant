import { elem, fromHTML } from '../lib/dom';
import { navigate } from '../router';
import { hydrateGrids } from '../lib/coordinateGrid';
import { WORKBOOK, TOTAL_PAGES } from '../data/workbook';
import type { ViewContext } from './context';

export function book({ outlet, setTitle }: ViewContext): void {
  setTitle('החוברת המלאה');
  const c = elem('div', { class: 'container' });

  c.append(
    elem('div', { class: 'toolbar-row no-print' },
      linkBtn('☰ תוכן העניינים', () => navigate('#/workbook')),
      actionBtn(`🖨️ הדפסת כל ${TOTAL_PAGES} העמודים`, () => window.print()),
    ),
  );

  const bookEl = elem('div', { class: 'book' });
  for (const page of WORKBOOK) {
    bookEl.append(fromHTML(page.html));
  }
  hydrateGrids(bookEl);
  c.append(bookEl);
  outlet.append(c);
  window.scrollTo({ top: 0 });
}

function actionBtn(text: string, onClick: () => void): HTMLElement {
  const b = elem('button', { class: 'iconbtn', type: 'button', text });
  b.addEventListener('click', onClick);
  return b;
}
function linkBtn(text: string, onClick: () => void): HTMLElement {
  const b = elem('button', { class: 'iconbtn iconbtn--primary', type: 'button', text });
  b.addEventListener('click', onClick);
  return b;
}
