/* ===========================================================================
   coordinateGrid — renders a first-quadrant coordinate system as crisp vector
   SVG. This is a typed port of the original booklet renderer; geometry and
   styling are preserved so the 34 legacy pages look identical, while games get
   a clean, reusable API (renderCoordinateGrid) plus hydration of `.coordinate-grid`
   elements that carry data-* specs.
   =========================================================================== */

const NS = 'http://www.w3.org/2000/svg';

export interface GridPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  dx?: number;
  dy?: number;
  anchor?: 'start' | 'middle' | 'end';
}
export interface GridSegment {
  from: [number, number];
  to: [number, number];
  dashed?: boolean;
  type?: 'guide' | 'shape';
  color?: string;
  arrow?: boolean;
}
export interface GridArrow {
  from: [number, number];
  to: [number, number];
  label?: string;
  color?: string;
}
export interface GridPolygon {
  points: [number, number][];
  type?: 'shape';
}
export interface GridLabelBox {
  text: string;
  at: [number, number];
  to?: [number, number];
}
export interface GridSpec {
  points?: GridPoint[];
  segments?: GridSegment[];
  arrows?: GridArrow[];
  polygons?: GridPolygon[];
  labelboxes?: GridLabelBox[];
  xlabels?: (number | string)[];
  ylabels?: (number | string)[];
  /** Set false to hide the "ציר x" / "ציר y" names (tasks that ask for them). */
  axisNames?: boolean;
  /** With axisNames:false — ask for the origin's NAME (two words, two boxes)
      instead of just the letter O. */
  originName?: boolean;
  /** The right-angle mark in the corner at the origin — the two axes ARE
      perpendicular, and it is drawn on every system unless set to false. */
  originAngle?: boolean;
  /** Override the axis names, e.g. a real-life graph: "משקל" / "מחיר". */
  axisXName?: string;
  axisYName?: string;
  ariaLabel?: string;
}

// Geometry — identical to the original booklet.
/* Top/bottom margins are deliberately generous: the axis NAMES ("ציר x" /
   "ציר y") must sit in the margin, never inside the grid or on the arrow. */
/* R and T carry the axis NAMES, which are the largest type on the drawing and
   grow further when a small grid has its text put back to size. */
const W = 560, H = 380, L = 56, R = 104, T = 70, B = 82;
const XM = 8, YM = 6;
const SX = (W - L - R) / XM;
const SY = (H - T - B) / YM;
const X = (x: number): number => L + x * SX;
const Y = (y: number): number => H - B - y * SY;

const AXIS = '#1f2a44';
const BLUE = '#1d4ed8';
const GRIDLINE = '#e7eaf1';
const GUIDE = '#64748b';

type Attrs = Record<string, string | number | undefined>;

let markerCounter = 0;

function el(tag: string, attrs: Attrs = {}, text = ''): SVGElement {
  const node = document.createElementNS(NS, tag) as SVGElement;
  /* Direction, decided by what the label actually contains.

     A label WITH Hebrew („ציר y”, „שיעור x = 4”) stays in the sheet's RTL
     direction, which puts the Hebrew word on the RIGHT. A Hebrew reader scans
     from the right, so „ציר” is the first word met — which is how it must
     read. Forcing such a label to LTR moves the Hebrew to the left, and then
     the reader meets „y” first and the label says „y ציר”: backwards.

     A label WITHOUT Hebrew („A”, „(2,5)”, „7”) is pinned LTR, because RTL
     mirrors brackets and can reorder a coordinate pair. */
  if (tag === 'text' && text !== '' && !/[֐-׿]/.test(text)) {
    node.setAttribute('direction', 'ltr');
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== '' && v !== null && v !== undefined) node.setAttribute(k, String(v));
  }
  if (text !== '') node.textContent = text;
  return node;
}

