import { Page, test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { ValidationMessages } from "@/utils/validationMessages";
import { validTestData } from "./fixtures/validTestData";
import {
  expectAllCount,
  expectAllVisible,
  fillAll,
  getByTestId,
} from "./utils";

const getSubmitButton = (page: Page) => getByTestId(page, TestId.SendInn);

test.describe("Create Line Manager", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should display edit view", async ({ page }) => {
    await expectAllVisible(page, [
      TestId.HeadingLeder,
      TestId.SykmeldtAndLederInfoPanel,
      TestId.RegistrerNarmesteLederRelasjonForm,
      TestId.SendInn,
    ]);
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await getSubmitButton(page).click();

    await expectAllCount(page, [
      [ValidationMessages.RequireField, 4],
      [ValidationMessages.RequiredFnr, 2],
      [ValidationMessages.InvalidEmail, 1],
    ]);
  });

  test("should submit form with valid data", async ({ page }) => {
    await fillAll(page, [
      [TestId.LederFodselsnummer, validTestData.validFnr],
      [TestId.LederEtternavn, validTestData.validEtternavn],
      [TestId.Epost, validTestData.validEmail],
      [TestId.Mobilnummer, validTestData.validMobilnummer],
      [TestId.Organisasjonsnummer, validTestData.validOrgnummer],
      [TestId.SykmeldtFodselsnummer, validTestData.validFnr],
      [TestId.SykmeldtEtternavn, validTestData.validEtternavn],
    ]);

    await getSubmitButton(page).click();

    await expectAllVisible(page, [
      TestId.HeadingLeder,
      TestId.ThankYouAlert,
      TestId.LederInfoDescription,
      TestId.SykmeldtAndLederSummary,
      TestId.ExitButton,
    ]);
  });
});
