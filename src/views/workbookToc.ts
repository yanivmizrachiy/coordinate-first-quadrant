import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOPICS, pageByNumber, TOTAL_PAGES } from '../data/workbook';
import type { ViewContext } from './context';

export function workbookToc({ outlet, setTitle }: ViewContext): void {
  setTitle('דפי העבודה');
  const c = elem('div', { class: 'container' });

  c.append(
    elem('div', { class: 'section-title' },
      elem('h2', { text: 'דפי העבודה' }),
      elem('span', { text: `${TOTAL_PAGES} עמודים · ${TOPICS.length} נושאים` }),
    ),
    elem('div', { class: 'toolbar-row' },
      makeLink('📖 החוברת המלאה', '#/book'),
    ),
  );

  TOPICS.forEach((topic, ti) => {
    const section = elem('div', { class: 'toc-topic' });
    section.append(
      elem('div', { class: 'toc-topic__head' },
        elem('div', { class: 'toc-topic__badge', text: String(ti + 1) }),
        elem('div', { class: 'toc-topic__title', text: topic.title }),
      ),
    );
    const grid = elem('div', { class: 'toc-grid' });
    for (const n of topic.pages) {
      const page = pageByNumber(n);
      if (!page) continue;
      const card = elem('button', { class: 'page-card', type: 'button' },
        elem('div', { class: 'page-card__num', text: `עמוד ${n}` }),
        elem('div', { class: 'page-card__title', text: page.title }),
        page.subtitle ? elem('div', { class: 'page-card__sub', text: page.subtitle }) : null,
      );
      card.addEventListener('click', () => navigate(`#/workbook/${n}`));
      grid.append(card);
    }
    section.append(grid);
    c.append(section);
  });

  outlet.append(c);
}

function makeLink(text: string, href: string): HTMLElement {
  const b = elem('button', { class: 'iconbtn', type: 'button', text });
  b.addEventListener('click', () => navigate(href));
  return b;
}
