import { type Page, test } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import { ValidationMessages } from "@/utils/validationMessages";
import { validTestData } from "./fixtures/testData";
import {
  expectAllCount,
  expectAllVisible,
  fillAll,
  getByUiSelector,
} from "./utils";

const getSubmitButton = (page: Page) =>
  getByUiSelector(page, UiSelector.SendInn);

test.describe("Behov flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the update page with a requirement ID
    await page.goto(`./${validTestData.requirementId}`);
  });

  test("should display edit view", async ({ page }) => {
    await expectAllVisible(page, [
      UiSelector.HeadingLeder,
      UiSelector.OppgiLederPanel,
      UiSelector.SykmeldtBox,
      UiSelector.BehovForm,
      UiSelector.SendInn,
    ]);
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await getSubmitButton(page).click();

    await expectAllCount(page, [
      [ValidationMessages.RequireField, 2],
      [ValidationMessages.RequiredFnr, 1],
      [ValidationMessages.InvalidEmail, 1],
    ]);
  });

  test("should submit updated data and show submit view", async ({ page }) => {
    await fillAll(page, [
      [UiSelector.LederFodselsnummer, validTestData.fnr],
      [UiSelector.LederEtternavn, validTestData.etternavn],
      [UiSelector.Epost, validTestData.email],
      [UiSelector.Mobilnummer, validTestData.mobilnummer],
    ]);

    await getSubmitButton(page).click();

    await expectAllVisible(page, [
      UiSelector.HeadingLeder,
      UiSelector.ThankYouAlert,
      UiSelector.LederInfoDescription,
      UiSelector.BehovSummary,
      UiSelector.ExitButton,
    ]);
  });
});
