import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Relative base so the same build works when opened locally (file/preview)
// and when served from a GitHub Pages project subpath
// (https://<user>.github.io/coordinate-first-quadrant/).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2022',
    cssCodeSplit: false,
    sourcemap: false,
    // The prototype is a separate build entry only. The canonical app keeps
    // index.html and its router unchanged; nothing links to this entry.
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'index.html'),
        'digital-next': resolve(__dirname, 'digital-next.html'),
      },
    },
  },
  server: {
    /* Two working sessions each start their own dev server on this repo; a
       hard-coded 5173 means the second one dies on a taken port. The harness
       assigns a free port through PORT (autoPort in .claude/launch.json);
       5173 stays the default for a plain `npm run dev`. */
    port: Number(process.env.PORT) || 5173,
    host: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
