/* מבוך הקואורדינטות — move a marker with the four direction buttons. Each move
   changes exactly one coordinate (right/left → x, up/down → y). You may not
   leave the first quadrant or step on a wall. Reach the target to win. */
import { move, eqPoint, isFirstQuadrant, type Direction, type Point } from '../lib/coordinateMath';

export interface MazeConfig {
  start: Point;
  target: Point;
  walls: Point[];
  xMax: number;
  yMax: number;
}

export const mazeConfig: MazeConfig = {
  start: { x: 0, y: 0 },
  target: { x: 6, y: 4 },
  xMax: 8,
  yMax: 6,
  walls: [
    { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
    { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 },
  ],
};

const isWall = (cfg: MazeConfig, p: Point): boolean => cfg.walls.some((w) => eqPoint(w, p));

export function canStandOn(cfg: MazeConfig, p: Point): boolean {
  return isFirstQuadrant(p) && p.x <= cfg.xMax && p.y <= cfg.yMax && !isWall(cfg, p);
}

/** BFS — used by the tests to prove the maze is solvable. */
export function mazeIsSolvable(cfg: MazeConfig): boolean {
  const key = (p: Point): string => `${p.x},${p.y}`;
  const seen = new Set<string>([key(cfg.start)]);
  const queue: Point[] = [cfg.start];
  const dirs: Direction[] = ['right', 'left', 'up', 'down'];
  while (queue.length) {
    const cur = queue.shift()!;
    if (eqPoint(cur, cfg.target)) return true;
    for (const d of dirs) {
      const next = move(cur, d, 1);
      if (canStandOn(cfg, next) && !seen.has(key(next))) { seen.add(key(next)); queue.push(next); }
    }
  }
  return false;
}

/* השעשועון המקוון הוסר (31.07.2026) — הדף הוא עכשיו `COORDINATE_MAZE_PRINT`.
   הנתונים למעלה הם מקור האמת של הדף המודפס ושל הבדיקות. */
