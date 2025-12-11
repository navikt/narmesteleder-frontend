import { Page, expect } from "@playwright/test";
import { TestId } from "@/utils/testIds";
import { ValidationMessages } from "@/utils/validationMessages";

const forAllTestIds = async (
  page: Page,
  testIds: TestId[],
  fn: (locator: ReturnType<typeof getByTestId>) => Promise<void>,
) => {
  for (const testId of testIds) {
    const locator = getByTestId(page, testId);
    await fn(locator);
  }
};

const forAllTestIdsWithData = async <T>(
  page: Page,
  items: Array<{ testId: TestId } & T>,
  fn: (locator: ReturnType<typeof getByTestId>, data: T) => Promise<void>,
) => {
  for (const { testId, ...data } of items) {
    const locator = getByTestId(page, testId);
    await fn(locator, data as T);
  }
};

const getByText = (page: Page, validationMessage: ValidationMessages) =>
  page.getByText(validationMessage);

export const expectAllVisible = async (page: Page, testIds: TestId[]) => {
  await forAllTestIds(page, testIds, async (locator) => {
    await expect(locator).toBeVisible();
  });
};

const forAllValidationMessagesWithData = async <T>(
  page: Page,
  items: Array<{ message: ValidationMessages } & T>,
  fn: (locator: ReturnType<typeof getByText>, data: T) => Promise<void>,
) => {
  for (const { message, ...data } of items) {
    const locator = getByText(page, message);
    await fn(locator, data as T);
  }
};

export const expectAllCount = async (
  page: Page,
  items: Array<[ValidationMessages, number]>,
) => {
  await forAllValidationMessagesWithData(
    page,
    items.map(([message, count]) => ({ message, count })),
    async (locator, { count }) => {
      await expect(locator).toHaveCount(count);
    },
  );
};

export const fillAll = async (page: Page, fields: Array<[TestId, string]>) => {
  await forAllTestIdsWithData(
    page,
    fields.map(([testId, value]) => ({ testId, value })),
    async (locator, { value }) => {
      await locator.fill(value);
    },
  );
};

export const getByTestId = (page: Page, testId: TestId) =>
  page.getByTestId(testId);
