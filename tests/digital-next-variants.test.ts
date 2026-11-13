import { describe, expect, it } from 'vitest';
import { prototypeActivities } from '../src/digital-next/content';
import { buildVariantSet, variantForActivity } from '../src/digital-next/variants';

const inFirstQuadrant = (value: number) => Number.isInteger(value) && value >= 0 && value <= 10;

describe('digital-next curated variants', () => {
  it('is deterministic for the same seed', () => {
    expect(buildVariantSet(prototypeActivities, 'student-a')).toEqual(buildVariantSet(prototypeActivities, 'student-a'));
  });

  it('produces different sets for different seeds', () => {
    expect(buildVariantSet(prototypeActivities, 'student-a')).not.toEqual(buildVariantSet(prototypeActivities, 'student-b'));
  });

  it('keeps every coordinate as an integer inside 0..10', () => {
    for (let seed = 0; seed < 50; seed += 1) {
      for (const activity of buildVariantSet(prototypeActivities, seed)) {
        const points = activity.kind === 'read-point' ? [activity.point]
          : activity.kind === 'place-point' ? [activity.target]
          : activity.kind === 'segment-length' ? [activity.start, activity.end]
          : activity.kind === 'classify-point' ? [activity.point]
          : activity.kind === 'compare-coordinate' ? [activity.first, activity.second]
          : [activity.bottomLeft, activity.topRight];

        for (const point of points) {
          expect(inFirstQuadrant(point.x)).toBe(true);
          expect(inFirstQuadrant(point.y)).toBe(true);
        }
      }
    }
  });

  it('keeps every segment axis-aligned and its expected length correct', () => {
    const original = prototypeActivities.find((activity) => activity.kind === 'segment-length');
    if (!original || original.kind !== 'segment-length') throw new Error('missing segment activity');

    for (let seed = 0; seed < 50; seed += 1) {
      const activity = variantForActivity(original, seed);
      if (activity.kind !== 'segment-length') throw new Error('wrong variant kind');
      expect(activity.start.x === activity.end.x || activity.start.y === activity.end.y).toBe(true);
      const expected = activity.start.x === activity.end.x
        ? Math.abs(activity.start.y - activity.end.y)
        : Math.abs(activity.start.x - activity.end.x);
      expect(activity.expectedLength).toBe(expected);
    }
  });

  it('keeps rectangle corners ordered with positive integer dimensions', () => {
    const original = prototypeActivities.find((activity) => activity.kind === 'rectangle-properties');
    if (!original || original.kind !== 'rectangle-properties') throw new Error('missing rectangle activity');

    for (let seed = 0; seed < 50; seed += 1) {
      const activity = variantForActivity(original, seed);
      if (activity.kind !== 'rectangle-properties') throw new Error('wrong variant kind');
      expect(activity.topRight.x).toBeGreaterThan(activity.bottomLeft.x);
      expect(activity.topRight.y).toBeGreaterThan(activity.bottomLeft.y);
    }
  });

  it('derives classification and comparison answers from coordinates', () => {
    for (let seed = 0; seed < 50; seed += 1) {
      for (const activity of buildVariantSet(prototypeActivities, seed)) {
        if (activity.kind === 'classify-point') {
          const expected = activity.point.x === 0 && activity.point.y === 0 ? 'origin'
            : activity.point.y === 0 ? 'x-axis'
            : activity.point.x === 0 ? 'y-axis'
            : 'first-quadrant';
          expect(activity.expectedRegion).toBe(expected);
        }
        if (activity.kind === 'compare-coordinate') {
          const left = activity.first[activity.axis];
          const right = activity.second[activity.axis];
          const expected = left < right ? '<' : left > right ? '>' : '=';
          expect(activity.expected).toBe(expected);
        }
      }
    }
  });
});