/** Render a coordinate grid from a typed spec. Returns a standalone <svg>. */
export function renderCoordinateGrid(spec: GridSpec): SVGSVGElement {
  const id = 'cg-arrow-' + ++markerCounter;
  const svg = el('svg', {
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': spec.ariaLabel || 'מערכת צירים ברביע הראשון',
    'shape-rendering': 'geometricPrecision',
    'text-rendering': 'geometricPrecision',
  }) as SVGSVGElement;

  // Arrowhead marker
  const defs = el('defs');
  const marker = el('marker', {
    id, viewBox: '0 0 10 10', refX: 8.5, refY: 5,
    markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse',
  });
  marker.append(el('path', { d: 'M0 0 L10 5 L0 10 z', fill: BLUE }));
  defs.append(marker);
  svg.append(defs);

  // Grid lines
  for (let x = 0; x <= XM; x++) {
    svg.append(el('line', { x1: X(x), y1: Y(0), x2: X(x), y2: Y(YM), stroke: GRIDLINE, 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }));
  }
  for (let y = 0; y <= YM; y++) {
    svg.append(el('line', { x1: X(0), y1: Y(y), x2: X(XM), y2: Y(y), stroke: GRIDLINE, 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }));
  }

  /* When the learner has to WRITE the axis name, its box goes to the right of
     the arrow (Yaniv's rule), so the arrow is drawn a little shorter to leave
     that room inside the margin. */
  const over = spec.axisNames === false ? 6 : 22;
  svg.append(
    el('line', { x1: X(0), y1: Y(0), x2: X(XM) + over, y2: Y(0), stroke: AXIS, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }),
    el('path', { d: `M ${X(XM) + over + 6} ${Y(0)} l-10-5v10z`, fill: AXIS }),
    el('line', { x1: X(0), y1: Y(0), x2: X(0), y2: Y(YM) - 18, stroke: AXIS, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }),
    el('path', { d: `M ${X(0)} ${Y(YM) - 25} l-5 10h10z`, fill: AXIS }),
  );

  // Ticks + numbers.
  // A point that sits ON an axis lands right next to that tick's number. The
  // learner is asked to READ that number, so it must never be crowded by the
  // dot: the clashing number is pushed further into the margin and gets a white
  // halo. (Never move it to the other side — the numbers must stay in one line.)
  const xl = spec.xlabels ?? [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const yl = spec.ylabels ?? [0, 1, 2, 3, 4, 5, 6];
  const pts = spec.points ?? [];
  const onXAxis = new Set(pts.filter((p) => p.y === 0).map((p) => p.x));
  const onYAxis = new Set(pts.filter((p) => p.x === 0).map((p) => p.y));
  const CLEAR = { 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 4.5 };

  for (let x = 1; x <= XM; x++) {
    svg.append(el('line', { x1: X(x), y1: Y(0) - 4, x2: X(x), y2: Y(0) + 4, stroke: AXIS, 'stroke-width': 1.4, 'vector-effect': 'non-scaling-stroke' }));
    const lab = xl[x];
    if (lab === '') {
      // missing number — draw an empty answer box for the student to fill in
      svg.append(el('rect', { x: X(x) - 14, y: Y(0) + 8, width: 28, height: 22, rx: 4, fill: '#fff', stroke: BLUE, 'stroke-width': 1.8, 'vector-effect': 'non-scaling-stroke' }));
    } else if (lab !== null && lab !== undefined) {
      const clash = onXAxis.has(x);
      svg.append(el('text', {
        x: X(x), y: Y(0) + (clash ? 27 : 21), 'text-anchor': 'middle', direction: 'ltr',
        fill: AXIS, 'font-size': 17, 'font-weight': 700, ...(clash ? CLEAR : {}),
      }, String(lab)));
    }
  }
  for (let y = 1; y <= YM; y++) {
    svg.append(el('line', { x1: X(0) - 4, y1: Y(y), x2: X(0) + 4, y2: Y(y), stroke: AXIS, 'stroke-width': 1.4, 'vector-effect': 'non-scaling-stroke' }));
    const lab = yl[y];
    if (lab === '') {
      // missing number — draw an empty answer box for the student to fill in
      svg.append(el('rect', { x: X(0) - 42, y: Y(y) - 11, width: 28, height: 22, rx: 4, fill: '#fff', stroke: BLUE, 'stroke-width': 1.8, 'vector-effect': 'non-scaling-stroke' }));
    } else if (lab !== null && lab !== undefined) {
      const clash = onYAxis.has(y);
      svg.append(el('text', {
        x: X(0) - (clash ? 18 : 12), y: Y(y) + 5, 'text-anchor': 'end', direction: 'ltr',
        fill: AXIS, 'font-size': 17, 'font-weight': 700, ...(clash ? CLEAR : {}),
      }, String(lab)));
    }
  }

  /* Axis names and the origin letter sit in the margins. When the task IS to
     name them (data-axisnames="false") printing them would give the answer
     away — so the learner gets a box to write in, right where the name
     belongs, exactly like a missing number on an axis. */
  const answerBox = (x: number, y: number, w: number): SVGElement =>
    el('rect', {
      x, y, width: w, height: 22, rx: 4, fill: '#fff', stroke: BLUE,
      'stroke-width': 1.8, 'vector-effect': 'non-scaling-stroke',
    });

  /* The two axes meet at a RIGHT angle, and nothing on the drawing ever said
     so. The little square in the corner is how a textbook says it. */
  if (spec.originAngle !== false) {
    const side = 16;
    svg.append(el('path', {
      d: `M ${X(0) + side} ${Y(0)} L ${X(0) + side} ${Y(0) - side} L ${X(0)} ${Y(0) - side}`,
      fill: 'none', stroke: AXIS, 'stroke-width': 1.8, 'vector-effect': 'non-scaling-stroke',
    }));
  }

  if (spec.axisNames !== false) {
    svg.append(
      el('text', { x: X(0) - 11, y: Y(0) + 22, 'text-anchor': 'end', fill: AXIS, 'font-size': 17, 'font-weight': 800 }, 'O'),
      // Mixed Hebrew+Latin flips text-anchor, so pin direction explicitly.
      /* Centred rather than anchored to an edge: in RTL, `start` anchors the
         RIGHT edge, so the name would grow back over the arrow. */
      /* „ציר x” fits past the arrow. A real-life name („דקות למידה (עשרות)”)
         does not — it reaches back over the last tick number — so a long one is
         centred UNDER the axis, where a textbook puts it. */
      ((): SVGElement => {
        const name = spec.axisXName ?? 'ציר x';
        return name.length > 8
          ? el('text', { x: X(XM / 2), y: Y(0) + 46, 'text-anchor': 'middle', fill: AXIS, 'font-size': 15, 'font-weight': 800 }, name)
          : el('text', { x: X(XM) + 46, y: Y(0) + 5, 'text-anchor': 'middle', fill: AXIS, 'font-size': 16, 'font-weight': 800 }, name);
      })(),
      el('text', { x: X(0), y: Y(YM) - 32, 'text-anchor': 'middle', fill: AXIS, 'font-size': 16, 'font-weight': 800 }, spec.axisYName ?? 'ציר y'),
    );
  } else {
    svg.append(
      answerBox(X(XM) + 16, Y(0) - 11, 52),     // to the RIGHT of the x arrow
      answerBox(X(0) - 28, Y(YM) - 48, 56),     // just above the y arrow
    );
    // „ראשית הצירים” is two words, so it gets two boxes — one word each.
    // Stacked in the corner below the origin, the only free space there.
    svg.append(
      ...(spec.originName
        ? [answerBox(X(0) - 54, Y(0) + 6, 52), answerBox(X(0) - 54, Y(0) + 32, 52)]
        : [answerBox(X(0) - 40, Y(0) + 6, 26)]),
    );
  }

  // Polygons
  for (const p of spec.polygons ?? []) {
    svg.append(el('polygon', {
      points: (p.points || []).map((v) => `${X(v[0])},${Y(v[1])}`).join(' '),
      fill: 'rgba(29,78,216,.08)', stroke: BLUE, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke',
    }));
  }

  // Segments
  for (const g of spec.segments ?? []) {
    svg.append(el('line', {
      x1: X(g.from[0]), y1: Y(g.from[1]), x2: X(g.to[0]), y2: Y(g.to[1]),
      stroke: g.color || (g.type === 'guide' ? GUIDE : BLUE),
      'stroke-width': g.type === 'guide' ? 1.7 : 2.6,
      'stroke-dasharray': g.dashed ? '7 5' : '',
      'marker-end': g.arrow ? `url(#${id})` : '',
      'vector-effect': 'non-scaling-stroke',
    }));
  }

  // Arrows (movement) with optional labels
  for (const a of spec.arrows ?? []) {
    svg.append(el('line', {
      x1: X(a.from[0]), y1: Y(a.from[1]), x2: X(a.to[0]), y2: Y(a.to[1]),
      stroke: a.color || BLUE, 'stroke-width': 2.4, 'stroke-dasharray': '8 5',
      'marker-end': `url(#${id})`, 'vector-effect': 'non-scaling-stroke',
    }));
    if (a.label) {
      const mx = (X(a.from[0]) + X(a.to[0])) / 2;
      const my = (Y(a.from[1]) + Y(a.to[1])) / 2;
      svg.append(el('text', { x: mx, y: my - 8, 'text-anchor': 'middle', fill: BLUE, 'font-size': 12, 'font-weight': 800, 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 4 }, a.label));
    }
  }

  // Points with labels
  for (const p of spec.points ?? []) {
    svg.append(el('circle', { cx: X(p.x), cy: Y(p.y), r: 5.1, fill: p.color || BLUE, stroke: '#fff', 'stroke-width': 1.7, 'vector-effect': 'non-scaling-stroke' }));
    if (p.label !== undefined && p.label !== '') {
      // The sheet is RTL, and in RTL `text-anchor: start` anchors the RIGHT edge —
      // the label would grow leftwards, back across the dot and onto the axis
      // numbers. Pin the direction so "start" really means "to the right of dx".
      svg.append(el('text', {
        x: X(p.x) + (p.dx ?? 10), y: Y(p.y) + (p.dy ?? -10),
        'text-anchor': p.anchor || 'start', fill: p.color || BLUE,
        'font-size': 13, 'font-weight': 900, 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 4,
      }, p.label || `(${p.x},${p.y})`));
    }
  }

  // Label boxes with optional connector line
  for (const b of spec.labelboxes ?? []) {
    const bx = X(b.at[0]);
    const by = Y(b.at[1]);
    const w = Math.max(70, (b.text || '').length * 7 + 18);
    const hh = 28;
    if (b.to) {
      svg.append(el('line', { x1: bx, y1: by + hh / 2, x2: X(b.to[0]), y2: Y(b.to[1]), stroke: GUIDE, 'stroke-width': 1.3, 'stroke-dasharray': '4 3', 'vector-effect': 'non-scaling-stroke' }));
    }
    svg.append(
      el('rect', { x: bx - w / 2, y: by - hh / 2, width: w, height: hh, rx: 6, fill: '#fff', stroke: '#94a3b8', 'stroke-width': 1.2 }),
      el('text', { x: bx, y: by + 4, 'text-anchor': 'middle', fill: AXIS, 'font-size': 12, 'font-weight': 700 }, b.text),
    );
  }

  return svg;
}

function readJson<Tv>(elm: HTMLElement, key: string, fallback: Tv): Tv {
  const raw = elm.dataset[key];
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as Tv;
  } catch {
    return fallback;
  }
}

