/* Game registry — the single list the hub and router read from.
   To add a game: build it as a GameDefinition and append it here. */
import type { GameDefinition } from './types';
import { encryptedRouteGame } from './encryptedRoute';
import { sameAxisGame } from './sameAxis';
import { suspectPointGame } from './suspectPoint';
import { coordinateSafeGame } from './coordinateSafe';
import { coordinateMazeGame } from './coordinateMaze';
import { colorDecodeGame } from './colorDecode';

/* „ציור נסתר" יצא מהשעשועונים המקוונים — הוא עכשיו דף עבודה מודפס
   (`HIDDEN_DRAWING_PRINT`), כי „המשימות שלנו הן להדפסה" (31.07.2026). */
export const GAMES: GameDefinition[] = [
  encryptedRouteGame,
  suspectPointGame,
  sameAxisGame,
  coordinateSafeGame,
  coordinateMazeGame,
  colorDecodeGame,
];

export const gameById = (id: string): GameDefinition | undefined => GAMES.find((g) => g.id === id);

export type { GameDefinition } from './types';
