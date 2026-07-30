import { elem } from '../lib/dom';
import { navigate } from '../router';
import { TOTAL_PAGES } from '../data/workbook';
import { APPROVED_COVER, OPENING_FILM, DISTRICT_BADGE } from '../data/cover';
import { printPages } from '../lib/printPages';
import type { ViewContext } from './context';

/* ===========================================================================
   The landing — the same site language as Yaniv's misparim unit, word for
   word in its structure: a dark top bar carrying the district badge and the
   מנח"י credit, a sticky pill nav, a hero that names the unit, a section per
   material, and a dark footer. Only the material itself is ours: the first
   quadrant, its film, and the 74-page booklet.
   =========================================================================== */

/** The curriculum film Yaniv published — embedded with the misparim facade.
    The heading over it is his, word for word: the big line names the unit and
    its author, the small line the curriculum update. */
const YOUTUBE_ID = 'h5wegXI2ZGw';
const YOUTUBE_TITLE = 'מערכת צירים ברביע הראשון — איילת קריספין';
const YOUTUBE_SUB = 'עדכון ת"ל — כיתה ז\' תשפ"ז';

const badgeImg = (cls: string): HTMLElement => {
  const pic = elem('picture', {});
  pic.append(
    elem('source', { srcset: DISTRICT_BADGE.webp, type: 'image/webp' }),
    elem('img', { class: cls, src: DISTRICT_BADGE.png, alt: DISTRICT_BADGE.alt, decoding: 'async' }),
  );
  return pic;
};

