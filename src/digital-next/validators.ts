import type { Point, ValidationResult } from './types';

export function validatePointAnswer(expected: Point, actual: Point): ValidationResult {
  if (actual.x === expected.x && actual.y === expected.y) {
    return { ok: true, code: 'correct', message: 'נכון.' };
  }

  if (actual.x === expected.y && actual.y === expected.x && expected.x !== expected.y) {
    return {
      ok: false,
      code: 'swapped-xy',
      message: 'החלפתם בין שיעור x לשיעור y. שיעור x נכתב ראשון.',
    };
  }

  if (actual.x !== expected.x && actual.y === expected.y) {
    return { ok: false, code: 'wrong-x', message: 'שיעור y נכון. בדקו שוב את שיעור x.' };
  }

  if (actual.x === expected.x && actual.y !== expected.y) {
    return { ok: false, code: 'wrong-y', message: 'שיעור x נכון. בדקו שוב את שיעור y.' };
  }

  return { ok: false, code: 'wrong-point', message: 'בדקו את שני השיעורים של הנקודה.' };
}

export function segmentLength(start: Point, end: Point): number | null {
  if (start.y === end.y) return Math.abs(end.x - start.x);
  if (start.x === end.x) return Math.abs(end.y - start.y);
  return null;
}

export function validateSegmentLength(
  start: Point,
  end: Point,
  answer: number,
): ValidationResult {
  const length = segmentLength(start, end);

  if (length === null) {
    return {
      ok: false,
      code: 'segment-not-axis-aligned',
      message: 'בשלב הזה בונים קטע המקביל לאחד הצירים.',
    };
  }

  if (answer === length) {
    return { ok: true, code: 'correct', message: 'נכון. האורך התקבל מהפרש השיעורים המתאימים.' };
  }

  return {
    ok: false,
    code: 'wrong-segment-length',
    message:
      start.y === end.y
        ? 'הקטע מקביל לציר x. חשבו את הפרש שיעורי x.'
        : 'הקטע מקביל לציר y. חשבו את הפרש שיעורי y.',
  };
}
