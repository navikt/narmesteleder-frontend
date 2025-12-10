import { expect, test } from "@playwright/test";
import { testData } from "../fixtures/testData";
import { setupAuthentication } from "../helpers/auth";

test.describe("Create Line Manager Requirement", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthentication(page);
    await page.goto("/");
  });

  test("should display the form", async ({ page }) => {
    await expect(page.locator("form")).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for validation error messages
    await expect(page.locator("text=Feltet er påkrevd")).toBeVisible();
  });

  test("should submit form with valid data", async ({ page }) => {
    // Fill in the form with valid test data
    await page.fill('input[name="fodselsnummer"]', testData.validFnr);
    await page.fill('input[name="etternavn"]', testData.validEtternavn);
    await page.fill('input[name="epost"]', testData.validEmail);
    await page.fill('input[name="mobilnummer"]', testData.validMobilnummer);

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Wait for success response (mocked by fake server action)
    await expect(page.locator("text=Takk")).toBeVisible({ timeout: 5000 });
  });
});
