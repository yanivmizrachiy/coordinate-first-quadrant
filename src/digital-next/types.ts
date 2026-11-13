export type Point = Readonly<{ x: number; y: number }>;

export type PointRegion = 'origin' | 'x-axis' | 'y-axis' | 'first-quadrant';
export type CoordinateAxis = 'x' | 'y';

export type ActivityKind =
  | 'read-point'
  | 'place-point'
  | 'segment-length'
  | 'classify-point'
  | 'compare-coordinate'
  | 'rectangle-properties';

export type ValidationCode =
  | 'correct'
  | 'swapped-xy'
  | 'wrong-x'
  | 'wrong-y'
  | 'wrong-point'
  | 'segment-not-axis-aligned'
  | 'wrong-segment-length'
  | 'wrong-point-region'
  | 'wrong-coordinate-comparison'
  | 'wrong-rectangle-length'
  | 'wrong-rectangle-width'
  | 'wrong-rectangle-perimeter'
  | 'wrong-rectangle-area';

export type ValidationResult = Readonly<{
  ok: boolean;
  code: ValidationCode;
  message: string;
}>;

export type Activity =
  | Readonly<{
      id: string;
      kind: 'read-point';
      prompt: string;
      point: Point;
    }>
  | Readonly<{
      id: string;
      kind: 'place-point';
      prompt: string;
      target: Point;
    }>
  | Readonly<{
      id: string;
      kind: 'segment-length';
      prompt: string;
      start: Point;
      end: Point;
      expectedLength: number;
    }>
  | Readonly<{
      id: string;
      kind: 'classify-point';
      prompt: string;
      point: Point;
      expectedRegion: PointRegion;
    }>
  | Readonly<{
      id: string;
      kind: 'compare-coordinate';
      prompt: string;
      first: Point;
      second: Point;
      axis: CoordinateAxis;
      expected: '<' | '=' | '>';
    }>
  | Readonly<{
      id: string;
      kind: 'rectangle-properties';
      prompt: string;
      bottomLeft: Point;
      topRight: Point;
    }>;

export type PrototypeProgress = Readonly<{
  completedIds: string[];
  updatedAt: string;
}>;
