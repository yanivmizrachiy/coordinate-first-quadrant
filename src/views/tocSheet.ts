/* The contents page, as the second sheet of the booklet — right after the
   cover, before page 1. It is a real A4 sheet, so it prints with the rest; on
   screen every chapter is a button that jumps to that chapter's first page.

   The colours are the palette Yaniv chose. The chapters come from BOOK, so this
   page can never go stale; there are more chapters than colours, so the palette
   cycles — and two chapters of one colour are never neighbours, because the
   cycle is longer than any run of related work. */
import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOPICS } from '../data/workbook';

/* Yaniv's ten colours, in the order he gave them — „אלה הצבעים של תוכן העניינים
   המסודר שלנו". I had reordered them so no two neighbours shared a hue family;
   the palette is his, so it goes back the way he wrote it. */
const PALETTE = [
  '#2962FF', '#00C853', '#FF6D00', '#D500F9', '#AA00FF',
  '#0091EA', '#FFD600', '#FF1744', '#00E5FF', '#64FFDA',
] as const;

/** Yellow and the two cyans need dark type on them; the rest carry white. */
const DARK_INK = new Set(['#FFD600', '#00E5FF', '#64FFDA']);

export function renderTocSheet(): HTMLElement {
  const section = elem('section', {
    class: 'sheet toc-sheet', id: 'toc', 'aria-label': 'תוכן העניינים',
  });

  const head = elem('header', { class: 'sheet-header' },
    elem('div', {},
      elem('h1', { text: 'תוכן העניינים' }),
      elem('p', { text: 'מערכת צירים — הרביע הראשון' }),
    ),
  );

  const list = elem('div', { class: 'toc-buttons' });
  for (const [i, topic] of TOPICS.entries()) {
    const colour = PALETTE[i % PALETTE.length]!;
    const first = topic.pages[0] ?? 1;
    const btn = elem('button', {
      class: 'toc-btn' + (DARK_INK.has(colour) ? ' toc-btn--dark' : ''),
      type: 'button',
      style: `--toc-colour:${colour}`,
      'aria-label': `${topic.title}, מתחיל בעמוד ${first}`,
    },
      elem('span', { class: 'toc-btn__name', text: topic.title }),
      /* Only the page the chapter STARTS on — „תכתוב רק מספר עמוד שמתחיל הפרק".
         „עמוד" is Hebrew and stays RTL; the number is pinned LTR beside it. */
      elem('span', { class: 'toc-btn__pages' },
        'עמוד ',
        elem('span', { class: 'math-ltr', dir: 'ltr', text: String(first) }),
      ),
    );
    btn.addEventListener('click', () => navigate(`#/workbook/${first}`));
    list.append(btn);
  }

  const foot = elem('footer', { class: 'gz-footer' },
    elem('div', { class: 'f1', text: 'יניב רז - מדריך מחוזי חט"ב בעיר ירושלים' }),
    elem('div', { class: 'f2', text: 'הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין' }),
  );

  section.append(head, elem('main', { class: 'sheet-content' }, list), foot);
  return section;
}
