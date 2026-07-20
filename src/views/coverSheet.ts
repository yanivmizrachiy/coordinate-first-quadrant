/* Renders the approved cover as a full A4 first page. The image is shown with
   object-fit: contain — never cropped, never stretched, A4 portrait preserved.
   If the image file is not present yet, a clearly-marked placeholder is shown
   so the build and layout stay verifiable. */
import { APPROVED_COVER } from '../data/cover';
import { elem } from '../lib/dom';

export function renderCoverSheet(): HTMLElement {
  const section = elem('section', { class: 'sheet cover-sheet', id: 'cover', 'aria-label': 'כריכת החוברת' });

  const img = elem('img', {
    class: 'cover-image',
    src: APPROVED_COVER.src,
    alt: APPROVED_COVER.alt,
    decoding: 'async',
  }) as HTMLImageElement;

  img.addEventListener('error', () => {
    if (section.querySelector('.cover-placeholder')) return;
    img.remove();
    section.classList.add('cover-sheet--placeholder');
    section.append(
      elem('div', { class: 'cover-placeholder' },
        elem('div', { class: 'cover-placeholder__title', text: 'כאן תופיע כריכת החוברת המאושרת' }),
        elem('div', { class: 'cover-placeholder__file', text: APPROVED_COVER.file }),
        elem('div', { class: 'cover-placeholder__hint', text: 'יש להעלות את התמונה לתיקייה public/assets/generated-covers/' }),
      ),
    );
  });

  section.append(img);
  return section;
}
