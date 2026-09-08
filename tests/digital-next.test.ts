import { describe, expect, it } from 'vitest';
import {
  compareCoordinates,
  pointRegion,
  rectangleMeasures,
  segmentLength,
  validateCoordinateComparison,
  validatePointAnswer,
  validatePointRegion,
  validateRectangleMeasure,
  validateSegmentLength,
} from '../src/digital-next/validators';

describe('digital-next validators', () => {
  it('accepts an exact ordered pair', () => {
    expect(validatePointAnswer({ x: 3, y: 7 }, { x: 3, y: 7 })).toMatchObject({ ok: true, code: 'correct' });
  });

  it('diagnoses swapped x/y', () => {
    expect(validatePointAnswer({ x: 3, y: 7 }, { x: 7, y: 3 })).toMatchObject({ ok: false, code: 'swapped-xy' });
  });

  it('diagnoses one-coordinate errors independently', () => {
    expect(validatePointAnswer({ x: 3, y: 7 }, { x: 4, y: 7 }).code).toBe('wrong-x');
    expect(validatePointAnswer({ x: 3, y: 7 }, { x: 3, y: 8 }).code).toBe('wrong-y');
  });

  it('classifies axes and origin correctly', () => {
    expect(pointRegion({ x: 0, y: 0 })).toBe('origin');
    expect(pointRegion({ x: 4, y: 0 })).toBe('x-axis');
    expect(pointRegion({ x: 0, y: 6 })).toBe('y-axis');
    expect(pointRegion({ x: 4, y: 6 })).toBe('first-quadrant');
    expect(validatePointRegion({ x: 0, y: 6 }, 'y-axis').ok).toBe(true);
    expect(validatePointRegion({ x: 0, y: 6 }, 'x-axis').code).toBe('wrong-point-region');
  });

  it('compares only the requested coordinate', () => {
    expect(compareCoordinates({ x: 2, y: 8 }, { x: 7, y: 8 }, 'x')).toBe('<');
    expect(compareCoordinates({ x: 2, y: 8 }, { x: 7, y: 8 }, 'y')).toBe('=');
    expect(validateCoordinateComparison({ x: 2, y: 8 }, { x: 7, y: 8 }, 'x', '<').ok).toBe(true);
  });

  it('computes axis-aligned segment lengths by coordinate difference', () => {
    expect(segmentLength({ x: 2, y: 5 }, { x: 8, y: 5 })).toBe(6);
    expect(segmentLength({ x: 4, y: 2 }, { x: 4, y: 9 })).toBe(7);
  });

  it('rejects diagonal segments in this learning stage', () => {
    expect(segmentLength({ x: 2, y: 2 }, { x: 5, y: 4 })).toBeNull();
  });

  it('validates segment answers with pedagogical diagnostics', () => {
    expect(validateSegmentLength({ x: 2, y: 5 }, { x: 8, y: 5 }, 6).ok).toBe(true);
    expect(validateSegmentLength({ x: 2, y: 5 }, { x: 8, y: 5 }, 5).code).toBe('wrong-segment-length');
  });

  it('derives rectangle dimensions perimeter and area from coordinates', () => {
    expect(rectangleMeasures({ x: 2, y: 2 }, { x: 8, y: 6 })).toEqual({
      length: 6,
      width: 4,
      perimeter: 20,
      area: 24,
    });
    expect(validateRectangleMeasure({ x: 2, y: 2 }, { x: 8, y: 6 }, 'area', 24).ok).toBe(true);
    expect(validateRectangleMeasure({ x: 2, y: 2 }, { x: 8, y: 6 }, 'perimeter', 24).code).toBe('wrong-rectangle-perimeter');
  });
});
