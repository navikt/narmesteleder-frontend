import { expect, test } from "@playwright/test";
import { validTestData } from "./fixtures/testData";

test.describe("Create Line Manager Requirement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should display submit button of the form", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Send inn" })).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: "Send inn" });
    await submitButton.click();

    await expect(page.getByText("Feltet er påkrevd")).toHaveCount(4);
  });

  test("should submit form with valid data", async ({ page }) => {
    // Fill in the form with valid test data
    const fnrInputs = page.getByLabel("Fødselsnummer (11 siffer)");
    await fnrInputs.nth(0).fill(validTestData.validFnr);
    await fnrInputs.nth(1).fill(validTestData.validFnr);
    const lastNameInputs = page.getByLabel("Etternavn");
    await lastNameInputs.nth(0).fill(validTestData.validEtternavn);
    await lastNameInputs.nth(1).fill(validTestData.validEtternavn);
    await page.getByLabel("E-post").fill(validTestData.validEmail);
    await page
      .getByLabel("Mobilnummer (8 siffer)")
      .fill(validTestData.validMobilnummer);
    await page
      .getByLabel("Organisasjonsnummer (9 siffer)")
      .fill(validTestData.validOrgnummer);

    // Submit the form
    await page.getByRole("button", { name: "Send inn" }).click();

    // Wait for success response (mocked by fake server action)
    await expect(page.locator("text=Takk")).toBeVisible({ timeout: 5000 });
  });
});
