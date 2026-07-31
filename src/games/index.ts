/* Game registry — the single list the hub and router read from.
   To add a game: build it as a GameDefinition and append it here. */
import type { GameDefinition } from './types';
import { encryptedRouteGame } from './encryptedRoute';
import { sameAxisGame } from './sameAxis';
import { suspectPointGame } from './suspectPoint';
import { coordinateSafeGame } from './coordinateSafe';
import { coordinateMazeGame } from './coordinateMaze';

/* „ציור נסתר" ו„פענוח צבעוני" יצאו מהשעשועונים המקוונים — הם עכשיו דפי
   עבודה מודפסים (`HIDDEN_DRAWING_PRINT`, `COLOR_DECODE_PRINT`), כי „אנחנו
   רק דפים להדפסה ולא מתוקשב" (31.07.2026). לוגיקת התאים של פענוח צבעוני
   נשארת ב־`colorDecode.ts` ונבדקת שם, ומשמשת את הדף המודפס. */
export const GAMES: GameDefinition[] = [
  encryptedRouteGame,
  suspectPointGame,
  sameAxisGame,
  coordinateSafeGame,
  coordinateMazeGame,
];

export const gameById = (id: string): GameDefinition | undefined => GAMES.find((g) => g.id === id);

export type { GameDefinition } from './types';
