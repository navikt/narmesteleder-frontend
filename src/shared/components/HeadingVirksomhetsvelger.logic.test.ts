import { describe, expect, it } from "vitest";
import {
  getHeadingVirksomhetsvelgerAriaDescribedBy,
  shouldHandleFieldBlur,
} from "@/shared/components/HeadingVirksomhetsvelger.logic";

describe("shouldHandleFieldBlur", () => {
  it("returns true before the field has been blurred since focus", () => {
    expect(shouldHandleFieldBlur(false)).toBe(true);
  });

  it("returns false after the field has already been blurred since focus", () => {
    expect(shouldHandleFieldBlur(true)).toBe(false);
  });
});

describe("getHeadingVirksomhetsvelgerAriaDescribedBy", () => {
  it("includes label and description when there is no error", () => {
    expect(
      getHeadingVirksomhetsvelgerAriaDescribedBy({
        labelId: "field-label",
        descriptionId: "field-description",
        errorId: "field-error",
        hasDescription: true,
        hasError: false,
      }),
    ).toBe("field-label field-description");
  });

  it("replaces describedby ids when error visibility changes", () => {
    const withError = getHeadingVirksomhetsvelgerAriaDescribedBy({
      labelId: "field-label",
      descriptionId: "field-description",
      errorId: "field-error",
      hasDescription: true,
      hasError: true,
    });
    const withoutError = getHeadingVirksomhetsvelgerAriaDescribedBy({
      labelId: "field-label",
      descriptionId: "field-description",
      errorId: "field-error",
      hasDescription: true,
      hasError: false,
    });

    expect(withError).toBe("field-label field-description field-error");
    expect(withoutError).toBe("field-label field-description");
  });
});
