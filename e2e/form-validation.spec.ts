import { type Page, test } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import { ValidationMessages } from "@/utils/validationMessages";
import { invalidTestData } from "./fixtures/testData";
import {
  expectAllCount,
  fillAll,
  getByUiSelector,
  searchVirksomhetWithoutChoosing,
} from "./utils";

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
      [UiSelector.SykmeldtFodselsnummer, invalidTestData.fnr],
      [UiSelector.SykmeldtEtternavn, invalidTestData.etternavn],
    ]);
    await searchVirksomhetWithoutChoosing(
      page,
      invalidTestData.virksomhetSoketekst,
    );

    await getSubmitButton(page).click();

    await expectAllCount(page, [
      [ValidationMessages.RequireField, 3],
      [ValidationMessages.LengthAndNumberFnr, 2],
      [ValidationMessages.InvalidMobilnummer, 1],
      [ValidationMessages.InvalidEmail, 1],
    ]);
  });
});
