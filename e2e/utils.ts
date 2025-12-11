import { Page } from "@playwright/test";
import { TestId } from "@/utils/testIds";

export const fillFormByTestId = (
  page: Page,
  fields: Array<{ testId: TestId; value: string }>,
) =>
  Promise.all(
    fields.map(({ testId, value }) => fillByTestId(page, testId, value)),
  );

export const getByTestId = (page: Page, testId: TestId) =>
  page.getByTestId(testId);

export const fillByTestId = async (
  page: Page,
  testId: TestId,
  value: string,
) => {
  await page.getByTestId(testId).fill(value);
};
