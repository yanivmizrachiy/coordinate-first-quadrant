import { elem } from '../lib/dom';
import { navigate } from '../router';
import { lastPage } from '../lib/storage';
import { TOTAL_PAGES } from '../data/workbook';
import { GAMES } from '../games';
import type { ViewContext } from './context';

interface Entry { icon: string; title: string; desc: string; href: string; accent?: boolean; }

export function home({ outlet, setTitle }: ViewContext): void {
  setTitle('מערכת צירים — הרביע הראשון');
  const c = elem('div', { class: 'container' });

  c.append(
    elem('div', { class: 'hero' },
      elem('div', { class: 'hero__eyebrow', text: 'חוברת לימוד אינטראקטיבית' }),
      elem('h1', { class: 'hero__title', text: 'מערכת צירים — הרביע הראשון' }),
      elem('p', { class: 'hero__subtitle', text: 'לומדים לקרוא ולסמן נקודות, לזהות שיעורים, להזיז נקודות ולפתור שעשועונים — בעברית מלאה, מותאם לנייד ולהדפסה.' }),
    ),
  );

  const last = lastPage.get();
  if (last > 1) {
    const chip = elem('button', { class: 'resume-chip', type: 'button', text: `↩ המשיכו מעמוד ${last}` });
    chip.addEventListener('click', () => navigate(`#/workbook/${last}`));
    c.append(elem('div', { style: 'text-align:center' }, chip));
  }

  const entries: Entry[] = [
    { icon: '📄', title: 'דפי העבודה', desc: `${TOTAL_PAGES} דפי תרגול לפי נושאים, עם ניווט והדפסה`, href: '#/workbook' },
    { icon: '🎮', title: 'משחקים ושעשועונים', desc: `${GAMES.length} שעשועונים אינטראקטיביים ומדויקים`, href: '#/games', accent: true },
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
    );
    card.addEventListener('click', () => navigate(e.href));
    grid.append(card);
  }
  c.append(grid);
  outlet.append(c);
}
