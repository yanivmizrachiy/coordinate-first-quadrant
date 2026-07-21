/* ===========================================================================
   Cover page — the approved first page of the booklet.

   The approved artwork lives at public/assets/covers/workbook-cover.png and is
   served at assets/covers/workbook-cover.png (BASE_URL keeps the GitHub Pages
   subpath working). It is the booklet's first A4 page: it is NOT part of the
   worksheet numbering, and it never appears when printing a single worksheet.
   =========================================================================== */

export interface CoverImage {
  /** File name inside public/assets/covers/. */
  file: string;
  /** Resolved URL (respects the Pages base path). */
  src: string;
  alt: string;
}

const COVER_DIR = `${import.meta.env.BASE_URL}assets/covers/`;

/** THE approved cover — the booklet's first page. */
export const APPROVED_COVER: CoverImage = {
  file: 'workbook-cover.png',
  src: `${COVER_DIR}workbook-cover.png`,
  alt: 'כריכת החוברת: מערכת צירים — הרביע הראשון',
};

/** Alternatives only — never used as the main cover. */
export const COVER_ALTERNATE_FILES: readonly string[] = [
  '01-workbook-cover.png',
  '02-workbook-cover.png',
  '03-workbook-cover.png',
  '04-workbook-cover.png',
];
