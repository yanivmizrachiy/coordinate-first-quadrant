import { elem } from '../lib/dom';
import { TOTAL_PAGES } from '../data/workbook';
import { grayscale } from '../lib/storage';

/* The print bar: choose which pages go to the paper, and whether they print in
   black and white — then print, without leaving the booklet.

   Choosing a range costs nothing at print time: every sheet is already in the
   document, so a sheet outside the range is simply marked `print-skip` and the
   print stylesheet drops it. No re-render, no reload. */

export interface PrintBarOptions {
  /** The booklet view can print a range; a single sheet prints itself. */
  scope: 'book' | 'page';
  /** Which page the viewer is on, for the "this page only" choice. */
  current?: number;
  /** Where the sheets live, so the range can be applied to them. */
  root: () => ParentNode;
  /** Buttons that belong at the head of the same row. A second toolbar above
      this one costs 78px of screen — on a laptop that is a tenth of the page
      the reader came to look at. */
  lead?: HTMLElement[];
}

const BW = 'bw-print';

export function printBar(opts: PrintBarOptions): HTMLElement {
  const bar = elem('div', { class: 'printbar no-print' });
  if (opts.lead?.length) bar.append(...opts.lead, elem('span', { class: 'printbar__gap' }));

  /* ---- black and white ---- */
  const bw = elem('button', {
    class: 'printbar__toggle', type: 'button', 'aria-pressed': 'false',
  }, elem('span', { text: '🖨️' }), elem('span', { text: 'הדפסה שחור־לבן' })) as HTMLButtonElement;
  const setBw = (on: boolean): void => {
    document.body.classList.toggle(BW, on);
    grayscale.set(on);
    bw.setAttribute('aria-pressed', String(on));
    bw.classList.toggle('is-on', on);
    (bw.lastElementChild as HTMLElement).textContent = on ? 'חזרה לצבע' : 'הדפסה שחור־לבן';
  };
  bw.addEventListener('click', () => setBw(!document.body.classList.contains(BW)));
  setBw(document.body.classList.contains(BW));
  bar.append(bw);

  /* ---- which pages ---- */
  const from = elem('input', {
    class: 'printbar__num', type: 'number', min: '1', max: String(TOTAL_PAGES),
    value: String(opts.scope === 'page' ? (opts.current ?? 1) : 1), 'aria-label': 'מעמוד',
  }) as HTMLInputElement;
  const to = elem('input', {
    class: 'printbar__num', type: 'number', min: '1', max: String(TOTAL_PAGES),
    value: String(opts.scope === 'page' ? (opts.current ?? 1) : TOTAL_PAGES), 'aria-label': 'עד עמוד',
  }) as HTMLInputElement;

  /** Mark every sheet outside the chosen range; the print CSS hides them. */
  const applyRange = (all: boolean): void => {
    const lo = Math.min(+from.value || 1, +to.value || 1);
    const hi = Math.max(+from.value || 1, +to.value || 1);
    for (const sheet of opts.root().querySelectorAll<HTMLElement>('.sheet')) {
      const label = sheet.querySelector('.sheet-number')?.textContent?.trim();
      // the cover has no number: it prints only when everything prints
      const n = label ? Number(label) : 0;
      const keep = all || (n >= lo && n <= hi);
      sheet.classList.toggle('print-skip', !keep);
    }
  };

  if (opts.scope === 'book') {
    const range = elem('div', { class: 'printbar__range' },
      elem('span', { text: 'מעמוד' }), from, elem('span', { text: 'עד' }), to,
    );
    const allBtn = elem('button', { class: 'printbar__go', type: 'button', text: '🖨️ הדפסת הכול' });
    const rangeBtn = elem('button', { class: 'printbar__go', type: 'button', text: '🖨️ הדפסת הטווח' });
    allBtn.addEventListener('click', () => { applyRange(true); window.print(); });
    rangeBtn.addEventListener('click', () => { applyRange(false); window.print(); });
    bar.append(range, rangeBtn, allBtn);
  } else {
    const one = elem('button', { class: 'printbar__go', type: 'button', text: '🖨️ הדפסה' });
    one.addEventListener('click', () => window.print());
    bar.append(one);
  }

  // whatever was hidden for a range must not stay hidden for the next print
  window.addEventListener('afterprint', () => applyRange(true));
  return bar;
}