/** Find every `.coordinate-grid` inside root and replace its content with SVG. */
export function hydrateGrids(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.coordinate-grid').forEach((elm) => {
    if (elm.dataset['hydrated'] === '1') return;
    const spec: GridSpec = {
      points: readJson(elm, 'points', []),
      segments: readJson(elm, 'segments', []),
      arrows: readJson(elm, 'arrows', []),
      polygons: readJson(elm, 'polygons', []),
      labelboxes: readJson(elm, 'labelboxes', []),
      ariaLabel: elm.getAttribute('aria-label') || undefined,
    };
    const xl = readJson<(number | string)[] | null>(elm, 'xlabels', null);
    const yl = readJson<(number | string)[] | null>(elm, 'ylabels', null);
    if (xl) spec.xlabels = xl;
    if (yl) spec.ylabels = yl;
    if (elm.dataset['axisnames'] === 'false') spec.axisNames = false;
    if (elm.dataset['originname'] === 'true') spec.originName = true;
    if (elm.dataset['originangle'] === 'false') spec.originAngle = false;
    if (elm.dataset['axisx']) spec.axisXName = elm.dataset['axisx'];
    if (elm.dataset['axisy']) spec.axisYName = elm.dataset['axisy'];
    elm.replaceChildren(renderCoordinateGrid(spec));
    elm.dataset['hydrated'] = '1';
  });
  /* Type inside an SVG shrinks with the drawing; put it back once every grid on
     this root is laid out. rAF, because a grid measured before layout is zero. */
  requestAnimationFrame(() => normaliseGridText(root));
}

