import { expect, type Page } from "@playwright/test";
import type { TestId } from "@/utils/testIds";
import type { ValidationMessages } from "@/utils/validationMessages";

const getByText = (page: Page, validationMessage: ValidationMessages) =>
  page.getByText(validationMessage);

export const getByTestId = (page: Page, testId: TestId) =>
  page.getByTestId(testId);

export const expectAllVisible = async (page: Page, testIds: TestId[]) => {
  for (const testId of testIds) {
    await expect(getByTestId(page, testId)).toBeVisible();
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

export const fillAll = async (page: Page, fields: Array<[TestId, string]>) => {
  for (const [testId, value] of fields) {
    await getByTestId(page, testId).fill(value);
  }
};
