/* ===========================================================================
   Cover page — the approved first page of the booklet.

   Only 05-workbook-cover-final.png is the approved cover. The other generated
   images (01–04) are alternatives / future design material and must NOT be used
   as the main cover. Drop the PNGs into public/assets/generated-covers/ (served
   at assets/generated-covers/) and this wires them in automatically.
   =========================================================================== */

export interface CoverImage {
  /** File name inside public/assets/generated-covers/. */
  file: string;
  /** Resolved URL (respects the Pages base path). */
  src: string;
  alt: string;
}

const COVER_DIR = `${import.meta.env.BASE_URL}assets/generated-covers/`;

/** THE approved cover — the booklet's first page. */
export const APPROVED_COVER: CoverImage = {
  file: '05-workbook-cover-final.png',
  src: `${COVER_DIR}05-workbook-cover-final.png`,
  alt: 'כריכת החוברת: מערכת צירים — הרביע הראשון',
};

/** Alternatives only — never used as the main cover. */
export const COVER_ALTERNATE_FILES: readonly string[] = [
  '01-workbook-cover.png',
  '02-workbook-cover.png',
  '03-workbook-cover.png',
  '04-workbook-cover.png',
];
