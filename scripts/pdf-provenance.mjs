/* PDF provenance for the one canonical A4 workbook.
 * A PDF is not allowed to claim freshness merely because it contains 80 pages.
 * The exact source/style/assets hash and output hashes are verified on every CI/deploy.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const INPUTS = [
  'src/data/workbook',
  'src/data/cover.ts',
  'src/lib/coordinateGrid.ts',
  'src/lib/fitSheet.ts',
  'src/lib/dom.ts',
  'src/views/book.ts',
  'src/views/coverSheet.ts',
  'src/views/tocSheet.ts',
  'src/styles/workbook.css',
  'src/styles/grayscale.css',
  'src/styles/tokens.css',
  'src/styles/base.css',
  'src/styles/app.css',
  'public/assets/brand',
  'public/assets/covers',
  'public/assets/games',
  'public/assets/print-aids',
];
export const PROVENANCE_PATH = 'public/hoveret-provenance.json';
export const ARTIFACTS = ['public/hoveret.pdf', 'public/hoveret-bw.pdf', 'public/hoveret-map.json'];

function walk(path) {
  if (!existsSync(path)) throw new Error('Required PDF input missing: ' + path);
  if (statSync(path).isFile()) return [path];
  return readdirSync(path, { withFileTypes: true })
    .flatMap((entry) => walk(join(path, entry.name)))
    .sort();
}
function sha(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}
export function pdfSourceHash() {
  const hash = createHash('sha256');
  for (const path of INPUTS.flatMap(walk).sort()) {
    hash.update(path.replaceAll('\\', '/') + '\0');
    hash.update(readFileSync(path));
    hash.update('\0');
  }
  return hash.digest('hex');
}
export function buildPdfProvenance(total = 80) {
  const artifacts = Object.fromEntries(ARTIFACTS.map((file) => [
    file.replace('public/', ''),
    sha(readFileSync(file)),
  ]));
  return { schema: 1, source: pdfSourceHash(), total, artifacts };
}
export function assertPdfProvenance() {
  if (!existsSync(PROVENANCE_PATH)) {
    throw new Error('Missing canonical PDF provenance. Run npm run build && npm run pdf before release.');
  }
  const recorded = JSON.parse(readFileSync(PROVENANCE_PATH, 'utf8'));
  const current = buildPdfProvenance();
  if (JSON.stringify(recorded) !== JSON.stringify(current)) {
    throw new Error('Outdated workbook PDF or page map: content/style/assets changed without regeneration. Run npm run build && npm run pdf and commit all PDF artifacts.');
  }
  return current;
}
