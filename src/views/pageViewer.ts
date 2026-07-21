import { elem, fromHTML, clear } from '../lib/dom';
import { navigate } from '../router';
import { hydrateGrids } from '../lib/coordinateGrid';
import { pageByNumber, TOTAL_PAGES, topicOfPage } from '../data/workbook';
import { lastPage } from '../lib/storage';
import { gameById } from '../games';
import type { ViewContext } from './context';

export function pageViewer(n: number): (ctx: ViewContext) => (() => void) | void {
  return ({ outlet, setTitle }) => {
    const page = Math.min(Math.max(1, Math.trunc(n) || 1), TOTAL_PAGES);
    const data = pageByNumber(page);
    const topic = topicOfPage(page);
    setTitle(`עמוד ${page}${topic ? ' · ' + topic.title : ''}`);
    lastPage.set(page);

    const c = elem('div', { class: 'container' });
    const viewer = elem('div', { class: 'pageviewer' });

    const toolbar = elem('div', { class: 'toolbar-row no-print' },
      linkBtn('☰ תוכן העניינים', () => navigate('#/workbook')),
      actionBtn('🖨️ הדפסת העמוד', () => window.print()),
      actionBtn('⛶ מסך מלא', () => toggleFullscreen(sheetWrap)),
    );

    const sheetWrap = elem('div', { class: 'pageviewer__sheetwrap' });
    let cleanup: (() => void) | undefined;
    if (data) {
      sheetWrap.append(fromHTML(data.html));
      hydrateGrids(sheetWrap);
      if (data.gameId) {
        const host = sheetWrap.querySelector<HTMLElement>('[data-game-host]');
        const g = gameById(data.gameId);
        if (host && g) cleanup = g.mount(host);
      }
    } else {
      sheetWrap.append(elem('div', { class: 'empty-note', text: 'העמוד לא נמצא.' }));
    }

    const nav = elem('div', { class: 'pagenav no-print' });
    const prev = actionBtn('▶ הקודם', () => navigate(`#/workbook/${page - 1}`));
    const next = actionBtn('הבא ◀', () => navigate(`#/workbook/${page + 1}`));
    (prev as HTMLButtonElement).disabled = page <= 1;
    (next as HTMLButtonElement).disabled = page >= TOTAL_PAGES;

    const select = elem('select', { 'aria-label': 'בחירת עמוד' }) as HTMLSelectElement;
    for (let i = 1; i <= TOTAL_PAGES; i++) {
      const opt = elem('option', { value: String(i), text: `עמוד ${i}` }) as HTMLOptionElement;
      if (i === page) opt.selected = true;
      select.append(opt);
    }
    select.addEventListener('change', () => navigate(`#/workbook/${select.value}`));

    nav.append(prev, elem('span', { class: 'pagenav__indicator', text: `${page} / ${TOTAL_PAGES}` }), select, next);

    viewer.append(toolbar, sheetWrap, nav);
    c.append(viewer);
    outlet.append(c);
    window.scrollTo({ top: 0 });
    return cleanup;
  };
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
function toggleFullscreen(elm: HTMLElement): void {
  if (!document.fullscreenElement) elm.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.().catch(() => {});
  void clear;
}
