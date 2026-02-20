import { expect, type Page } from "@playwright/test";
import type { UiSelector } from "@/utils/uiSelectors";
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
