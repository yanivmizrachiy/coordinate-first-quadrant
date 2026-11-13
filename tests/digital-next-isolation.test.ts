import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = join(process.cwd(), 'src');
const DIGITAL = join(SRC, 'digital-next');

function sourceFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const full = join(root, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx|js|jsx)$/.test(name) ? [full] : [];
  });
}

describe('digital-next source isolation', () => {
  it('canonical source does not import or reference digital-next', () => {
    const offenders = sourceFiles(SRC)
      .filter((file) => !file.startsWith(DIGITAL))
      .filter((file) => readFileSync(file, 'utf8').includes('digital-next'))
      .map((file) => relative(process.cwd(), file));

    expect(offenders).toEqual([]);
  });

  it('digital-next does not import canonical workbook or flipbook modules', () => {
    const forbidden = ['data/workbook', 'flipbook', '../workbook', '/workbook/'];
    const offenders = sourceFiles(DIGITAL)
      .filter((file) => forbidden.some((needle) => readFileSync(file, 'utf8').includes(needle)))
      .map((file) => relative(process.cwd(), file));

    expect(offenders).toEqual([]);
  });
});
