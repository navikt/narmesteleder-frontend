import { Page, expect, test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { ValidationMessages } from "@/utils/validationMessages";
import { validTestData } from "./fixtures/validTestData";
import { fillFormByTestId, getByTestId } from "./utils";

const getSubmitButton = (page: Page) => getByTestId(page, TestId.SendInn);

test.describe("Create Line Manager Requirement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should display submit button of the form", async ({ page }) => {
    await expect(getByTestId(page, TestId.HeadingLeder)).toBeVisible();
    await expect(
      getByTestId(page, TestId.RegistrerNarmesteLederRelasjonForm),
    ).toBeVisible();
    await expect(getSubmitButton(page)).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await getSubmitButton(page).click();

    await expect(page.getByText(ValidationMessages.RequireField)).toHaveCount(
      4,
    );
    await expect(page.getByText(ValidationMessages.RequiredFnr)).toHaveCount(2);
    await expect(page.getByText(ValidationMessages.InvalidEmail)).toHaveCount(
      1,
    );
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

    await getSubmitButton(page).click();

    await expect(getByTestId(page, TestId.HeadingLeder)).toBeVisible();
    await expect(getByTestId(page, TestId.ThankYouAlert)).toBeVisible();
    await expect(getByTestId(page, TestId.LederInfoDescription)).toBeVisible();
    await expect(
      getByTestId(page, TestId.SykmeldtAndLederSummary),
    ).toBeVisible();
    await expect(getByTestId(page, TestId.ExitButton)).toBeVisible();
  });
});
