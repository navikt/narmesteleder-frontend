import { expect, type Page } from "@playwright/test";
import type { UiSelector } from "@/utils/uiSelectors";
import type { ValidationMessages } from "@/utils/validationMessages";

const getByText = (page: Page, validationMessage: ValidationMessages) =>
  page.getByText(validationMessage);

export const getByUiSelector = (page: Page, testId: UiSelector) =>
  page.getByTestId(testId);

export const expectAllVisible = async (page: Page, testIds: UiSelector[]) => {
  for (const testId of testIds) {
    await expect(getByUiSelector(page, testId)).toBeVisible();
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
  for (const [testId, value] of fields) {
    await getByUiSelector(page, testId).fill(value);
  }
};
