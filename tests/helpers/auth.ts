import { BrowserContext, Page } from "@playwright/test";

export async function setupAuthentication(page: Page) {
  // Inject before navigation so the token is set on the first real document
  await page.addInitScript(() => {
    window.localStorage.setItem("test-auth-token", "test-token-value");
  });
}

export async function setupAuthenticationContext(context: BrowserContext) {
  // Add auth cookie to all requests in this context
  await context.addCookies([
    {
      name: "test-auth",
      value: "test-token",
      url: "http://localhost:3000",
    },
  ]);
}
