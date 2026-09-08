import { describe, expect, it } from 'vitest';
import { segmentLength, validatePointAnswer, validateSegmentLength } from '../src/digital-next/validators';

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
});
