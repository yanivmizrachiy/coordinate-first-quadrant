import { elem } from '../lib/dom';
import { navigate } from '../router';
import { OPENING_FILM } from '../data/cover';
import type { ViewContext } from './context';
import { flipbook } from './flipbook';

const YOUTUBE_ID = 'h5wegXI2ZGw';
const YOUTUBE_TITLE = 'מערכת צירים ברביע הראשון — איילת קריספין';

function makeAction(label: string, title: string, onClick: () => void): HTMLButtonElement {
  const button = elem('button', { type: 'button', text: label, title }) as HTMLButtonElement;
  button.addEventListener('click', onClick);
  return button;
}

export function unifiedBookSite(ctx: ViewContext): (() => void) | void {
  const cleanupBook = flipbook(ctx);
  ctx.setTitle('מערכת צירים — הרביע הראשון');

  const stage = ctx.outlet.querySelector<HTMLElement>('.lx-stage');
  const actions = stage?.querySelector<HTMLElement>('.lx-topbar__acts');
  if (!stage || !actions) return cleanupBook;

  // The old site had a separate landing/menu. The book is now the site itself,
  // so "back to site" would only loop back to the same reader.
  for (const link of actions.querySelectorAll('a')) {
    if (link.textContent?.includes('חזרה לאתר')) link.remove();
  }

  let modal: HTMLElement | null = null;
  const closeModal = (): void => {
    modal?.remove();
    modal = null;
    stage.focus({ preventScroll: true });
  };

  const openModal = (kind: 'curriculum' | 'opening'): void => {
    closeModal();
    const scrim = elem('button', {
      class: 'unified-media__scrim',
      type: 'button',
      'aria-label': 'סגירת הסרטון',
    }) as HTMLButtonElement;
    const dialog = elem('section', {
      class: 'unified-media__dialog',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': kind === 'curriculum' ? YOUTUBE_TITLE : 'סרט הפתיחה',
      dir: 'rtl',
    });
    const close = elem('button', {
      class: 'unified-media__close',
      type: 'button',
      text: 'סגירה ×',
      'aria-label': 'סגירה',
    }) as HTMLButtonElement;
    const head = elem('div', { class: 'unified-media__head' },
      elem('strong', { text: kind === 'curriculum' ? 'סרטון עדכון ת״ל' : 'סרט הפתיחה' }),
      close,
    );
    const body = elem('div', { class: 'unified-media__body' });

    if (kind === 'curriculum') {
      body.append(elem('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=iw&hl=iw`,
        title: YOUTUBE_TITLE,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: '',
      }));
    } else {
      const video = elem('video', {
        controls: '',
        autoplay: '',
        playsinline: '',
        poster: OPENING_FILM.poster,
        preload: 'metadata',
        'aria-label': OPENING_FILM.alt,
      }) as HTMLVideoElement;
      video.playsInline = true;
      video.append(
        elem('source', { src: OPENING_FILM.webm, type: 'video/webm' }),
        elem('source', { src: OPENING_FILM.mp4, type: 'video/mp4' }),
      );
      body.append(video);
    }

    dialog.append(head, body);
    const wrap = elem('div', { class: 'unified-media' }, scrim, dialog);
    scrim.addEventListener('click', closeModal);
    close.addEventListener('click', closeModal);
    modal = wrap;
    stage.append(wrap);
    close.focus();
  };

  const videoBtn = makeAction('סרטון', 'סרטון עדכון ת״ל', () => openModal('curriculum'));
  const openingBtn = makeAction('פתיח', 'סרט הפתיחה של מערכת הצירים', () => openModal('opening'));
  const answersBtn = makeAction('תשובות', 'חוברת התשובות להדפסה', () => navigate('#/solutions'));
  const aidsBtn = makeAction('המחשות', 'דפי צירים והמחשות להדפסה', () => navigate('#/print-aids'));

  actions.prepend(videoBtn, openingBtn, answersBtn, aidsBtn);

  const shareUrl = location.href.split('#')[0] ?? location.href;
  const share = elem('a', {
    href: `https://wa.me/?text=${encodeURIComponent('מערכת צירים — הרביע הראשון\n' + shareUrl)}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    text: 'שיתוף',
    title: 'שיתוף הקישור בוואטסאפ',
  }) as HTMLAnchorElement;
  actions.append(share);

  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && modal) closeModal();
  };
  document.addEventListener('keydown', onKey);

  return () => {
    document.removeEventListener('keydown', onKey);
    closeModal();
    if (typeof cleanupBook === 'function') cleanupBook();
  };
}
