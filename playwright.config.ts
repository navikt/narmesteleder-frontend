import { defineConfig, devices } from "@playwright/test";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseUrl = `http://localhost:${PORT}/${process.env.NEXT_PUBLIC_BASE_PATH}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: baseUrl,
    trace: "retry-with-trace",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NEXT_PUBLIC_RUNTIME_ENVIRONMENT: "test",
      NEXT_PUBLIC_BASE_PATH: "/arbeidsgiver/ansatte/narmesteleder",
      NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL:
        "https://arbeidsgiver.nav.no/min-side-arbeidsgiver/",
      NARMESTELEDER_BACKEND_HOST: "dummy-value",
      NARMESTELEDER_BACKEND_CLIENT_ID: "dummy-value",
      TOKEN_X_WELL_KNOWN_URL: "dummy-value",
      TOKEN_X_CLIENT_ID: "dummy-value",
      TOKEN_X_PRIVATE_JWK: "dummy-value",
      IDPORTEN_WELL_KNOWN_URL: "dummy-value",
      IDPORTEN_CLIENT_ID: "dummy-value",
      NAIS_CLUSTER_NAME: "dummy-value",
    },
  },
});
