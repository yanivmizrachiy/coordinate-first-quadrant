import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOTAL_PAGES } from '../data/workbook';
import { APPROVED_COVER } from '../data/cover';
import type { ViewContext } from './context';

/** Public address of this build — used for the WhatsApp share text. */
const shareUrl = (): string => location.href.split('#')[0]!;

export function home({ outlet, setTitle }: ViewContext): void {
  setTitle('מערכת צירים — הרביע הראשון');
  const c = elem('div', { class: 'container' });

  /* The approved cover is the screen. Tapping it opens the full booklet. */
  const cover = elem('button', { class: 'home-cover', type: 'button', 'aria-label': 'פתיחת החוברת המלאה' });
  const img = elem('img', {
    class: 'home-cover__img', src: APPROVED_COVER.src, alt: APPROVED_COVER.alt, decoding: 'async',
  }) as HTMLImageElement;
  img.addEventListener('error', () => {
    img.remove();
    cover.classList.add('home-cover--fallback');
    cover.append(
      elem('div', { class: 'home-cover__fallbacktitle', text: 'מערכת צירים — הרביע הראשון' }),
      elem('div', { class: 'home-cover__fallbackhint', text: 'לפתיחת החוברת המלאה' }),
    );
  });
  cover.append(img);
  cover.addEventListener('click', () => navigate('#/book'));
  c.append(cover, elem('h1', { class: 'visually-hidden', text: 'מערכת צירים — הרביע הראשון' }));

  /* ---- action buttons ---- */
  const actions = elem('div', { class: 'act-row' });

  const act = (cls: string, icon: string, label: string, onClick: () => void): HTMLElement => {
    const b = elem('button', { class: `act ${cls}`, type: 'button' },
      elem('span', { class: 'act__icon', 'aria-hidden': 'true', text: icon }),
      elem('span', { class: 'act__label', text: label }),
    );
    b.addEventListener('click', onClick);
    return b;
  };

  actions.append(
    act('act--view', '📖', 'תצוגה', () => navigate('#/book')),
    act('act--download', '⬇️', 'הורדה', () => {
      // A static site has no server-side PDF: the browser's own dialog saves it.
      navigate('#/book');
      setTimeout(() => window.print(), 400);
    }),
    act('act--print', '🖨️', 'הדפסה', () => {
      navigate('#/book');
      setTimeout(() => window.print(), 400);
    }),
  );

  /* WhatsApp — opens a ready-to-send message with the booklet link. */
  const wa = elem('a', {
    class: 'act act--wa',
    href: `https://wa.me/?text=${encodeURIComponent('מערכת צירים — הרביע הראשון · חוברת לימוד מלאה\n' + shareUrl())}`,
    target: '_blank',
    rel: 'noopener',
    'aria-label': 'שיתוף בוואטסאפ',
  },
    elem('span', { class: 'act__icon', 'aria-hidden': 'true', text: '💬' }),
    elem('span', { class: 'act__label', text: 'וואטסאפ' }),
  );
  actions.append(wa);
  c.append(actions);

  /* ---- paging: jump straight to any page ---- */
  const nav = elem('div', { class: 'jump' });
  const select = elem('select', { class: 'jump__select', 'aria-label': 'בחירת עמוד' }) as HTMLSelectElement;
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    select.append(elem('option', { value: String(i), text: `עמוד ${i}` }) as HTMLOptionElement);
  }
  const go = elem('button', { class: 'jump__go', type: 'button', text: 'מעבר' });
  go.addEventListener('click', () => navigate(`#/workbook/${select.value}`));
  select.addEventListener('change', () => navigate(`#/workbook/${select.value}`));

  nav.append(
    elem('button', { class: 'jump__first', type: 'button', text: '⏮ עמוד 1' }),
    select,
    go,
    elem('button', { class: 'jump__toc', type: 'button', text: '☰ תוכן העניינים' }),
  );
  (nav.querySelector('.jump__first') as HTMLElement).addEventListener('click', () => navigate('#/workbook/1'));
  (nav.querySelector('.jump__toc') as HTMLElement).addEventListener('click', () => navigate('#/workbook'));
  c.append(nav);

  outlet.append(c);
}
