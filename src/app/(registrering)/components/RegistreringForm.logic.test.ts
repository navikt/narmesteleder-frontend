import { describe, expect, it } from "vitest";
import {
  getOrgnummerValidationError,
  shouldMarkOrgnummerTouchedFromHeadingSelector,
} from "@/app/(registrering)/components/RegistreringForm.logic";

describe("getOrgnummerValidationError", () => {
  it("returns undefined when field is untouched and form is not submitted", () => {
    expect(
      getOrgnummerValidationError({
        submissionAttempts: 0,
        isTouched: false,
        errorMessage: "Velg virksomhet",
      }),
    ).toBeUndefined();
  });

  it("returns error when field is touched", () => {
    expect(
      getOrgnummerValidationError({
        submissionAttempts: 0,
        isTouched: true,
        errorMessage: "Velg virksomhet",
      }),
    ).toBe("Velg virksomhet");
  });
});

describe("shouldMarkOrgnummerTouchedFromHeadingSelector", () => {
  it("returns true after interaction when selector is shown", () => {
    expect(
      shouldMarkOrgnummerTouchedFromHeadingSelector({
        showSelector: true,
        selectorInteractionCount: 1,
      }),
    ).toBe(true);
  });

  it("returns false when selector is not shown", () => {
    expect(
      shouldMarkOrgnummerTouchedFromHeadingSelector({
        showSelector: false,
        selectorInteractionCount: 3,
      }),
    ).toBe(false);
  });
});
