import { Page, test } from "@playwright/test";
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

  test("should submit form with valid data and show submit view", async ({
    page,
  }) => {
    await fillAll(page, [
      [TestId.LederFodselsnummer, validTestData.fnr],
      [TestId.LederEtternavn, validTestData.etternavn],
      [TestId.Epost, validTestData.email],
      [TestId.Mobilnummer, validTestData.mobilnummer],
      [TestId.Organisasjonsnummer, validTestData.orgnummer],
      [TestId.SykmeldtFodselsnummer, validTestData.fnr],
      [TestId.SykmeldtEtternavn, validTestData.etternavn],
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
