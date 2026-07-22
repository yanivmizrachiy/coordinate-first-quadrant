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
function letters(text: string, cls: string, from: number, step: number): { line: HTMLElement; done: number } {
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
  /* When the last letter has finished — its own delay plus the .44s it takes to
     travel. התחל waits for this, so the wait is derived from the text rather
     than guessed at, and stays right if the credit is ever reworded. */
  return { line, done: i + 0.44 };
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
  /* The page count is the promise the booklet makes, so it is set large and
     counts up to itself when the card arrives. */
  const count = elem('span', { class: 'opening__count', text: '0' });
  const line1 = letters('יניב רז - מדריך מחוזי חט"ב בעיר ירושלים', 'opening__credit', 0.10, 0.028);
  const line2 = letters('הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין', 'opening__credit opening__credit--2', 0.60, 0.021);

  const card = elem('div', { class: 'opening__card' },
    elem('h1', { class: 'opening__title' }, elem('span', { text: 'מערכת צירים' })),
    elem('p', { class: 'opening__sub' }, elem('span', { text: 'הרביע הראשון' })),
    elem('p', { class: 'opening__meta' },
      elem('span', { class: 'opening__kind', text: 'חוברת עבודה' }),
      elem('span', { class: 'opening__pages' }, count, elem('span', { class: 'opening__unit', text: 'עמודים' })),
    ),
    line1.line,
    line2.line,
  );

  /* התחל arrives only once the last letter has landed — measured from the text
     itself, not from a number typed in the stylesheet. */
  const afterAllText = Math.max(line1.done, line2.done) + 0.25;

  /** The count runs up as soon as the card is on screen. */
  const runCount = (): void => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      count.textContent = String(TOTAL_PAGES);
      return;
    }
    const started = performance.now();
    const dur = 1100;
    const tick = (now: number): void => {
      const t = Math.min(1, (now - started) / dur);
      const eased = 1 - (1 - t) ** 3;
      count.textContent = String(Math.round(eased * TOTAL_PAGES));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

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
    /* Only the invitation carries words. Once the sound is on there is nothing
       left to say — the speaker says it — so the label goes and the pill
       shrinks to the icon. */
    (sound.querySelector('.soundbtn__label') as HTMLElement).textContent = muted ? 'הפעלת קול' : '';
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
    count.textContent = '0';
    film.currentTime = 0;
    void film.play();
  });

  screen.style.setProperty('--after-text', `${afterAllText.toFixed(2)}s`);
  screen.append(stage, elem('div', { class: 'opening__scrim', 'aria-hidden': 'true' }), badge, card, start);
  if (film) screen.append(sound, replay);
  else { screen.classList.add('opening--ended'); requestAnimationFrame(runCount); }

  outlet.append(screen);

  /* Warm the booklet's first page while the film plays, so „התחל" is instant. */
  const warm = new Image();
  warm.decoding = 'async';
  warm.src = APPROVED_COVER.webp;

  let cleanup: (() => void) | undefined;
  if (film) {
    const f = film;
    const ended = (): void => { screen.classList.add('opening--ended'); runCount(); };
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
