import { elem } from '../lib/dom';
import { navigate } from '../router';
import { GAMES } from '../games';
import type { ViewContext } from './context';

export function gamesHub({ outlet, setTitle }: ViewContext): void {
  setTitle('משחקים ושעשועונים');
  const c = elem('div', { class: 'container' });

  c.append(
    elem('div', { class: 'section-title' },
      elem('h2', { text: 'משחקים ושעשועונים' }),
      elem('span', { text: `${GAMES.length} שעשועונים` }),
    ),
  );

  const grid = elem('div', { class: 'games-grid' });
  for (const g of GAMES) {
    const card = elem('button', { class: 'game-card', type: 'button' },
      elem('div', { class: 'game-card__icon', text: g.icon }),
      elem('div', { class: 'game-card__title', text: g.title }),
      elem('div', { class: 'game-card__desc', text: g.short }),
      elem('div', { class: 'game-card__skill', text: '● ' + g.skill }),
    );
    card.addEventListener('click', () => navigate(`#/games/${g.id}`));
    grid.append(card);
  }
  c.append(grid);
  outlet.append(c);
}
