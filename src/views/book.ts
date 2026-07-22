import { elem, fromHTML } from '../lib/dom';
import { navigate } from '../router';
import { hydrateGrids } from '../lib/coordinateGrid';
import { fitSheets } from '../lib/fitSheet';
import { printBar } from './printBar';
import { WORKBOOK } from '../data/workbook';
import { gameById } from '../games';
import { renderCoverSheet } from './coverSheet';
import { renderTocSheet } from './tocSheet';
import type { ViewContext } from './context';

export function book({ outlet, setTitle }: ViewContext): (() => void) | void {
  setTitle('החוברת המלאה');
  const c = elem('div', { class: 'container' });

  const bookEl = elem('div', { class: 'book' });

  // One control row, like the page viewer: a second one only eats the sheet.
  c.append(
    printBar({
      scope: 'book',
      root: () => bookEl,
      lead: [linkBtn('☰ תוכן העניינים', () => navigate('#/workbook'))],
    }),
  );

  // Approved cover first, then all worksheets — no math content is altered.
  bookEl.append(renderCoverSheet(), renderTocSheet());
  for (const page of WORKBOOK) {
    bookEl.append(fromHTML(page.html));
  }
  hydrateGrids(bookEl);
    fitSheets(bookEl);

  // Game sheets host their interactive game inline, like any other page.
  const cleanups: Array<() => void> = [];
  for (const page of WORKBOOK) {
    if (!page.gameId) continue;
    const host = bookEl.querySelector<HTMLElement>(`#${page.id} [data-game-host]`);
    const g = gameById(page.gameId);
    if (host && g) cleanups.push(g.mount(host));
  }

  c.append(bookEl);
  outlet.append(c);
  window.scrollTo({ top: 0 });
  return () => { for (const fn of cleanups) fn(); };
}

function linkBtn(text: string, onClick: () => void): HTMLElement {
  const b = elem('button', { class: 'iconbtn iconbtn--primary', type: 'button', text });
  b.addEventListener('click', onClick);
  return b;
}
