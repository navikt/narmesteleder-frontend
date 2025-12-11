import { Page, test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { ValidationMessages } from "@/utils/validationMessages";
import { invalidTestData } from "./fixtures/testData";
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
});
