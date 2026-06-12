import { expect, type Page } from "@playwright/test";
import { UiSelector } from "@/utils/uiSelectors";
import type { ValidationMessages } from "@/utils/validationMessages";

const getByText = (page: Page, validationMessage: ValidationMessages) =>
  page.getByText(validationMessage);

export const getByUiSelector = (page: Page, uiSelector: UiSelector) =>
  page.getByTestId(uiSelector);

export const expectAllVisible = async (
  page: Page,
  uiSelectors: UiSelector[],
) => {
  for (const uiSelector of uiSelectors) {
    await expect(getByUiSelector(page, uiSelector)).toBeVisible();
  }
};

export const expectAllCount = async (
  page: Page,
  items: Array<[ValidationMessages, number]>,
) => {
  for (const [message, count] of items) {
    await expect(getByText(page, message)).toHaveCount(count);
  }
};

export const fillAll = async (
  page: Page,
  fields: Array<[UiSelector, string]>,
) => {
  for (const [uiSelector, value] of fields) {
    await getByUiSelector(page, uiSelector).fill(value);
  }
};

const openVirksomhetsvelger = async (page: Page) => {
  await getByUiSelector(page, UiSelector.Organisasjonsnummer)
    .getByRole("button")
    .first()
    .click();
};

export const chooseVirksomhet = async (
  page: Page,
  {
    hovedenhetNavn,
    virksomhetNavn,
    soketekst,
  }: {
    hovedenhetNavn: string;
    virksomhetNavn: string;
    soketekst: string;
  },
) => {
  await openVirksomhetsvelger(page);
  await page.getByLabel("Søk på virksomhet").fill(soketekst);
  await page.getByRole("button", { name: new RegExp(hovedenhetNavn) }).click();
  await page.getByRole("button", { name: new RegExp(virksomhetNavn) }).click();
};

export const searchVirksomhetWithoutChoosing = async (
  page: Page,
  soketekst: string,
) => {
  await openVirksomhetsvelger(page);
  await page.getByLabel("Søk på virksomhet").fill(soketekst);
  await page.getByRole("button", { name: "lukk virksomhetsvelger" }).click();
};
