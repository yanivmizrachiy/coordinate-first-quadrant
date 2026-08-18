import { SOLUTION_PAGES } from '../data/solutions';
import { elem } from '../lib/dom';
import type { ViewContext } from './context';

export function solutions({ outlet, setTitle }: ViewContext): void {
  setTitle('תשובות להדפסה — הרביע הראשון');

  const root = elem('main', { class: 'solutions solutions-print' });

  for (const entry of SOLUTION_PAGES) {
    const exerciseList = elem('div', { class: 'solutions__exercises' });

    for (const exercise of entry.exercises) {
      exerciseList.append(
        elem('section', { class: 'solutions__answer' },
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
        ),
      );
    }

    root.append(
      elem('article', { class: 'solutions__page' },
        elem('header', { class: 'solutions__page-head' },
          elem('h2', { class: 'solutions__page-heading', text: `תשובות לעמוד ${entry.page.n}` }),
        ),
        exerciseList,
      ),
    );
  }

  outlet.append(root);
}
