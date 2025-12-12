import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000/arbeidsgiver/ansatte/narmesteleder/",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/arbeidsgiver/ansatte/narmesteleder",
    reuseExistingServer: !process.env.CI,
    env: {
      // We choose demo here to have a stable environment for e2e tests
      NEXT_PUBLIC_RUNTIME_ENVIRONMENT: "demo",
    },
  },
});
