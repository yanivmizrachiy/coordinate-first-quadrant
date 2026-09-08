import type { Activity, Point } from './types';

export type VariantSeed = string | number;

const point = (x: number, y: number): Point => ({ x, y });

const pools = {
  read: [point(3, 7), point(8, 2), point(5, 9), point(2, 6)],
  place: [point(6, 4), point(7, 3), point(4, 8), point(9, 5)],
  segment: [
    [point(2, 5), point(8, 5)],
    [point(3, 2), point(3, 9)],
    [point(1, 7), point(6, 7)],
    [point(8, 1), point(8, 6)],
  ] as const,
  classify: [point(0, 6), point(7, 0), point(0, 0), point(4, 5)],
  compare: [
    [point(2, 8), point(7, 8), 'x'],
    [point(6, 3), point(6, 9), 'y'],
    [point(5, 4), point(5, 7), 'x'],
    [point(3, 6), point(8, 6), 'y'],
  ] as const,
  rectangle: [
    [point(2, 2), point(8, 6)],
    [point(1, 3), point(7, 8)],
    [point(3, 1), point(9, 5)],
    [point(2, 4), point(6, 9)],
  ] as const,
};

function hashSeed(seed: VariantSeed, salt: string) {
  const text = `${seed}:${salt}`;
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function choose<T>(items: readonly T[], seed: VariantSeed, salt: string): T {
  return items[hashSeed(seed, salt) % items.length];
}

function regionOf(p: Point): 'origin' | 'x-axis' | 'y-axis' | 'first-quadrant' {
  if (p.x === 0 && p.y === 0) return 'origin';
  if (p.y === 0) return 'x-axis';
  if (p.x === 0) return 'y-axis';
  return 'first-quadrant';
}

function comparison(a: Point, b: Point, axis: 'x' | 'y'): '<' | '=' | '>' {
  const left = a[axis];
  const right = b[axis];
  return left < right ? '<' : left > right ? '>' : '=';
}

function segmentLength(a: Point, b: Point) {
  return a.x === b.x ? Math.abs(a.y - b.y) : Math.abs(a.x - b.x);
}

/**
 * Returns a mathematically validated, deterministic variant of a prototype activity.
 * Curated pools are used instead of arbitrary random coordinates so every generated
 * task remains inside the first quadrant and preserves the intended misconception target.
 */
export function variantForActivity(activity: Activity, seed: VariantSeed): Activity {
  if (activity.kind === 'read-point') {
    const selected = choose(pools.read, seed, activity.id);
    return { ...activity, point: selected };
  }

  if (activity.kind === 'place-point') {
    const selected = choose(pools.place, seed, activity.id);
    return {
      ...activity,
      target: selected,
      prompt: `הזיזו את הנקודה אל B(${selected.x},${selected.y}).`,
    };
  }

  if (activity.kind === 'segment-length') {
    const [start, end] = choose(pools.segment, seed, activity.id);
    return {
      ...activity,
      start,
      end,
      expectedLength: segmentLength(start, end),
    };
  }

  if (activity.kind === 'classify-point') {
    const selected = choose(pools.classify, seed, activity.id);
    return {
      ...activity,
      point: selected,
      expectedRegion: regionOf(selected),
      prompt: `סווגו את הנקודה E(${selected.x},${selected.y}).`,
    };
  }

  if (activity.kind === 'compare-coordinate') {
    const [first, second, axis] = choose(pools.compare, seed, activity.id);
    return {
      ...activity,
      first,
      second,
      axis,
      expected: comparison(first, second, axis),
      prompt: `השוו בין שיעורי ${axis} של F(${first.x},${first.y}) ושל G(${second.x},${second.y}).`,
    };
  }

  const [bottomLeft, topRight] = choose(pools.rectangle, seed, activity.id);
  return {
    ...activity,
    bottomLeft,
    topRight,
    prompt: `מצאו אורך, רוחב, היקף ושטח של המלבן שקודקודיו הקיצוניים הם H(${bottomLeft.x},${bottomLeft.y}) ו-J(${topRight.x},${topRight.y}).`,
  };
}

export function buildVariantSet(activities: readonly Activity[], seed: VariantSeed): readonly Activity[] {
  return activities.map((activity) => variantForActivity(activity, seed));
}
