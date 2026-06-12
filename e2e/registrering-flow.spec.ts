import { expect, type Page, test } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import { ValidationMessages } from "@/utils/validationMessages";
import { validTestData } from "./fixtures/testData";
import {
  chooseVirksomhet,
  expectAllCount,
  expectAllVisible,
  fillAll,
  getByUiSelector,
} from "./utils";

const getSubmitButton = (page: Page) =>
  getByUiSelector(page, UiSelector.SendInn);

test.describe("Registrering flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should display edit view", async ({ page }) => {
    await expectAllVisible(page, [
      UiSelector.HeadingLeder,
      UiSelector.RegistreringInfoPanel,
      UiSelector.RegistreringForm,
      UiSelector.SendInn,
    ]);
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await getSubmitButton(page).click();

    await expectAllCount(page, [
      // Virksomhet is pre-selected by default, so only 3 required-field errors (not 4)
      [ValidationMessages.RequireField, 3],
      [ValidationMessages.RequiredFnr, 2],
      [ValidationMessages.InvalidEmail, 1],
    ]);
  });

  test("should submit form with valid data and show submit view", async ({
    page,
  }) => {
    await fillAll(page, [
      [UiSelector.LederFodselsnummer, validTestData.fnr],
      [UiSelector.LederEtternavn, validTestData.etternavn],
      [UiSelector.Epost, validTestData.email],
      [UiSelector.Mobilnummer, validTestData.mobilnummer],
      [UiSelector.SykmeldtFodselsnummer, validTestData.fnr],
      [UiSelector.SykmeldtEtternavn, validTestData.etternavn],
    ]);
    await chooseVirksomhet(page, {
      hovedenhetNavn: validTestData.virksomhetHovedenhetNavn,
      virksomhetNavn: validTestData.virksomhetNavn,
      soketekst: validTestData.virksomhetSoketekst,
    });

    await getSubmitButton(page).click();

    await expectAllVisible(page, [
      UiSelector.HeadingLeder,
      UiSelector.ThankYouAlert,
      UiSelector.LederInfoDescription,
      UiSelector.RegistreringSummary,
      UiSelector.ExitButton,
    ]);
  });

  test("should keep selected virksomhet when returning to edit view", async ({
    page,
  }) => {
    await fillAll(page, [
      [UiSelector.LederFodselsnummer, validTestData.fnr],
      [UiSelector.LederEtternavn, validTestData.etternavn],
      [UiSelector.Epost, validTestData.email],
      [UiSelector.Mobilnummer, validTestData.mobilnummer],
      [UiSelector.SykmeldtFodselsnummer, validTestData.fnr],
      [UiSelector.SykmeldtEtternavn, validTestData.etternavn],
    ]);
    await chooseVirksomhet(page, {
      hovedenhetNavn: validTestData.virksomhetHovedenhetNavn,
      virksomhetNavn: validTestData.virksomhetNavn,
      soketekst: validTestData.virksomhetSoketekst,
    });

    await getSubmitButton(page).click();
    await page.getByRole("link", { name: "Endre" }).first().click();

    await expect(
      getByUiSelector(page, UiSelector.Organisasjonsnummer).getByRole(
        "button",
        {
          name: new RegExp(validTestData.virksomhetNavn),
        },
      ),
    ).toBeVisible();
  });
});
