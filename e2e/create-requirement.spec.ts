import { Page, expect, test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { validTestData } from "./fixtures/validTestData";
import { fillFormByTestId, getByTestId } from "./utils";

const getSubmitButton = (page: Page) => getByTestId(page, TestId.SendInn);

test.describe("Create Line Manager Requirement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should display submit button of the form", async ({ page }) => {
    await expect(getSubmitButton(page)).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await getSubmitButton(page).click();

    await expect(page.getByText("Feltet er påkrevd")).toHaveCount(4);
  });

  test("should submit form with valid data", async ({ page }) => {
    const fields = [
      { testId: TestId.LederFodselsnummer, value: validTestData.validFnr },
      { testId: TestId.LederEtternavn, value: validTestData.validEtternavn },
      { testId: TestId.Epost, value: validTestData.validEmail },
      { testId: TestId.Mobilnummer, value: validTestData.validMobilnummer },
      {
        testId: TestId.Organisasjonsnummer,
        value: validTestData.validOrgnummer,
      },
      { testId: TestId.SykmeldtFodselsnummer, value: validTestData.validFnr },
      { testId: TestId.SykmeldtEtternavn, value: validTestData.validEtternavn },
    ];
    await fillFormByTestId(page, fields);

    // Submit the form
    await getSubmitButton(page).click();

    // Wait for success response (mocked by fake server action)
    await expect(page.locator("text=Takk")).toBeVisible({ timeout: 5000 });
  });
});
