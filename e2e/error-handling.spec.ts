import { expect, type Page, test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { validTestData } from "./fixtures/testData";
import { fillAll, getByTestId } from "./utils";

const getSubmitButton = (page: Page) => getByTestId(page, TestId.SendInn);

test.describe("Error Handling", () => {
  test("should show error when fetch fails", async ({ page }) => {
    await page.goto(
      `./${validTestData.requirementId}?mockScenario=fetch-error`,
    );

    await expect(getByTestId(page, TestId.ErrorAlert)).toBeVisible();
  });

  test("should show error when submit fails", async ({ page }) => {
    await page.goto(
      `./${validTestData.requirementId}?mockScenario=submit-error`,
    );

    await fillAll(page, [
      [TestId.LederFodselsnummer, validTestData.fnr],
      [TestId.LederEtternavn, validTestData.etternavn],
      [TestId.Epost, validTestData.email],
      [TestId.Mobilnummer, validTestData.mobilnummer],
    ]);

    await getSubmitButton(page).click();

    await expect(getByTestId(page, TestId.ErrorAlert)).toBeVisible();
  });
});
