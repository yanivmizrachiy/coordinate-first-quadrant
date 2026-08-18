import { SOLUTION_PAGES } from '../data/solutions';
import { elem } from '../lib/dom';
import { navigate } from '../router';
import type { ViewContext } from './context';

const normalize = (value: string): string => value.trim().toLocaleLowerCase('he');

export function solutions({ outlet, setTitle }: ViewContext): void {
  setTitle('תשובות לחוברת — הרביע הראשון');

  const root = elem('div', { class: 'container solutions' });

  const search = elem('input', {
    class: 'solutions__search',
    type: 'search',
    placeholder: 'חיפוש לפי עמוד, תרגיל או תשובה',
    'aria-label': 'חיפוש בתשובות',
  }) as HTMLInputElement;

  const pageSelect = elem('select', {
    class: 'solutions__select',
    'aria-label': 'מעבר לעמוד תשובות',
  }) as HTMLSelectElement;
  pageSelect.append(elem('option', { value: '', text: 'מעבר לעמוד…' }) as HTMLOptionElement);
  for (const entry of SOLUTION_PAGES) {
    pageSelect.append(elem('option', {
      value: String(entry.page.n),
      text: `עמוד ${entry.page.n}`,
    }) as HTMLOptionElement);
  }

  const tools = elem('div', { class: 'solutions__tools' }, search, pageSelect);
  const results = elem('div', { class: 'solutions__results', 'aria-live': 'polite' });
  const empty = elem('p', { class: 'solutions__empty', text: 'לא נמצאו תשובות מתאימות לחיפוש.' });

  const render = (): void => {
    const q = normalize(search.value);
    results.replaceChildren();

    let shown = 0;
    for (const entry of SOLUTION_PAGES) {
      const haystack = normalize([
        String(entry.page.n),
        entry.topic.title,
        entry.page.title,
        entry.page.subtitle,
        ...entry.exercises.flatMap((exercise) => [exercise.label, exercise.answer, exercise.method ?? '']),
      ].join(' '));
      if (q && !haystack.includes(q)) continue;

      const exerciseList = elem('div', { class: 'solutions__exercises' });
      for (const exercise of entry.exercises) {
        const answer = elem('section', { class: 'solutions__answer' },
          elem('div', { class: 'solutions__exercise-label', text: `תרגיל ${exercise.label}` }),
          elem('div', { class: 'solutions__answer-body' },
            elem('p', { class: 'solutions__answer-text', text: exercise.answer }),
            exercise.method
              ? elem('p', { class: 'solutions__method' },
                  elem('strong', { text: 'דרך פתרון: ' }),
                  exercise.method,
                )
              : null,
          ),
        );
        exerciseList.append(answer);
      }

      const card = elem('article', {
        class: 'solutions__page',
        id: `solution-page-${entry.page.n}`,
        tabindex: '-1',
      },
        elem('header', { class: 'solutions__page-head' },
          elem('h2', { class: 'solutions__page-heading', text: `תשובות לעמוד ${entry.page.n}` }),
          elem('button', {
            class: 'solutions__open-page',
            type: 'button',
            text: 'פתיחת העמוד בחוברת',
            onclick: () => navigate(`#/workbook/${entry.page.n}`),
          }),
        ),
        exerciseList,
      );
      results.append(card);
      shown += 1;
    }

    if (!shown) results.append(empty);
  };

  search.addEventListener('input', render);
  pageSelect.addEventListener('change', () => {
    const n = Number(pageSelect.value);
    if (!n) return;
    const target = document.getElementById(`solution-page-${n}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
  });

  root.append(tools, results);
  outlet.append(root);
  render();
}
