import { elem, fromHTML } from '../lib/dom';
import { navigate } from '../router';
import { hydrateGrids } from '../lib/coordinateGrid';
import { fitSheets } from '../lib/fitSheet';
import { printBar } from './printBar';
import { pageByNumber, TOTAL_PAGES, topicOfPage } from '../data/workbook';
import { lastPage, sheetZoom } from '../lib/storage';
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

    const sheetWrap = elem('div', { class: 'pageviewer__sheetwrap' });

    const zoomOut = elem('button', { class: 'zoombtn', type: 'button', text: '−', 'aria-label': 'הקטנת העמוד' });
    const zoomIn = elem('button', { class: 'zoombtn', type: 'button', text: '+', 'aria-label': 'הגדלת העמוד' });
    const zoomLabel = elem('button', { class: 'zoombtn zoombtn--label', type: 'button', text: 'התאמה למסך', title: 'חזרה להתאמה למסך' });
    const zoom = elem('div', { class: 'zoomer', role: 'group', 'aria-label': 'גודל התצוגה' }, zoomOut, zoomLabel, zoomIn);
    let cleanup: (() => void) | undefined;
    if (data) {
      sheetWrap.append(fromHTML(data.html));
      hydrateGrids(sheetWrap);
    fitSheets(sheetWrap);
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

    viewer.append(
      printBar({
        scope: 'page',
        current: page,
        root: () => sheetWrap,
        // One row, not two: the page is what the reader came for.
        lead: [
          linkBtn('☰ תוכן העניינים', () => navigate('#/workbook')),
          zoom,
          iconOnly('⛶', 'מסך מלא', () => toggleFullscreen(sheetWrap)),
        ],
      }),
      sheetWrap,
      nav,
    );
    c.append(viewer);
    outlet.append(c);
    window.scrollTo({ top: 0 });

    /* A4 is 1123px tall and a laptop viewport is not. Left alone the viewer
       shows two thirds of a page and asks the reader to scroll for the rest.
       „התאמה למסך” puts the whole sheet on screen; anyone who would rather have
       the text bigger and scroll can say so, and we remember which they chose.
       Only this view scales — the booklet stays true A4 for printing. */
    const roomForSheet = (): number => {
      const docTop = sheetWrap.getBoundingClientRect().top + window.scrollY;
      return window.innerHeight - docTop - nav.offsetHeight - 14;
    };
    const applyZoom = (): void => {
      const sheetEl = sheetWrap.querySelector<HTMLElement>('.sheet');
      if (!sheetEl) return;
      sheetWrap.style.height = '';
      const h = sheetEl.offsetHeight;
      const w = sheetEl.offsetWidth;
      if (!h || !w) return;
      const z = sheetZoom.get();
      const scale =
        z === 'fit'
          ? Math.max(0.4, Math.min(1, roomForSheet() / h, sheetWrap.clientWidth / w))
          : Math.min(z, sheetWrap.clientWidth / w);
      sheetWrap.style.setProperty('--sheet-scale', scale.toFixed(3));
      sheetWrap.style.height = `${Math.ceil(h * scale)}px`;
      zoomLabel.textContent = z === 'fit' ? 'התאמה למסך' : `${Math.round(scale * 100)}%`;
    };
    const step = (by: number): void => {
      const now = Number(getComputedStyle(sheetWrap).getPropertyValue('--sheet-scale')) || 1;
      sheetZoom.set(Math.min(1.6, Math.max(0.4, Math.round((now + by) * 20) / 20)));
      applyZoom();
    };
    zoomOut.addEventListener('click', () => step(-0.1));
    zoomIn.addEventListener('click', () => step(0.1));
    zoomLabel.addEventListener('click', () => { sheetZoom.set('fit'); applyZoom(); });

    applyZoom();
    // …and again once fitSheet has finished growing the drawings.
    const settle = window.setTimeout(applyZoom, 420);
    window.addEventListener('resize', applyZoom);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('resize', applyZoom);
      cleanup?.();
    };
  };
}

function iconOnly(glyph: string, label: string, onClick: () => void): HTMLElement {
  const b = elem('button', { class: 'iconbtn', type: 'button', text: glyph, 'aria-label': label, title: label });
  b.addEventListener('click', onClick);
  return b;
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
}
