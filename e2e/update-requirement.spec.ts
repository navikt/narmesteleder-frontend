import { type Page, test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { ValidationMessages } from "@/utils/validationMessages";
import { validTestData } from "./fixtures/testData";
import {
  expectAllCount,
  expectAllVisible,
  fillAll,
  getByTestId,
} from "./utils";

const getSubmitButton = (page: Page) => getByTestId(page, TestId.SendInn);

test.describe("Update Line Manager", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the update page with a requirement ID
    await page.goto(`./${validTestData.requirementId}`);
  });

  test("should display edit view", async ({ page }) => {
    await expectAllVisible(page, [
      TestId.HeadingLeder,
      TestId.OppgiLederPanel,
      TestId.SykmeldtBox,
      TestId.BehovForm,
      TestId.SendInn,
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
      [TestId.LederFodselsnummer, validTestData.fnr],
      [TestId.LederEtternavn, validTestData.etternavn],
      [TestId.Epost, validTestData.email],
      [TestId.Mobilnummer, validTestData.mobilnummer],
    ]);

    await getSubmitButton(page).click();

    await expectAllVisible(page, [
      TestId.HeadingLeder,
      TestId.ThankYouAlert,
      TestId.LederInfoDescription,
      TestId.BehovSummary,
      TestId.ExitButton,
    ]);
  });
});
