import { TOTAL_PAGES } from '../data/workbook';
import { printPages } from './printPages';

/* הורדה אמיתית — קובץ PDF מוכן, לא חלון הדפסה.

   „כפתורים של הורדה והדפסה צריכים להיות שונים!" — הורדה נותנת קובץ, הדפסה
   פותחת מדפסת. הקובץ המלא נבנה מראש ממנוע ההדפסה של Chrome
   (`npm run pdf` → `public/hoveret.pdf`) ולכן ההורדה מיידית; עמודים נבחרים
   נגזרים ממנו בדפדפן עם pdf-lib — שנטען רק כשמבקשים, לא בכניסה לאתר.

   מפת העמודים בקובץ: 1 = שער, 2 = תוכן העניינים, עמוד חוברת n = n+2. */

const PDF_URL = `${import.meta.env.BASE_URL}hoveret.pdf`;
const FULL_NAME = 'מערכת צירים — הרביע הראשון.pdf';

function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** החוברת המלאה — הקובץ המוכן, כמו שהוא. */
export function downloadBooklet(): void {
  const a = document.createElement('a');
  a.href = PDF_URL;
  a.download = FULL_NAME;
  document.body.append(a);
  a.click();
  a.remove();
}

/** עמודים נבחרים — נגזרים מהקובץ המוכן. */
export async function downloadPages(pages: ReadonlySet<number>): Promise<void> {
  if (!pages.size) return;
  try {
    const [{ PDFDocument }, bytes] = await Promise.all([
      import('pdf-lib'),
      fetch(PDF_URL).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.arrayBuffer();
      }),
    ]);
    const src = await PDFDocument.load(bytes);
    const out = await PDFDocument.create();
    const ordered = [...pages].sort((a, b) => a - b);
    const copied = await out.copyPages(src, ordered.map((n) => n + 1)); // n+2, אפס-מבוסס
    for (const pg of copied) out.addPage(pg);
    const outBytes = await out.save();
    saveBlob(
      new Blob([outBytes as unknown as BlobPart], { type: 'application/pdf' }),
      ordered.length === TOTAL_PAGES ? FULL_NAME : `מערכת צירים — עמודים נבחרים (${ordered.length}).pdf`,
    );
  } catch {
    // אין קובץ מוכן (סביבת פיתוח לפני `npm run pdf`)? ההורדה עדיין עובדת —
    // דרך חלון ההדפסה, שבו „שמירה כ-PDF" היא יעד.
    printPages(new Set(pages));
  }
}
