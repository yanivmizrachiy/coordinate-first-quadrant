import { describe, it, expect } from 'vitest';
import { assertPdfProvenance } from '../scripts/pdf-provenance.mjs';

describe('downloaded workbook is the generated version of the current editable pages', () => {
  it('blocks release when A4 content, shared CSS or illustrations changed without rebuilding PDFs', () => {
    expect(() => assertPdfProvenance()).not.toThrow();
  });
});
