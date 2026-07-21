import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOTAL_PAGES } from '../data/workbook';
import { GAMES } from '../games';
import { APPROVED_COVER } from '../data/cover';
import type { ViewContext } from './context';

interface Entry { icon: string; title: string; desc: string; href: string; accent?: boolean; }

export function home({ outlet, setTitle }: ViewContext): void {
  setTitle('מערכת צירים — הרביע הראשון');
  const c = elem('div', { class: 'container' });

  /* The approved cover IS the home screen — shown large and immediately.
     Tapping it opens the full booklet, where it is also the first A4 page. */
  const cover = elem('button', {
    class: 'home-cover',
    type: 'button',
    'aria-label': 'פתיחת החוברת המלאה',
  });
  const img = elem('img', {
    class: 'home-cover__img',
    src: APPROVED_COVER.src,
    alt: APPROVED_COVER.alt,
    decoding: 'async',
  }) as HTMLImageElement;
  // If the artwork is missing the screen must still be usable, never blank.
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

  const entries: Entry[] = [
    { icon: '📄', title: 'דפי העבודה', desc: `${TOTAL_PAGES} דפים לפי נושאים — כולל ${GAMES.length} שעשועונים משולבים בהקשר`, href: '#/workbook', accent: true },
    { icon: '📖', title: 'החוברת המלאה', desc: 'צפייה רציפה והדפסת כל הדפים כ־A4', href: '#/book' },
  ];

  const grid = elem('div', { class: 'home-grid' });
  for (const e of entries) {
    const card = elem('button', { class: 'entry-card' + (e.accent ? ' entry-card--accent' : ''), type: 'button' },
      elem('div', { class: 'entry-card__icon', text: e.icon }),
      elem('div', { class: 'entry-card__body' },
        elem('div', { class: 'entry-card__title', text: e.title }),
        elem('div', { class: 'entry-card__desc', text: e.desc }),
      ),
      elem('div', { class: 'entry-card__go', 'aria-hidden': 'true', text: '‹' }),
    );
    card.addEventListener('click', () => navigate(e.href));
    grid.append(card);
  }
  c.append(grid);
  outlet.append(c);
}
