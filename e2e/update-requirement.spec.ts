import { expect, test } from "@playwright/test";
import { validTestData } from "./fixtures/testData";

test.describe("Update Line Manager Requirement", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the update page with a requirement ID
    await page.goto(`./${validTestData.requirementId}`);
  });

  // test("should display update form", async ({ page }) => {
  //   await expect(
  //     page.getByRole("form", { name: "Oppdater nærmeste leder" }),
  //   ).toBeVisible();
  // });

  // test("should submit updated data", async ({ page }) => {
  //   // Fill in the form with updated test data
  //   await page.fill('input[name="fodselsnummer"]', validTestData.validFnr);
  //   await page.fill('input[name="etternavn"]', "UpdatedName");
  //   await page.fill('input[name="epost"]', validTestData.validEmail);
  //   await page.fill(
  //     'input[name="mobilnummer"]',
  //     validTestData.validMobilnummer,
  //   );

  //   // Submit the form
  //   await page.locator('button[type="submit"]').click();

  //   // Wait for success response
  //   await expect(page.locator("text=Takk")).toBeVisible({ timeout: 5000 });
  // });
});
