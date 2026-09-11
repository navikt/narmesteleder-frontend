import { expect, test } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import { expectAllVisible, getByUiSelector } from "./utils";

const OVERSIKT_URL = "./oversikt";

test.describe("Oversikt-flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(OVERSIKT_URL);
  });

  test("viser heading, søkeknapp og filtre", async ({ page }) => {
    await expectAllVisible(page, [
      UiSelector.HeadingLeder,
      UiSelector.OversiktFaner,
      UiSelector.ExpandableSearchTrigger,
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

    await getByUiSelector(page, UiSelector.ExpandableSearchTrigger).click();
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

    await getByUiSelector(page, UiSelector.ExpandableSearchTrigger).click();
    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);
    await sokFelt.fill(fnr.replace(/\s/g, ""));

    await expect(tabell.getByText(fnr)).toBeVisible();
  });

  test("viser tom tilstand ved ingen treff", async ({ page }) => {
    await getByUiSelector(page, UiSelector.ExpandableSearchTrigger).click();
    const sokFelt = getByUiSelector(page, UiSelector.OversiktSok);
    await sokFelt.fill("xyzingentreff999");

    await expect(
      getByUiSelector(page, UiSelector.OversiktTomState),
    ).toBeVisible();
  });

  test("legg til nærmeste leder-navigasjon bruker behov-ID", async ({
    page,
  }) => {
    const tabell = getByUiSelector(page, UiSelector.OversiktTabell);
    const handlinger = tabell
      .getByRole("button", { name: /Handlinger for/ })
      .first();
    await handlinger.click();
    const leggTilLeder = page
      .getByRole("menuitem", { name: "Legg til nærmeste leder" })
      .first();
    await expect(leggTilLeder).toBeVisible();

    const href = await leggTilLeder.getAttribute("href");
    expect(href).toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
  });

  test("aktiv sykmelding viser tabell og begge handlingene", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Aktiv sykmelding", exact: true })
      .click();

    const linemanagerTabell = getByUiSelector(
      page,
      UiSelector.LinemanagerTabell,
    );
    await expect(linemanagerTabell).toBeVisible();

    await linemanagerTabell
      .getByRole("button", { name: /Handlinger for Kari Nordmann/ })
      .click();
    await expect(
      page.getByRole("menuitem", { name: "Endre nærmeste leder" }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Fjern nærmeste leder" }),
    ).toBeVisible();
  });

  test("ingen aktiv sykmelding viser bare fjerning", async ({ page }) => {
    await page
      .getByRole("button", { name: "Ingen aktiv sykmelding", exact: true })
      .click();

    const linemanagerTabell = getByUiSelector(
      page,
      UiSelector.LinemanagerTabell,
    );
    await expect(linemanagerTabell).toBeVisible();
    await linemanagerTabell
      .getByRole("button", { name: /Handlinger for Lars Johansen/ })
      .click();
    await expect(
      page.getByRole("menuitem", { name: "Fjern nærmeste leder" }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Endre nærmeste leder" }),
    ).toHaveCount(0);
  });

  test("bytter nærmeste leder med en PII-fri URL og returnerer til oversikten", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Aktiv sykmelding", exact: true })
      .click();

    const linemanagerTabell = getByUiSelector(
      page,
      UiSelector.LinemanagerTabell,
    );
    await expect(linemanagerTabell).toBeVisible();
    await linemanagerTabell
      .getByRole("button", { name: /Handlinger for Kari Nordmann/ })
      .click();

    const editLink = page.getByRole("menuitem", {
      name: "Endre nærmeste leder",
    });
    const href = await editLink.getAttribute("href");
    expect(href).toMatch(
      /\/endre\/11111111-1111-4111-8111-111111111111\?returnTo=/,
    );
    for (const pii of [
      "Kari",
      "Nordmann",
      "26895514420",
      "ole.hansen@shark.no",
      "91234567",
    ]) {
      expect(href).not.toContain(pii);
    }

    await editLink.click();
    await expect(
      getByUiSelector(page, UiSelector.ReplacementForm),
    ).toBeVisible();
    await expect(
      getByUiSelector(page, UiSelector.HeadingVirksomhet),
    ).toContainText("Shark AS (963 890 095)");
    await getByUiSelector(page, UiSelector.LederFodselsnummer).fill(
      "01010112345",
    );
    await getByUiSelector(page, UiSelector.LederEtternavn).fill("Olsen");
    await getByUiSelector(page, UiSelector.Epost).fill("ny.leder@eksempel.no");
    await getByUiSelector(page, UiSelector.Mobilnummer).fill("90000000");
    await getByUiSelector(page, UiSelector.SendInn).click();

    await expect(getByUiSelector(page, UiSelector.ThankYouAlert)).toBeVisible();
    await page.getByRole("button", { name: "Tilbake til oversikt" }).click();
    await expect(page).toHaveURL(
      /\/oversikt\?orgnr=963890095&tab=aktiv-sykmelding$/,
    );
  });
});
