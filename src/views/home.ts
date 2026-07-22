import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOTAL_PAGES } from '../data/workbook';
import { APPROVED_COVER, OPENING_FILM, DISTRICT_BADGE } from '../data/cover';
import type { ViewContext } from './context';
import { goToContents } from './tocSheet';

/** Public address of this build — used for the WhatsApp share text. */
const shareUrl = (): string => location.href.split('#')[0]!;

/** Has this device asked for less motion, or for less data? */
const wantsStillness = (): boolean => {
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    conn?.saveData === true ||
    /^(slow-)?2g$/.test(conn?.effectiveType ?? '')
  );
};

export function home({ outlet, setTitle }: ViewContext): (() => void) | void {
  setTitle('מערכת צירים — הרביע הראשון');
  const c = elem('div', { class: 'container home' });

  /* ---------------------------------------------------------------------
     The opening. The film IS the cover of the app: the first quadrant draws
     itself over Jerusalem, and it comes to rest on the finished system. The
     whole panel is one button, because the one thing to do here is go in.
     --------------------------------------------------------------------- */
  const hero = elem('section', { class: 'hero' });
  const stage = elem('div', { class: 'hero__stage' });
  const stillness = wantsStillness();

  let film: HTMLVideoElement | null = null;
  if (stillness) {
    /* No film at all — not a paused one. Asking for less motion or less data
       should not cost a megabyte of video that then sits still. */
    stage.append(picture(OPENING_FILM.still, OPENING_FILM.stillFallback, OPENING_FILM.alt, 'hero__media'));
  } else {
    film = elem('video', {
      class: 'hero__media hero__film',
      poster: OPENING_FILM.poster,
      preload: 'none',
      playsinline: '',
      muted: '',
      autoplay: '',
      'aria-label': OPENING_FILM.alt,
      width: 1280, height: 720,
    }) as HTMLVideoElement;
    film.muted = true;                       // the attribute alone is not enough on iOS
    film.append(
      elem('source', { src: OPENING_FILM.webm, type: 'video/webm' }),
      elem('source', { src: OPENING_FILM.mp4Small, type: 'video/mp4', media: '(max-width: 560px)' }),
      elem('source', { src: OPENING_FILM.mp4, type: 'video/mp4' }),
    );
    stage.append(film);
  }

  /* The district's badge sits in the corner from the first frame — it is whose
     material this is, and it should be there before the title arrives. */
  const badge = elem('picture', { class: 'hero__badge' });
  badge.append(
    elem('source', { srcset: DISTRICT_BADGE.webp, type: 'image/webp' }),
    elem('img', { src: DISTRICT_BADGE.png, alt: DISTRICT_BADGE.alt, width: 56, height: 56, decoding: 'async' }),
  );

  const title = elem('div', { class: 'hero__text' },
    elem('h1', { class: 'hero__title' }, elem('span', { text: 'מערכת צירים' })),
    elem('p', { class: 'hero__sub' }, elem('span', { text: 'הרביע הראשון' })),
    elem('p', { class: 'hero__meta' }, elem('span', { text: `חוברת מלאה · ${TOTAL_PAGES} עמודים` })),
  );

  const open = elem('button', { class: 'hero__open', type: 'button' },
    elem('span', { class: 'hero__open-label', text: 'פתיחת החוברת' }),
    elem('span', { class: 'hero__open-arrow', 'aria-hidden': 'true', text: '←' }),
  );
  open.addEventListener('click', () => navigate('#/book'));

  const replay = elem('button', {
    class: 'hero__replay', type: 'button', 'aria-label': 'הצגת הפתיחה מחדש', title: 'הפתיחה מחדש',
  }, elem('span', { 'aria-hidden': 'true', text: '↻' }));
  replay.addEventListener('click', () => {
    if (!film) return;
    film.currentTime = 0;
    void film.play();
    hero.classList.remove('hero--rested');
  });

  hero.append(stage, elem('div', { class: 'hero__scrim', 'aria-hidden': 'true' }), badge, title, open);
  if (film) hero.append(replay);
  /* Without a film there is nothing to wait for: the panel is at rest already. */
  if (!film) hero.classList.add('hero--rested');
  c.append(hero);

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

  /* Print needs the booklet laid out first, so it waits for the sheets to be
     measured rather than for a guessed number of milliseconds. */
  const openThenPrint = (): void => {
    navigate('#/book');
    const ready = (): void => {
      if (document.querySelectorAll('.book > .sheet').length > 1) {
        requestAnimationFrame(() => window.print());
      } else {
        setTimeout(ready, 120);
      }
    };
    setTimeout(ready, 200);
  };

  actions.append(
    act('act--view', '📖', 'תצוגה', () => navigate('#/book')),
    act('act--download', '⬇️', 'הורדה', openThenPrint),
    act('act--print', '🖨️', 'הדפסה', openThenPrint),
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
  (nav.querySelector('.jump__toc') as HTMLElement).addEventListener('click', goToContents);
  c.append(nav);

  /* The approved artwork, kept warm in the background: by the time the film has
     played the booklet's first page is already decoded and opens instantly. */
  const warm = new Image();
  warm.decoding = 'async';
  warm.src = APPROVED_COVER.webp;

  outlet.append(c);

  /* --------------------------------------------------------------------
     Playback is started AFTER the first paint, never before it. A video that
     begins downloading during layout delays the text it sits behind.
     -------------------------------------------------------------------- */
  let cleanup: (() => void) | undefined;
  if (film) {
    const f = film;
    const start = (): void => {
      f.preload = 'auto';
      f.load();
      void f.play().catch(() => { /* a browser may refuse; the poster stands in */ });
    };
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 200));
    const handle = idle(start);
    const rested = (): void => hero.classList.add('hero--rested');
    f.addEventListener('ended', rested);
    cleanup = () => {
      f.removeEventListener('ended', rested);
      if (window.cancelIdleCallback && typeof handle === 'number') window.cancelIdleCallback(handle);
      f.pause();
      f.removeAttribute('src');
    };
  }
  requestAnimationFrame(() => c.classList.add('home--in'));
  return cleanup;
}

/** A picture that prefers WebP and keeps the original behind it. */
function picture(webp: string, fallback: string, alt: string, cls: string): HTMLElement {
  const p = elem('picture', {});
  p.append(
    elem('source', { srcset: webp, type: 'image/webp' }),
    elem('img', { class: cls, src: fallback, alt, decoding: 'async', width: 1280, height: 720 }),
  );
  return p;
}
