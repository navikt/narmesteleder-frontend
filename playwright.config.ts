import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001/arbeidsgiver/ansatte/narmesteleder/",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm exec next dev --port 3001",
    url: "http://localhost:3001/arbeidsgiver/ansatte/narmesteleder",
    reuseExistingServer: false,
    env: {
      // We choose demo here to have a stable environment for e2e tests
      NEXT_PUBLIC_RUNTIME_ENVIRONMENT: "demo",
      PLAYWRIGHT_TEST: "true",
    },
  },
});
