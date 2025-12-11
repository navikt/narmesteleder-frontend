import { Page, expect, test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { ValidationMessages } from "@/utils/validationMessages";
import { invalidTestData, validTestData } from "./fixtures/testData";
import { expectAllCount, fillAll, getByTestId } from "./utils";

const getSubmitButton = (page: Page) => getByTestId(page, TestId.SendInn);

test.describe("Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should show validation error when wrong data provided", async ({
    page,
  }) => {
    await fillAll(page, [
      [TestId.LederFodselsnummer, invalidTestData.fnr],
      [TestId.LederEtternavn, invalidTestData.etternavn],
      [TestId.Epost, invalidTestData.email],
      [TestId.Mobilnummer, invalidTestData.mobilnummer],
      [TestId.Organisasjonsnummer, invalidTestData.orgnummer],
      [TestId.SykmeldtFodselsnummer, invalidTestData.fnr],
      [TestId.SykmeldtEtternavn, invalidTestData.etternavn],
    ]);

    await getSubmitButton(page).click();

    await expectAllCount(page, [
      [ValidationMessages.LengthAndNumberFnr, 2],
      [ValidationMessages.InvalidMobilnummer, 1],
      [ValidationMessages.InvalidOrgnummer, 1],
      [ValidationMessages.InvalidEmail, 1],
    ]);
  });

  test("should show backend error when backend fails", async ({ page }) => {
    // Navigate with simulateError query param to trigger error mock
    await page.goto("./?simulateError=true");

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

    // Verify the error alert is displayed
    await expect(getByTestId(page, TestId.ErrorAlert)).toBeVisible();
  });
});
