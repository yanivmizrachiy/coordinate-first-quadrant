import { describe, it, expect } from 'vitest';
import { statSync } from 'node:fs';
import { APPROVED_COVER, COVER_ALTERNATE_FILES } from '../src/data/cover';

describe('approved workbook cover', () => {
  it('the approved cover is exactly assets/covers/workbook-cover.png', () => {
    expect(APPROVED_COVER.file).toBe('workbook-cover.png');
    expect(APPROVED_COVER.src).toContain('assets/covers/workbook-cover.png');
  });

  it('the cover file is committed to the repo', () => {
    const png = new URL('../public/assets/covers/workbook-cover.png', import.meta.url);
    expect(statSync(png).size).toBeGreaterThan(10_000);
  });

  it('the four alternates are never the main cover', () => {
    expect(COVER_ALTERNATE_FILES).toHaveLength(4);
    expect(COVER_ALTERNATE_FILES).not.toContain(APPROVED_COVER.file);
  });
});
