import { expect, test } from "@playwright/test";
import { testData } from "../fixtures/testData";
import { setupAuthentication } from "../helpers/auth";

test.describe("Update Line Manager Requirement", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthentication(page);
    // Navigate to the update page with a requirement ID
    await page.goto(`/${testData.requirementId}`);
  });

  test("should display update form", async ({ page }) => {
    await expect(page.locator("form")).toBeVisible();
  });

  test("should submit updated data", async ({ page }) => {
    // Fill in the form with updated test data
    await page.fill('input[name="fodselsnummer"]', testData.validFnr);
    await page.fill('input[name="etternavn"]', "UpdatedName");
    await page.fill('input[name="epost"]', testData.validEmail);
    await page.fill('input[name="mobilnummer"]', testData.validMobilnummer);

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Wait for success response
    await expect(page.locator("text=Takk")).toBeVisible({ timeout: 5000 });
  });
});
