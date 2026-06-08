import { describe, expect, it } from "vitest";
import {
  getHeadingVirksomhetsvelgerAriaDescribedBy,
  getHeadingVirksomhetsvelgerAriaLabel,
  getVirksomhetsvelgerOrganisasjoner,
  shouldClearVirksomhetFromSelectorButton,
  shouldHandleFieldBlur,
  withEmptyVirksomhetsvalg,
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

describe("getHeadingVirksomhetsvelgerAriaLabel", () => {
  it("returns a complete label when no virksomhet is selected", () => {
    expect(
      getHeadingVirksomhetsvelgerAriaLabel({
        orgnavn: "",
        orgnummer: "",
      }),
    ).toBe("Virksomhetsmeny. Ingen virksomhet valgt");
  });

  it("returns a complete label when a virksomhet is selected", () => {
    expect(
      getHeadingVirksomhetsvelgerAriaLabel({
        orgnavn: "Aurora Consulting AS",
        orgnummer: "876543219",
      }),
    ).toBe(
      "Virksomhetsmeny. Valgt virksomhet er Aurora Consulting AS med virksomhetsnummer 876543219",
    );
  });
});

describe("withEmptyVirksomhetsvalg", () => {
  it("adds an explicit empty option as the first underenhet when none exists", () => {
    const result = withEmptyVirksomhetsvalg([
      {
        orgnr: "987654321",
        navn: "Nordlys Gruppen AS",
        underenheter: [
          {
            orgnr: "876543219",
            navn: "Aurora Consulting AS",
            underenheter: [],
          },
        ],
      },
    ]);

    expect(result[0]).toEqual({
      orgnr: "987654321",
      navn: "Nordlys Gruppen AS",
      underenheter: [
        {
          orgnr: "",
          navn: "Velg virksomhet",
          underenheter: [],
        },
        {
          orgnr: "876543219",
          navn: "Aurora Consulting AS",
          underenheter: [],
        },
      ],
    });
  });

  it("keeps input unchanged when empty option already exists", () => {
    const organisasjoner = [
      {
        orgnr: "",
        navn: "Velg virksomhet",
        underenheter: [],
      },
    ];

    expect(withEmptyVirksomhetsvalg(organisasjoner)).toBe(organisasjoner);
  });
});

describe("getVirksomhetsvelgerOrganisasjoner", () => {
  const organisasjoner = [
    {
      orgnr: "987654321",
      navn: "Nordlys Gruppen AS",
      underenheter: [
        {
          orgnr: "876543219",
          navn: "Aurora Consulting AS",
          underenheter: [],
        },
      ],
    },
  ];

  it("includes the empty option only while initializing an empty selection", () => {
    const result = getVirksomhetsvelgerOrganisasjoner({
      organisasjoner,
      orgnummer: "",
      hasInitializedSelection: false,
    });

    expect(result[0]?.underenheter[0]).toEqual({
      orgnr: "",
      navn: "Velg virksomhet",
      underenheter: [],
    });
  });

  it("returns the original list after initialization when nothing is selected", () => {
    expect(
      getVirksomhetsvelgerOrganisasjoner({
        organisasjoner,
        orgnummer: "",
        hasInitializedSelection: true,
      }),
    ).toBe(organisasjoner);
  });

  it("returns the original list when a virksomhet is already selected", () => {
    expect(
      getVirksomhetsvelgerOrganisasjoner({
        organisasjoner,
        orgnummer: "876543219",
        hasInitializedSelection: false,
      }),
    ).toBe(organisasjoner);
  });
});

describe("shouldClearVirksomhetFromSelectorButton", () => {
  it("returns true for the explicit empty option in dropdown", () => {
    expect(
      shouldClearVirksomhetFromSelectorButton({
        ariaHasPopup: null,
        ariaPressed: "false",
        buttonText: "Velg virksomhetOrg.nr.",
      }),
    ).toBe(true);
  });

  it("returns false for the trigger button", () => {
    expect(
      shouldClearVirksomhetFromSelectorButton({
        ariaHasPopup: "true",
        ariaPressed: null,
        buttonText: "Velg virksomhetOrg.nr.",
      }),
    ).toBe(false);
  });

  it("returns false for ordinary virksomhet values", () => {
    expect(
      shouldClearVirksomhetFromSelectorButton({
        ariaHasPopup: null,
        ariaPressed: "true",
        buttonText: "Aurora Consulting ASOrg.nr. 876543219",
      }),
    ).toBe(false);
  });
});