export const gridGeometry = { W, H, L, R, T, B, XM, YM, X, Y };

/* An SVG scales everything inside it, type included. A drawing that renders at
   half its viewBox turns 13px axis numbers into 7px ones — the body text beside
   them stays 13px, and the drawing reads as blurred and cramped. Yaniv reported
   exactly that twice, and measuring the CONTAINER is what let it through: the
   box was the right size while the numbers inside it were not.

   So measure the scale each drawing actually got and put the type back. Capped,
   because doubling every label would push the axis names out of the margins. */
const TARGET_TEXT_PX = 12.5;
const MAX_GROWTH = 1.9;

export function normaliseGridText(root: ParentNode = document): void {
  for (const svg of root.querySelectorAll<SVGSVGElement>('.coordinate-grid svg')) {
    const box = svg.viewBox.baseVal;
    const shown = svg.getBoundingClientRect().width;
    if (!box?.width || !shown) continue;
    const scale = shown / box.width;
    if (!(scale > 0)) continue;
    for (const t of svg.querySelectorAll<SVGTextElement>('text')) {
      const base = Number(t.dataset['baseSize'] ?? t.getAttribute('font-size') ?? 13);
      t.dataset['baseSize'] = String(base);
      // never shrink type, and never grow it past what the margins can hold
      const grow = Math.min(MAX_GROWTH, Math.max(1, TARGET_TEXT_PX / (base * scale)));
      t.setAttribute('font-size', String(Math.round(base * grow * 10) / 10));
    }
  }
}
