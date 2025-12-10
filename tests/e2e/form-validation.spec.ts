import { expect, test } from "@playwright/test";
import { testData } from "../fixtures/testData";
import { setupAuthentication } from "../helpers/auth";

test.describe("Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthentication(page);
    await page.goto("/");
  });

  test("should validate FNR format", async ({ page }) => {
    await page.fill('input[name="fodselsnummer"]', "123");
    await page.locator('button[type="submit"]').click();

    await expect(
      page.locator("text=Fødselsnummeret er ufullstendig"),
    ).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.fill('input[name="fodselsnummer"]', testData.validFnr);
    await page.fill('input[name="etternavn"]', testData.validEtternavn);
    await page.fill('input[name="epost"]', "invalid-email");
    await page.fill('input[name="mobilnummer"]', testData.validMobilnummer);

    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=Ugyldig e-postadresse")).toBeVisible();
  });

  test("should validate mobile number format", async ({ page }) => {
    await page.fill('input[name="fodselsnummer"]', testData.validFnr);
    await page.fill('input[name="etternavn"]', testData.validEtternavn);
    await page.fill('input[name="epost"]', testData.validEmail);
    await page.fill('input[name="mobilnummer"]', "123");

    await page.locator('button[type="submit"]').click();

    await expect(
      page.locator("text=Mobilnummeret må være 8 siffer"),
    ).toBeVisible();
  });
});
