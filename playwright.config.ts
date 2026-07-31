import { defineConfig, devices } from '@playwright/test';

// Visual / behavioural end-to-end tests. Run with: npm run test:visual
// (requires browsers: `npx playwright install chromium`).
/* Two working sessions once ran this suite at the same moment: the second
   suite's pages were served by the FIRST suite's preview, and four tests
   failed on an app that was never built here. PW_PORT lets a session take a
   port of its own; the default stays 4319. */
const PORT = process.env.PW_PORT ?? '4319';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    /* Smooth scrolling kept moving elements exactly while a click's stability
       check ran — a retry loop that only the slow mobile emulation lost. The
       app honours prefers-reduced-motion everywhere (tokens + scroll), so this
       runs the tests on the calm path a motion-sensitive user gets. */
    contextOptions: { reducedMotion: 'reduce' },
  },
  webServer: {
    command: `npm run build && vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    // Never reuse a server on this port: another project of Yaniv's has run on
    // the default 4173, and Playwright then measured THAT app and reported
    // failures here. strictPort + no reuse turns a clash into a clear error.
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
});
