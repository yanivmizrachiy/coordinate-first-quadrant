import { defineConfig, devices } from '@playwright/test';

// Visual / behavioural end-to-end tests. Run with: npm run test:visual
// (requires browsers: `npx playwright install chromium`).
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4319',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4319',
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
