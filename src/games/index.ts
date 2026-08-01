/* Game registry — now empty, and that is the point.

   „המשימות שלנו הן להדפסה!!" (יניב, 31.07.2026). כל שבעת השעשועונים המקוונים
   הוחלפו בדפי עבודה מודפסים, ולכן אין יותר שעשועון שנטען לתוך עמוד:
   „מילת הסוד" → `SECRET_WORD_PRINT` · „ציור נסתר" → `HIDDEN_DRAWING_PRINT` ·
   „פענוח צבעוני" → `COLOR_DECODE_PRINT` · „המסלול המוצפן" →
   `ENCRYPTED_ROUTE_PRINT` · „מבוך הקואורדינטות" → `COORDINATE_MAZE_PRINT` ·
   „כספת הקואורדינטות" → `COORDINATE_SAFE_PRINT` · „הנקודה החשודה" →
   `SUSPECT_POINT_PRINT` · „אותו x או אותו y" → `SAME_AXIS_PRINT`.

   מודולי המשחק עצמם נשארים ב־`src/games/`: הם מחזיקים את **נתוני החידה**
   (המבוך, המסלולים, הצירופים, הסיבובים) ואת הבדיקות שמוכיחות שהם פתירים
   ונכונים — והדפים המודפסים בנויים על אותם נתונים. הרשימה כאן היא מה
   שנטען לתוך עמוד, ולכן היא ריקה. */
import type { GameDefinition } from './types';

export const GAMES: GameDefinition[] = [];

export const gameById = (id: string): GameDefinition | undefined => GAMES.find((g) => g.id === id);

export type { GameDefinition } from './types';
