import { expect, type Page, test } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import { validTestData } from "./fixtures/testData";
import { fillAll, getByUiSelector } from "./utils";

const getSubmitButton = (page: Page) =>
  getByUiSelector(page, UiSelector.SendInn);

test.describe("Error Handling", () => {
  test("should show error when fetch fails", async ({ page }) => {
    await page.goto(
      `./${validTestData.requirementId}?mockScenario=fetch-error`,
    );

    await expect(getByUiSelector(page, UiSelector.ErrorAlert)).toBeVisible();
  });

  test("should show error when submit fails", async ({ page }) => {
    await page.goto(
      `./${validTestData.requirementId}?mockScenario=submit-error`,
    );

    await fillAll(page, [
      [UiSelector.LederFodselsnummer, validTestData.fnr],
      [UiSelector.LederEtternavn, validTestData.etternavn],
      [UiSelector.Epost, validTestData.email],
      [UiSelector.Mobilnummer, validTestData.mobilnummer],
    ]);

    await getSubmitButton(page).click();

    await expect(getByUiSelector(page, UiSelector.ErrorAlert)).toBeVisible();
  });
});
