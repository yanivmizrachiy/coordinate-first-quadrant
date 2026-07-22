import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOTAL_PAGES } from '../data/workbook';
import { APPROVED_COVER, OPENING_FILM, DISTRICT_BADGE } from '../data/cover';
import type { ViewContext } from './context';

/* ===========================================================================
   The opening — and nothing else.

   Ten seconds of a Jerusalem tram at golden hour, over which the first quadrant
   draws itself. It fills the screen, it carries its own sound, and the only
   thing on top of it is the way in. Everything you can DO lives one press away,
   on #/menu, so this screen has one job and does it.
   =========================================================================== */

/** Has this device asked for less motion, or for less data? */
const wantsStillness = (): boolean => {
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    conn?.saveData === true ||
    /^(slow-)?2g$/.test(conn?.effectiveType ?? '')
  );
};

/* The credit line, set letter by letter so it can be typed on by animation.
   Hebrew has no contextual shaping, so one span per character is safe; the
   spans are inline-block and the RTL container lays them out right to left. */
function letters(text: string, cls: string, from: number, step: number): HTMLElement {
  const line = elem('div', { class: cls, 'aria-label': text });
  let i = from;
  for (const ch of text) {
    if (ch === ' ') {
      line.append(elem('span', { class: 'ltr-sp', 'aria-hidden': 'true', html: '&nbsp;' }));
      i += step;
      continue;
    }
    line.append(elem('span', {
      class: 'ltr-ch', 'aria-hidden': 'true', text: ch,
      style: `--d:${i.toFixed(3)}s`,
    }));
    i += step;
  }
  return line;
}

export function home({ outlet, setTitle }: ViewContext): (() => void) | void {
  setTitle('מערכת צירים — הרביע הראשון');
  document.body.classList.add('is-opening');

  const screen = elem('div', { class: 'opening' });
  const stage = elem('div', { class: 'opening__stage' });
  const still = wantsStillness();

  let film: HTMLVideoElement | null = null;
  if (still) {
    const pic = elem('picture', { class: 'opening__pic' });
    pic.append(
      elem('source', { srcset: OPENING_FILM.still, type: 'image/webp' }),
      elem('img', { class: 'opening__media', src: OPENING_FILM.stillFallback, alt: OPENING_FILM.alt, decoding: 'async' }),
    );
    stage.append(pic);
  } else {
    film = elem('video', {
      class: 'opening__media opening__film',
      poster: OPENING_FILM.poster,
      preload: 'auto',
      playsinline: '',
      autoplay: '',
      'aria-label': OPENING_FILM.alt,
    }) as HTMLVideoElement;
    film.playsInline = true;
    film.append(
      elem('source', { src: OPENING_FILM.webm, type: 'video/webm' }),
      elem('source', { src: OPENING_FILM.mp4Small, type: 'video/mp4', media: '(max-width: 620px)' }),
      elem('source', { src: OPENING_FILM.mp4, type: 'video/mp4' }),
    );
    stage.append(film);
  }

  /* The district's badge, turning slowly and lit. */
  const badge = elem('picture', { class: 'opening__badge' });
  badge.append(
    elem('source', { srcset: DISTRICT_BADGE.webp, type: 'image/webp' }),
    elem('img', { src: DISTRICT_BADGE.png, alt: DISTRICT_BADGE.alt, decoding: 'async' }),
  );

  /* Everything below arrives only when the tram has stopped and the axes are
     drawn — the film is the title sequence, and this is its end card. */
  const card = elem('div', { class: 'opening__card' },
    elem('h1', { class: 'opening__title' }, elem('span', { text: 'מערכת צירים' })),
    elem('p', { class: 'opening__sub' }, elem('span', { text: 'הרביע הראשון' })),
    elem('p', { class: 'opening__meta' }, elem('span', { text: `חוברת עבודה · ${TOTAL_PAGES} עמודים` })),
    letters('יניב רז - מדריך מחוזי חט"ב בעיר ירושלים', 'opening__credit', 0.10, 0.028),
    letters('הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין', 'opening__credit opening__credit--2', 0.60, 0.021),
  );

  const start = elem('button', { class: 'startbtn', type: 'button' },
    elem('span', { class: 'startbtn__glow', 'aria-hidden': 'true' }),
    elem('span', { class: 'startbtn__label', text: 'התחל' }),
  );
  start.addEventListener('click', () => navigate('#/menu'));

  /* Sound. Browsers refuse to start a film with sound before the reader has
     touched the page — a policy, not a setting. So: try with sound, and if the
     browser says no, fall back to a silent start and offer one tap to turn it
     on. The control says which of the two happened. */
  const sound = elem('button', { class: 'soundbtn', type: 'button', 'aria-label': 'הפעלת הקול' },
    elem('span', { class: 'soundbtn__icon', 'aria-hidden': 'true', text: '🔇' }),
    elem('span', { class: 'soundbtn__label', text: 'הפעלת קול' }),
  );
  const showSound = (muted: boolean): void => {
    sound.classList.toggle('soundbtn--on', !muted);
    (sound.querySelector('.soundbtn__icon') as HTMLElement).textContent = muted ? '🔇' : '🔊';
    (sound.querySelector('.soundbtn__label') as HTMLElement).textContent = muted ? 'הפעלת קול' : 'קול פועל';
    sound.setAttribute('aria-label', muted ? 'הפעלת הקול' : 'השתקת הקול');
  };
  sound.addEventListener('click', () => {
    if (!film) return;
    film.muted = !film.muted;
    if (!film.muted) void film.play();
    showSound(film.muted);
  });

  const replay = elem('button', { class: 'replaybtn', type: 'button', 'aria-label': 'הצגת הפתיחה מחדש' },
    elem('span', { 'aria-hidden': 'true', text: '↻' }));
  replay.addEventListener('click', () => {
    if (!film) return;
    screen.classList.remove('opening--ended');
    film.currentTime = 0;
    void film.play();
  });

  screen.append(stage, elem('div', { class: 'opening__scrim', 'aria-hidden': 'true' }), badge, card, start);
  if (film) screen.append(sound, replay);
  else screen.classList.add('opening--ended');

  outlet.append(screen);

  /* Warm the booklet's first page while the film plays, so „התחל" is instant. */
  const warm = new Image();
  warm.decoding = 'async';
  warm.src = APPROVED_COVER.webp;

  let cleanup: (() => void) | undefined;
  if (film) {
    const f = film;
    const ended = (): void => screen.classList.add('opening--ended');
    f.addEventListener('ended', ended);

    /* Sound first. If the browser refuses, start silent — a silent opening is
       far better than a still frame and a play button. */
    f.muted = false;
    void f.play().then(
      () => showSound(false),
      () => {
        f.muted = true;
        showSound(true);
        void f.play().catch(() => { /* the poster stands in */ });
      },
    );

    /* One tap anywhere turns the sound on, which is what a reader expects after
       a silent start. It runs once, and never fights the buttons. */
    const firstTouch = (e: Event): void => {
      if ((e.target as HTMLElement).closest('button')) return;
      if (!f.muted) return;
      f.muted = false;
      showSound(false);
      void f.play();
    };
    screen.addEventListener('pointerdown', firstTouch, { once: true });

    cleanup = () => {
      f.removeEventListener('ended', ended);
      f.pause();
      document.body.classList.remove('is-opening');
    };
  } else {
    cleanup = () => document.body.classList.remove('is-opening');
  }

  requestAnimationFrame(() => screen.classList.add('opening--in'));
  return cleanup;
}