export function home({ outlet, setTitle }: ViewContext): (() => void) | void {
  setTitle('מערכת צירים — הרביע הראשון');
  const root = elem('div', { class: 'landing' });

  /* ---- top bar: the badge in its gold ring, the credit centred ---------- */
  root.append(
    elem('header', { class: 'ls-topbar' },
      elem('div', { class: 'ls-container ls-topbar__inner' },
        elem('span', { class: 'ls-topbar__logobox' }, badgeImg('ls-topbar__logo')),
        elem('div', { class: 'ls-topbar__text' },
          elem('span', { class: 'ls-topbar__lead', text: 'הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין' }),
          elem('span', { class: 'ls-topbar__year', text: 'שנה"ל התשפ"ז' }),
          elem('span', { class: 'ls-topbar__credit', text: 'האתר מנוהל ע"י יניב רז · מדריך מחוזי חט"ב בעיר ירושלים' }),
        ),
      ),
    ),
  );

  /* ---- sticky nav ------------------------------------------------------- */
  const navLink = (label: string, go: () => void): HTMLElement => {
    const a = elem('button', { class: 'ls-nav__link', type: 'button', text: label });
    a.addEventListener('click', go);
    return a;
  };
  const toAnchor = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  /* „בכותרת למעלה תמחק את המילים סרט הפתיחה — זה מיותר": the film is the top
     of the page itself, so it needs no link pointing at it. */
  root.append(
    elem('nav', { class: 'ls-nav', 'aria-label': 'ניווט בעמוד' },
      elem('div', { class: 'ls-container ls-nav__inner' },
        navLink('סרטון ההסבר', toAnchor('video')),
        navLink('חוברת העבודה', toAnchor('booklet')),
        navLink('כל הפעולות', () => navigate('#/menu')),
      ),
    ),
  );

  /* ---- hero: the tram film IS the workbook's front page ------------------
     Yaniv: „הסרטון של הרכבת הוא העמוד הראשי של חוברת העבודה" — so it sits in
     the hero itself, playing as the page opens, with the unit's name and the
     way into the booklet beside it. Not a section further down; the front. */
  const ctaBook = elem('button', { class: 'ls-btn ls-btn--primary', type: 'button', text: 'פתיחת החוברת' });
  ctaBook.addEventListener('click', () => navigate('#/book'));
  const ctaVideo = elem('button', { class: 'ls-btn ls-btn--ghost', type: 'button', text: 'צפייה בסרטון' });
  ctaVideo.addEventListener('click', toAnchor('video'));

  const film = elem('video', {
    class: 'ls-film',
    poster: OPENING_FILM.poster,
    preload: 'metadata',
    playsinline: '', muted: '', autoplay: '',
    'aria-label': OPENING_FILM.alt,
  }) as HTMLVideoElement;
  film.muted = true;
  film.playsInline = true;
  film.append(
    elem('source', { src: OPENING_FILM.webm, type: 'video/webm' }),
    elem('source', { src: OPENING_FILM.mp4, type: 'video/mp4' }),
  );

  const soundBtn = elem('button', { class: 'ls-filmbtn', type: 'button', 'aria-label': 'הפעלת הקול' },
    elem('span', { 'aria-hidden': 'true', text: '🔇' }), elem('span', { text: 'הפעלת קול' }));
  soundBtn.addEventListener('click', () => {
    film.muted = !film.muted;
    if (!film.muted) void film.play();
    soundBtn.replaceChildren(
      elem('span', { 'aria-hidden': 'true', text: film.muted ? '🔇' : '🔊' }),
      ...(film.muted ? [elem('span', { text: 'הפעלת קול' })] : []),
    );
    soundBtn.setAttribute('aria-label', film.muted ? 'הפעלת הקול' : 'השתקת הקול');
  });
  const replayBtn = elem('button', { class: 'ls-filmbtn ls-filmbtn--replay', type: 'button', 'aria-label': 'הצגה מחדש', text: '↻' });
  replayBtn.addEventListener('click', () => { film.currentTime = 0; void film.play(); });

  root.append(
    elem('section', { class: 'ls-hero', id: 'opening' },
      elem('div', { class: 'ls-container ls-hero__grid' },
        elem('div', { class: 'ls-reveal' },
          elem('div', { 'aria-hidden': 'true' },
            elem('span', { class: 'ls-axesbadge ls-axesbadge--x', text: 'x' }),
            elem('span', { class: 'ls-axesbadge ls-axesbadge--y', text: 'y' }),
          ),
          /* No sales copy here — Yaniv: „כל המילים… זה דמו, תמחק הכל מייד".
             The name of the unit, the way in, and nothing else. */
          elem('span', { class: 'ls-hero__eyebrow', text: 'מתמטיקה · כיתה ז\'' }),
          elem('h1', { class: 'ls-hero__title', text: 'מערכת צירים ברביע הראשון' }),
          elem('div', { class: 'ls-hero__actions' }, ctaBook, ctaVideo),
        ),
        elem('div', { class: 'ls-hero__film ls-reveal' },
          elem('div', { class: 'ls-viewer' }, film, soundBtn, replayBtn),
          elem('p', { class: 'ls-hero__filmcap', text: 'רכבת קלה בירושלים, ומעליה מערכת הצירים משרטטת את עצמה — הצירים, ואז הנקודות (2,3), (3,1), (4,5) ו־(5,2).' }),
        ),
      ),
    ),
  );

  const sectionHead = (eyebrow: string, title: string, sub?: string): HTMLElement =>
    elem('div', { class: 'ls-section__head ls-reveal' },
      elem('span', { class: 'ls-section__eyebrow', text: eyebrow }),
      elem('h2', { class: 'ls-section__title', text: title }),
      ...(sub ? [elem('p', { class: 'ls-section__sub', text: sub })] : []),
    );

  /* ---- the curriculum film: the misparim facade, player loads on press -- */
  const videoBox = elem('div', { class: 'ls-viewer' });
  const facade = elem('button', {
    class: 'ls-facade', type: 'button', 'aria-label': `הפעלת הסרטון: ${YOUTUBE_TITLE}`,
  });
  const thumb = elem('img', {
    class: 'ls-facade__thumb',
    src: `https://i.ytimg.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`,
    alt: YOUTUBE_TITLE, loading: 'lazy',
  }) as HTMLImageElement;
  thumb.addEventListener('error', () => {
    if (!thumb.dataset['fallback']) {
      thumb.dataset['fallback'] = '1';
      thumb.src = `https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`;
    }
  });
  const play = elem('span', { class: 'ls-facade__play', 'aria-hidden': 'true' });
  play.innerHTML =
    '<svg viewBox="0 0 68 48" width="72" height="50">' +
    '<path d="M66.5 7.7c-.8-2.9-3-5.1-5.9-5.9C55.5.5 34 .5 34 .5S12.5.5 7.4 1.8C4.5 2.6 2.3 4.8 1.5 7.7.2 12.8.2 24 .2 24s0 11.2 1.3 16.3c.8 2.9 3 5.1 5.9 5.9C12.5 47.5 34 47.5 34 47.5s21.5 0 26.6-1.3c2.9-.8 5.1-3 5.9-5.9C67.8 35.2 67.8 24 67.8 24s0-11.2-1.3-16.3z" fill="#cc0000"/>' +
    '<path d="M27 34.5l18-10.5-18-10.5z" fill="#fff"/></svg>';
  facade.append(thumb, play);
  facade.addEventListener('click', () => {
    const frame = elem('iframe', {
      src: `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`,
      title: YOUTUBE_TITLE,
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      allowfullscreen: '',
    });
    videoBox.replaceChildren(frame);
  });
  videoBox.append(facade);

  root.append(
    elem('section', { class: 'ls-section ls-section--soft', id: 'video' },
      elem('div', { class: 'ls-container' },
        sectionHead('סרטון', YOUTUBE_TITLE, YOUTUBE_SUB),
        videoBox,
        elem('div', { class: 'ls-viewer__bar' },
          elem('a', {
            class: 'ls-btn ls-btn--ghost',
            href: `https://www.youtube.com/watch?v=${YOUTUBE_ID}`,
            target: '_blank', rel: 'noopener noreferrer', text: 'פתיחה ביוטיוב',
          }),
        ),
      ),
    ),
  );

  /* ---- the booklet, in the misparim pdfframe ---------------------------- */
  const coverLink = elem('a', { class: 'ls-pdfframe__page', href: '#/book', 'aria-label': 'פתיחת החוברת המלאה' });
  const coverPic = elem('picture', {});
  coverPic.append(
    elem('source', { srcset: APPROVED_COVER.webp, type: 'image/webp' }),
    elem('img', { src: APPROVED_COVER.src, alt: APPROVED_COVER.alt, loading: 'lazy', decoding: 'async' }),
  );
  coverLink.append(coverPic);

  const openBtn = elem('button', { class: 'ls-btn ls-btn--gold', type: 'button', text: 'תצוגה מלאה' });
  openBtn.addEventListener('click', () => navigate('#/book'));
  const printBtn = elem('button', { class: 'ls-btn ls-btn--ghost', type: 'button', text: 'הדפסה' });
  printBtn.addEventListener('click', () => printPages('all'));

  root.append(
    elem('section', { class: 'ls-section ls-section--soft', id: 'booklet' },
      elem('div', { class: 'ls-container' },
        sectionHead('חוברת העבודה', `החוברת המלאה · ${TOTAL_PAGES} עמודים`,
          'דפי עבודה, שעשועונים משולבים ותוכן עניינים צבעוני — להדפסה כ־A4 או לפתרון על המסך.'),
        elem('div', { class: 'ls-pdfframe' },
          elem('div', { class: 'ls-pdfframe__bar' },
            elem('span', { class: 'ls-pdfframe__title', text: 'מערכת צירים — הרביע הראשון · חוברת עבודה' }),
            elem('span', { class: 'ls-pdfframe__acts' }, openBtn, printBtn),
          ),
          elem('div', { class: 'ls-pdfframe__stage' }, coverLink),
        ),
      ),
    ),
  );

  /* ---- footer ----------------------------------------------------------- */
  root.append(
    elem('footer', { class: 'ls-footer' },
      elem('div', { class: 'ls-container ls-footer__inner' },
        elem('span', { class: 'ls-footer__brand' },
          badgeImg('ls-footer__logo'),
          elem('span', { text: 'מערכת צירים ברביע הראשון · מחוז ירושלים — מנח"י' }),
        ),
        elem('span', { text: 'האתר מנוהל ע"י יניב רז · מדריך מחוזי חט"ב בעיר ירושלים' }),
      ),
    ),
  );

  outlet.append(root);
  requestAnimationFrame(() => root.classList.add('landing--in'));

  return () => { film.pause(); };
}
