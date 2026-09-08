import type { CoordinateAxis, Point, PointRegion, ValidationResult } from './types';

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

export function pointRegion(point: Point): PointRegion {
  if (point.x === 0 && point.y === 0) return 'origin';
  if (point.y === 0) return 'x-axis';
  if (point.x === 0) return 'y-axis';
  return 'first-quadrant';
}

export function validatePointRegion(point: Point, answer: PointRegion): ValidationResult {
  const expected = pointRegion(point);
  if (answer === expected) {
    return { ok: true, code: 'correct', message: 'נכון. הסיווג מתאים לשיעורי הנקודה.' };
  }
  return {
    ok: false,
    code: 'wrong-point-region',
    message:
      point.x === 0
        ? 'בדקו מה המשמעות של שיעור x ששווה 0.'
        : point.y === 0
          ? 'בדקו מה המשמעות של שיעור y ששווה 0.'
          : 'שני השיעורים חיוביים, לכן הנקודה נמצאת בתוך הרביע הראשון.',
  };
}

export function compareCoordinates(first: Point, second: Point, axis: CoordinateAxis): '<' | '=' | '>' {
  const a = axis === 'x' ? first.x : first.y;
  const b = axis === 'x' ? second.x : second.y;
  return a < b ? '<' : a > b ? '>' : '=';
}

export function validateCoordinateComparison(
  first: Point,
  second: Point,
  axis: CoordinateAxis,
  answer: '<' | '=' | '>',
): ValidationResult {
  const expected = compareCoordinates(first, second, axis);
  if (answer === expected) {
    return { ok: true, code: 'correct', message: `נכון. השוויתם רק את שיעורי ${axis}.` };
  }
  return {
    ok: false,
    code: 'wrong-coordinate-comparison',
    message: `השוו רק את שיעורי ${axis} של שתי הנקודות, בלי להשתמש בשיעור השני.`,
  };
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

export function rectangleMeasures(bottomLeft: Point, topRight: Point) {
  const length = Math.abs(topRight.x - bottomLeft.x);
  const width = Math.abs(topRight.y - bottomLeft.y);
  return {
    length,
    width,
    perimeter: 2 * (length + width),
    area: length * width,
  } as const;
}

export function validateRectangleMeasure(
  bottomLeft: Point,
  topRight: Point,
  measure: 'length' | 'width' | 'perimeter' | 'area',
  answer: number,
): ValidationResult {
  const values = rectangleMeasures(bottomLeft, topRight);
  if (answer === values[measure]) {
    return { ok: true, code: 'correct', message: 'נכון.' };
  }

  const codeMap = {
    length: 'wrong-rectangle-length',
    width: 'wrong-rectangle-width',
    perimeter: 'wrong-rectangle-perimeter',
    area: 'wrong-rectangle-area',
  } as const;

  const messages = {
    length: 'האורך מתקבל מהפרש שיעורי x של הקודקודים הקיצוניים.',
    width: 'הרוחב מתקבל מהפרש שיעורי y של הקודקודים הקיצוניים.',
    perimeter: 'חשבו קודם אורך ורוחב, ואז P = 2·(אורך + רוחב).',
    area: 'חשבו קודם אורך ורוחב, ואז S = אורך · רוחב.',
  } as const;

  return { ok: false, code: codeMap[measure], message: messages[measure] };
}
