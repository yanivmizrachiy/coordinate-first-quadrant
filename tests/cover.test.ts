import { describe, it, expect } from 'vitest';
import { APPROVED_COVER, COVER_ALTERNATE_FILES } from '../src/data/cover';

describe('approved workbook cover', () => {
  it('the approved cover is exactly 05-workbook-cover-final.png', () => {
    expect(APPROVED_COVER.file).toBe('05-workbook-cover-final.png');
    expect(APPROVED_COVER.src).toContain('assets/generated-covers/05-workbook-cover-final.png');
  });

  it('the four alternates are never the main cover', () => {
    expect(COVER_ALTERNATE_FILES).toHaveLength(4);
    expect(COVER_ALTERNATE_FILES).not.toContain(APPROVED_COVER.file);
  });
});
