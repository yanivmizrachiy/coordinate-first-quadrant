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
import { DISTRICT_BADGE } from '../data/cover';

/* Yaniv's ten colours, in the order he gave them — „אלה הצבעים של תוכן העניינים
   המסודר שלנו". I had reordered them so no two neighbours shared a hue family;
   the palette is his, so it goes back the way he wrote it. */
const PALETTE = [
  '#2962FF', '#00C853', '#FF6D00', '#D500F9', '#AA00FF',
  '#0091EA', '#FFD600', '#FF1744', '#00E5FF', '#64FFDA',
] as const;

/** Yellow and the two cyans are too light to carry white type. */
const PALE = new Set(['#FFD600', '#00E5FF', '#64FFDA']);

/* The page number sits on a WHITE disc, inked in its chapter's own colour — and
   a bright colour on white is not readable at 13px. Eight of the ten failed the
   contrast bar, not the three I expected, so the ink is DERIVED rather than
   hand-picked: darken the chapter's colour until it clears 4.5:1 on white. Any
   palette Yaniv gives will work, without a second list to keep in step. */
function inkOn(hex: string): string {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lin = (c: number): number => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const ratio = (c: number[]): number =>
    1.05 / (0.2126 * lin(c[0]!) + 0.7152 * lin(c[1]!) + 0.0722 * lin(c[2]!) + 0.05);
  let ink = rgb;
  for (let step = 0; step < 40 && ratio(ink) < 4.6; step++) ink = ink.map((c) => Math.round(c * 0.9));
  return '#' + ink.map((c) => c.toString(16).padStart(2, '0')).join('');
}

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
      class: 'toc-btn' + (PALE.has(colour) ? ' toc-btn--dark' : ''),
      type: 'button',
      style: `--toc-colour:${colour};--toc-ink:${inkOn(colour)}`,
      'aria-label': `${topic.title}, מתחיל בעמוד ${first}`,
    },
      /* The page number leads, in a disc of its own — a Hebrew reader meets the
         right-hand side first, so the number is the first thing read and the
         chapter name follows it. Only the page the chapter STARTS on. */
      elem('span', { class: 'toc-btn__no', dir: 'ltr', text: String(first) }),
      elem('span', { class: 'toc-btn__name', text: topic.title }),
    );
    btn.addEventListener('click', () => navigate(`#/workbook/${first}`));
    list.append(btn);
  }

  const badge = elem('picture', { class: 'gz-badge' });
  badge.append(
    elem('source', { srcset: DISTRICT_BADGE.webp, type: 'image/webp' }),
    elem('img', { src: DISTRICT_BADGE.png, alt: DISTRICT_BADGE.alt, width: 34, height: 34, decoding: 'async' }),
  );
  const foot = elem('footer', { class: 'gz-footer' },
    badge,
    elem('div', { class: 'gz-lines' },
      elem('div', { class: 'f1', text: 'יניב רז - מדריך מחוזי חט"ב בעיר ירושלים' }),
      elem('div', { class: 'f2', text: 'הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין' }),
    ),
  );

  section.append(head, elem('main', { class: 'sheet-content' }, list), foot);
  return section;
}

/** Go to the contents page — it is the booklet's second sheet, so this opens the
    booklet and brings that sheet into view. Every „תוכן העניינים" button in the
    app calls this, so there is one behaviour and not three. */
export function goToContents(): void {
  navigate('#/book');
  requestAnimationFrame(() => {
    document.getElementById('toc')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
}
