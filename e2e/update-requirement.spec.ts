import { test } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { validTestData } from "./fixtures/validTestData";
import { expectAllVisible } from "./utils";

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
      TestId.OppiNarmesteLederForSykmeldt,
      TestId.SendInn,
    ]);
  });

  // test("should submit updated data", async ({ page }) => {
  //   // Fill in the form with updated test data
  //   await page.fill('input[name="fodselsnummer"]', validTestData.validFnr);
  //   await page.fill('input[name="etternavn"]', "UpdatedName");
  //   await page.fill('input[name="epost"]', validTestData.validEmail);
  //   await page.fill(
  //     'input[name="mobilnummer"]',
  //     validTestData.validMobilnummer,
  //   );

  //   // Submit the form
  //   await page.locator('button[type="submit"]').click();

  //   // Wait for success response
  //   await expect(page.locator("text=Takk")).toBeVisible({ timeout: 5000 });
  // });
});
