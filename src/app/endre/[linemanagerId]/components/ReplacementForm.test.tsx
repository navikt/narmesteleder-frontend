import ReactDOMServer from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  type NarmesteLederInfo,
  narmesteLederInfoSchema,
} from "@/schemas/nærmestelederFormSchema";
import { UiSelector } from "@/utils/uiSelectors";

vi.mock("@/app/(registrering)/hooks/useRegistreringAction", () => ({
  useRegistreringAction: () => ({
    startOpprettNarmesteLeder: vi.fn(),
    error: null,
  }),
}));

import { ReplacementForm } from "./ReplacementForm";

const initialData: NarmesteLederInfo = {
  sykmeldt: {
    fodselsnummer: "",
    etternavn: "",
    orgnummer: "organization-id",
  },
  leder: { fodselsnummer: "", etternavn: "", mobilnummer: "", epost: "" },
};

describe("ReplacementForm", () => {
  it("renders required empty sykmeldt fields without an organization input when name is null", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <ReplacementForm
        initialData={initialData}
        isSykmeldtKnown={false}
        onSuccess={vi.fn()}
      />,
    );

    expect(markup).toContain(
      `data-testid="${UiSelector.SykmeldtFodselsnummer}"`,
    );
    expect(markup).toContain(`data-testid="${UiSelector.SykmeldtEtternavn}"`);
    expect(markup).not.toContain(
      `data-testid="${UiSelector.Organisasjonsnummer}"`,
    );
    expect(markup).toContain('aria-required="true"');
    expect(markup).not.toContain("organization-id");
    const result = narmesteLederInfoSchema.safeParse(initialData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining([
          "sykmeldt.fodselsnummer",
          "sykmeldt.etternavn",
        ]),
      );
    }
  });

  it("retains the read-only sykmeldt box when name is known", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <ReplacementForm
        initialData={{
          ...initialData,
          sykmeldt: {
            ...initialData.sykmeldt,
            fodselsnummer: "known-id",
            etternavn: "Nordmann",
          },
        }}
        isSykmeldtKnown
        onSuccess={vi.fn()}
      />,
    );

    expect(markup).toContain("Nordmann");
    expect(markup).toContain("known-id");
    expect(markup).not.toContain(
      `data-testid="${UiSelector.SykmeldtFodselsnummer}"`,
    );
    expect(markup).not.toContain(
      `data-testid="${UiSelector.SykmeldtEtternavn}"`,
    );
  });
});
