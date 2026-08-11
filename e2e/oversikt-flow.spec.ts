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

  test("tabell viser ansatte ", async ({ page }) => {
    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    await expect(tabell).toBeVisible();
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

  test("aktiv sykmelding-fane viser linemanager-tabell med handlinger", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Aktiv sykmelding" }).click();

    const linemanagerTabell = getByUiSelector(
      page,
      UiSelector.LinemanagerTabell,
    );
    await expect(linemanagerTabell).toBeVisible();

    await expect(
      page.getByRole("link", { name: /Endre eller bytt leder for/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Bryt kobling til leder for/i }).first(),
    ).toBeVisible();
  });

  test("ikke aktiv sykmelding-fane viser bryt kobling, men ikke endre leder", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Ikke aktiv sykmelding" }).click();

    await expect(
      getByUiSelector(page, UiSelector.LinemanagerTabell),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Bryt kobling til leder for/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Endre eller bytt leder for/i }),
    ).toHaveCount(0);
  });

  test("endre leder fra aktiv fane prefyller skjema og tilbakeknapp går til aktiv fane", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Aktiv sykmelding" }).click();
    await expect(
      getByUiSelector(page, UiSelector.LinemanagerTabell),
    ).toBeVisible();

    await page
      .getByRole("link", { name: /Endre eller bytt leder for/i })
      .first()
      .click();

    await expect(page).toHaveURL(/employeeIdentificationNumber=\d{11}/);
    await expect(page).toHaveURL(/lastName=/);
    await expect(
      getByUiSelector(page, UiSelector.SykmeldtFodselsnummer),
    ).toHaveValue(/\d{11}/);
    await expect(
      page.getByRole("link", { name: "Tilbake til oversikt" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Tilbake til oversikt" }).click();

    await expect(page).toHaveURL(
      /\/oversikt\?orgnr=\d{9}&tab=aktiv-sykmelding/,
    );
    await expect(
      page.getByRole("tab", { name: "Aktiv sykmelding", selected: true }),
    ).toBeVisible();
  });
});
