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
    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    const firstRow = tabell.getByRole("row").nth(1);
    const firstName = await firstRow.getByRole("rowheader").innerText();
    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);

    await sokFelt.fill(firstName);

    await expect(
      tabell.getByRole("rowheader", { name: firstName }),
    ).toBeVisible();
  });

  test("søk filtrerer på fødselsnummer", async ({ page }) => {
    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    const firstRow = tabell.getByRole("row").nth(1);
    const fnr = await firstRow.getByText(/\d{6}\s\d{5}/).innerText();
    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);

    await sokFelt.fill(fnr.replace(/\s/g, ""));

    await expect(tabell.getByText(fnr)).toBeVisible();
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
    const oppgiLederKnapp = tabell
      .getByRole("button", { name: /Oppgi leder/ })
      .first();
    await expect(oppgiLederKnapp).toBeVisible();

    const href = await oppgiLederKnapp.getAttribute("href");
    expect(href).toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
  });

  test("aktive og ikke aktive faner er deaktivert til backend støtter status", async ({
    page,
  }) => {
    const faner = getByUiSelector(page, UiSelector.OversiktFaner);
    const aktiveTab = faner.getByRole("tab", {
      name: /Aktive sykefravær.*Kommer snart/,
    });
    const ikkeAktiveTab = faner.getByRole("tab", {
      name: /Ikke aktive.*Kommer snart/,
    });

    await expect(aktiveTab).toBeDisabled();
    await expect(ikkeAktiveTab).toBeDisabled();
  });
});
