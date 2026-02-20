import { type Page, test } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import { ValidationMessages } from "@/utils/validationMessages";
import { invalidTestData } from "./fixtures/testData";
import { expectAllCount, fillAll, getByUiSelector } from "./utils";

const getSubmitButton = (page: Page) =>
  getByUiSelector(page, UiSelector.SendInn);

test.describe("Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should show validation error when wrong data provided", async ({
    page,
  }) => {
    await fillAll(page, [
      [UiSelector.LederFodselsnummer, invalidTestData.fnr],
      [UiSelector.LederEtternavn, invalidTestData.etternavn],
      [UiSelector.Epost, invalidTestData.email],
      [UiSelector.Mobilnummer, invalidTestData.mobilnummer],
      [UiSelector.Organisasjonsnummer, invalidTestData.orgnummer],
      [UiSelector.SykmeldtFodselsnummer, invalidTestData.fnr],
      [UiSelector.SykmeldtEtternavn, invalidTestData.etternavn],
    ]);

    await getSubmitButton(page).click();

    await expectAllCount(page, [
      [ValidationMessages.LengthAndNumberFnr, 2],
      [ValidationMessages.InvalidMobilnummer, 1],
      [ValidationMessages.InvalidOrgnummer, 1],
      [ValidationMessages.InvalidEmail, 1],
    ]);
  });
});
