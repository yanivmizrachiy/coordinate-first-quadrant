import { elem, fromHTML } from '../lib/dom';
import { hydrateGrids } from '../lib/coordinateGrid';
import { fitSheets } from '../lib/fitSheet';
import { WORKBOOK, TOPICS, TOTAL_PAGES } from '../data/workbook';
import { renderCoverSheet } from './coverSheet';
import { renderTocSheet } from './tocSheet';
import { openActionChooser } from './printChoice';
import type { ViewContext } from './context';

type ReaderMode = 'scroll' | 'single' | 'spread';
const SHEETS = TOTAL_PAGES + 2;
const PAPER_WIDTH = 793.701;
const ZOOMS = [75, 90, 100, 110, 125] as const;

/** Exactly one renderer for the printable authored workbook and the screen reader.
 * No copy of a worksheet or teacher-facing page is stored in the reader.
 * Index: 0 cover, 1 contents, 2..79 numbered pages 1..78.
 */
export function paperReader({ outlet, setTitle }: ViewContext): () => void {
  setTitle('מערכת צירים — הרביע הראשון');
  let current = 0;
  let mode: ReaderMode = 'scroll';
  let zoom = 100;
  let tocOpen = false;
  let frame = 0;

  const root = elem('section', {
    class: 'cr-reader', dir: 'rtl', tabindex: '-1',
    'aria-label': 'מערכת צירים — דפים להדפסה',
  });
  const bar = elem('header', { class: 'cr-bar no-print' });
  const toc = elem('nav', { class: 'cr-toc no-print', 'aria-label': 'תוכן עניינים – מערכת צירים' });
  const sheetViewport = elem('main', { class: 'cr-viewport', 'aria-label': 'דפי החוברת' });
  const pages = elem('div', { class: 'cr-pages', 'data-view': mode });
  const extras = elem('div', { class: 'cr-actions' });
  const status = elem('span', { class: 'cr-count', role: 'status', 'aria-live': 'polite' });
  const menuButton = elem('button', { type: 'button', 'aria-expanded': 'false', text: 'תוכן העניינים' });
  const previous = elem('button', { type: 'button', text: 'הקודם', 'aria-label': 'העמוד הקודם' }) as HTMLButtonElement;
  const next = elem('button', { type: 'button', text: 'הבא', 'aria-label': 'העמוד הבא' }) as HTMLButtonElement;
  const modeButtons = new Map<ReaderMode, HTMLButtonElement>();
  const zoomSelect = elem('select', { 'aria-label': 'גודל תצוגה' }) as HTMLSelectElement;
  for (const n of ZOOMS) zoomSelect.append(elem('option', { value: n, text: n + '%' }));
  zoomSelect.value = '100';

  const title = elem('strong', { class: 'cr-title', text: 'מערכת צירים — הרביע הראשון' });
  const nav = elem('div', { class: 'cr-navigation' }, previous, status, next);
  const views = elem('div', { class: 'cr-modes', role: 'group', 'aria-label': 'מצב תצוגה' });
  const changeView = (nextMode: ReaderMode): void => {
    mode = window.innerWidth < 680 && nextMode === 'spread' ? 'single' : nextMode;
    if (mode === 'scroll') current = 0;
    synchronize();
  };
  for (const [value, label] of [['scroll', 'גלילה'], ['single', 'עמוד'], ['spread', 'כפולה']] as const) {
    const button = elem('button', { type: 'button', text: label, 'aria-pressed': 'false' }) as HTMLButtonElement;
    button.addEventListener('click', () => changeView(value));
    views.append(button);
    modeButtons.set(value, button);
  }
  const fullScreen = elem('button', { type: 'button', text: 'מסך מלא' });
  fullScreen.addEventListener('click', () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void root.requestFullscreen?.().catch(() => {});
  });
  const toolbar = elem('div', { class: 'cr-toolbar' }, nav, views, zoomSelect, fullScreen);
  bar.append(menuButton, title, toolbar);

  const layout = elem('div', { class: 'cr-layout' });
  sheetViewport.append(pages);
  layout.append(toc, sheetViewport, extras);
  root.append(bar, layout);
  outlet.append(root);

  const cells = Array.from({ length: SHEETS }, (_, index) =>
    elem('article', {
      class: 'cr-cell', 'data-index': index,
      'aria-label': index === 0 ? 'שער' : index === 1 ? 'תוכן עניינים' : 'עמוד ' + (index - 1),
    }),
  );
  pages.append(...cells);

  const loaded = new Set<number>();
  const load = (index: number): void => {
    if (index < 0 || index >= SHEETS || loaded.has(index)) return;
    const cell = cells[index]!;
    let sheet: HTMLElement;
    if (index === 0) sheet = renderCoverSheet();
    else if (index === 1) sheet = renderTocSheet();
    else {
      const content = WORKBOOK[index - 2];
      if (!content) throw new Error('Missing workbook source for sheet ' + index);
      sheet = fromHTML(content.html).firstElementChild as HTMLElement;
    }
    cell.append(sheet);
    loaded.add(index);
    hydrateGrids(cell);
    fitSheets(cell);
    for (const img of cell.querySelectorAll('img')) {
      if (!img.complete) img.addEventListener('load', () => fitSheets(cell), { once: true });
    }
  };

  const visibilityObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) load(Number((entry.target as HTMLElement).dataset.index));
    }
  }, { rootMargin: '1100px 0px' });
  cells.forEach((cell) => visibilityObserver.observe(cell));

  const closeToc = (): void => {
    tocOpen = false;
    root.classList.remove('cr-toc-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  menuButton.addEventListener('click', () => {
    tocOpen = !tocOpen;
    root.classList.toggle('cr-toc-open', tocOpen);
    menuButton.setAttribute('aria-expanded', String(tocOpen));
  });
  const toIndex = (index: number): void => {
    current = Math.min(SHEETS - 1, Math.max(0, index));
    closeToc();
    if (mode === 'scroll') {
      load(current);
      cells[current]!.scrollIntoView({ block: 'start', behavior: 'instant' });
      updateCounter();
    } else {
      synchronize();
      sheetViewport.scrollTop = 0;
    }
  };
  const chapterLink = (label: string, index: number): HTMLElement => {
    const button = elem('button', { type: 'button', class: 'cr-toc-link', text: label });
    button.addEventListener('click', () => toIndex(index));
    return button;
  };
  toc.append(elem('h2', { text: 'תוכן עניינים – מערכת צירים' }));
  toc.append(chapterLink('שער', 0), chapterLink('תוכן עניינים', 1));
  for (const chapter of TOPICS) {
    const first = chapter.pages[0];
    if (first !== undefined) toc.append(chapterLink(chapter.title + ' · ' + first, first + 1));
  }

  const action = (label: string, onClick: () => void): HTMLButtonElement => {
    const button = elem('button', { type: 'button', text: label }) as HTMLButtonElement;
    button.addEventListener('click', onClick);
    return button;
  };
  extras.append(
    action('הורדה', () => openActionChooser('download')),
    action('הדפסה', () => openActionChooser('print')),
  );

  function updateCounter(): void {
    status.textContent = current === 0 ? 'שער' :
      current === 1 ? 'תוכן העניינים' : 'עמוד ' + (current - 1) + ' מתוך ' + TOTAL_PAGES;
    previous.disabled = current <= 0;
    next.disabled = current >= SHEETS - 1;
  }

  function synchronize(): void {
    if (window.innerWidth < 680 && mode === 'spread') mode = 'single';
    pages.dataset.view = mode;
    for (const [key, button] of modeButtons) button.setAttribute('aria-pressed', String(key === mode));
    const spreadStart = current < 2 ? current : current % 2 === 0 ? current - 1 : current;
    for (let index = 0; index < cells.length; index++) {
      const visible = mode === 'scroll' ||
        (mode === 'single' && index === current) ||
        (mode === 'spread' && (index === spreadStart || (spreadStart !== 0 && index === spreadStart + 1)));
      cells[index]!.hidden = !visible;
      if (visible && mode !== 'scroll') load(index);
    }
    const fitCount = mode === 'spread' && current !== 0 ? 2 : 1;
    const available = Math.max(220, sheetViewport.clientWidth - 22 - (fitCount - 1) * 10);
    const fit = Math.min(1, available / (PAPER_WIDTH * fitCount));
    const scale = Math.max(0.2, fit * zoom / 100);
    pages.style.setProperty('--cr-scale', scale.toFixed(5));
    updateCounter();
  }

  previous.addEventListener('click', () => {
    if (current <= 0) return;
    toIndex(mode === 'spread' && current > 2 ? current - 2 : current - 1);
  });
  next.addEventListener('click', () => {
    if (current >= SHEETS - 1) return;
    toIndex(mode === 'spread' && current >= 1 ? current + 2 : current + 1);
  });
  zoomSelect.addEventListener('change', () => {
    zoom = Number(zoomSelect.value) || 100;
    synchronize();
  });
  const onResize = (): void => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(synchronize);
  };
  const onScroll = (): void => {
    if (mode !== 'scroll') return;
    const top = bar.getBoundingClientRect().bottom + 8;
    const visible = cells.find((cell) => cell.getBoundingClientRect().bottom > top && !cell.hidden);
    if (visible) { current = Number(visible.dataset.index); updateCounter(); }
  };
  const onKeyboard = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key === 'Escape') closeToc();
    if (event.key === 'Home') toIndex(0);
    if (event.key === 'End') toIndex(SHEETS - 1);
    if (mode !== 'scroll' && event.key === 'ArrowLeft') next.click();
    if (mode !== 'scroll' && event.key === 'ArrowRight') previous.click();
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  root.addEventListener('keydown', onKeyboard);
  load(0);
  load(1);
  synchronize();
  window.scrollTo({ top: 0 });
  return () => {
    visibilityObserver.disconnect();
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    root.removeEventListener('keydown', onKeyboard);
  };
}
