import { expect, test } from "@playwright/test";
import { validTestData } from "./fixtures/testData";

test.describe("Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  // test("should validate FNR format", async ({ page }) => {
  //   await page.fill('input[name="fodselsnummer"]', "123");
  //   await page.locator('button[type="submit"]').click();

  //   await expect(
  //     page.locator("text=Fødselsnummeret er ufullstendig"),
  //   ).toBeVisible();
  // });

  // test("should validate email format", async ({ page }) => {
  //   await page.fill('input[name="fodselsnummer"]', validTestData.validFnr);
  //   await page.fill('input[name="etternavn"]', validTestData.validEtternavn);
  //   await page.fill('input[name="epost"]', "invalid-email");
  //   await page.fill(
  //     'input[name="mobilnummer"]',
  //     validTestData.validMobilnummer,
  //   );

  //   await page.locator('button[type="submit"]').click();

  //   await expect(page.locator("text=Ugyldig e-postadresse")).toBeVisible();
  // });

  // test("should validate mobile number format", async ({ page }) => {
  //   await page.fill('input[name="fodselsnummer"]', validTestData.validFnr);
  //   await page.fill('input[name="etternavn"]', validTestData.validEtternavn);
  //   await page.fill('input[name="epost"]', validTestData.validEmail);
  //   await page.fill('input[name="mobilnummer"]', "123");

  //   await page.locator('button[type="submit"]').click();

  //   await expect(
  //     page.locator("text=Mobilnummeret må være 8 siffer"),
  //   ).toBeVisible();
  // });
});
