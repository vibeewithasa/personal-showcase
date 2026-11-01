import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:5174',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : undefined,
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: '**/touch.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Mini'], defaultBrowserType: 'chromium' },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
    ...(process.env.PLAYWRIGHT_CROSS_BROWSER === '1'
      ? [
          {
            name: 'firefox',
            testIgnore: '**/touch.spec.ts',
            use: { ...devices['Desktop Firefox'], launchOptions: {} },
          },
          {
            name: 'webkit',
            testIgnore: '**/touch.spec.ts',
            use: { ...devices['Desktop Safari'], launchOptions: {} },
          },
        ]
      : []),
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: !process.env.CI,
  },
});
