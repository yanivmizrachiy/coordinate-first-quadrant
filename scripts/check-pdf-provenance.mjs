import { assertPdfProvenance } from './pdf-provenance.mjs';
const current = assertPdfProvenance();
console.log('A4 PDFs and page map verified against source hash ' + current.source.slice(0, 12));
