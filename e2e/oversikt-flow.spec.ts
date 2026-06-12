import { expect, test } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import { expectAllVisible, getByUiSelector } from "./utils";

const OVERSIKT_URL = "./oversikt";

test.describe("Oversikt-flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(OVERSIKT_URL);
  });

  test("viser heading, infoboks, søk og faner", async ({ page }) => {
    await expectAllVisible(page, [
      UiSelector.HeadingLeder,
      UiSelector.OversiktInfoboks,
      UiSelector.OversiktSok,
      UiSelector.OversiktFaner,
    ]);
  });

  test("default-fane er Mangler nærmeste leder", async ({ page }) => {
    const faner = getByUiSelector(page, UiSelector.OversiktFaner);
    const aktivFane = faner.getByRole("tab", { selected: true });
    await expect(aktivFane).toContainText("Mangler nærmeste leder");
  });

  test("tabell viser ansatte uten leder på default-fane", async ({ page }) => {
    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    await expect(tabell).toBeVisible();

    // Verifiser at "Ingen leder"-markering er synlig
    const ingenLederTags = page.getByText("Ingen leder");
    await expect(ingenLederTags.first()).toBeVisible();
  });

  test("søk filtrerer på navn", async ({ page }) => {
    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);

    // Kari Nordmann finnes i mock-data
    await sokFelt.fill("Kari");

    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    await expect(tabell.getByText("Nordmann")).toBeVisible();
  });

  test("søk filtrerer på fødselsnummer", async ({ page }) => {
    // Bytt til aktive-fane for bredere søk
    const faner = getByUiSelector(page, UiSelector.OversiktFaner);
    await faner.getByRole("tab", { name: /Aktive sykefravær/ }).click();

    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);
    // Bruk deler av FNR til Ingrid Berg
    await sokFelt.fill("12057932464");

    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    await expect(tabell.getByText("Berg")).toBeVisible();
  });

  test("viser tom tilstand ved ingen treff", async ({ page }) => {
    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);
    await sokFelt.fill("xyzingentreff999");

    await expect(
      getByUiSelector(page, UiSelector.OversiktTomState),
    ).toBeVisible();
  });

  test("Oppgi leder-knapp navigerer til behov-side", async ({ page }) => {
    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    const oppgiLederLink = tabell
      .getByRole("link", { name: /Oppgi leder/ })
      .first();
    await expect(oppgiLederLink).toBeVisible();

    const href = await oppgiLederLink.getAttribute("href");
    expect(href).toMatch(/11111111-1111-1111-1111-111111111111/);
  });

  test("tab-bytte viser riktige ansatte", async ({ page }) => {
    const faner = getByUiSelector(page, UiSelector.OversiktFaner);

    await faner.getByRole("tab", { name: /Ikke aktive/ }).click();

    // Lars Johansen og Silje Pedersen er isActive: false i mock-data
    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    await expect(tabell.getByText("Johansen")).toBeVisible();
  });

  test("søk nullstilles ved tab-bytte", async ({ page }) => {
    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);
    await sokFelt.fill("Kari");

    const faner = getByUiSelector(page, UiSelector.OversiktFaner);
    await faner.getByRole("tab", { name: /Aktive sykefravær/ }).click();

    await expect(sokFelt).toHaveValue("");
  });

  test("Endre leder-knapp vises for ansatte med nærmeste leder", async ({
    page,
  }) => {
    const faner = getByUiSelector(page, UiSelector.OversiktFaner);
    await faner.getByRole("tab", { name: /Aktive sykefravær/ }).click();

    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    const endreLederLink = tabell
      .getByRole("link", { name: /Endre leder/ })
      .first();
    await expect(endreLederLink).toBeVisible();
  });
});
