import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => ({
  virksomhetProviderProps: undefined as Record<string, unknown> | undefined,
  registreringViewControlProviderProps: undefined as
    | Record<string, unknown>
    | undefined,
}));

vi.mock("@/shared/state/virksomhetContext", () => ({
  VirksomhetProvider: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => {
    mockState.virksomhetProviderProps = props;
    return <>{children}</>;
  },
}));

vi.mock("@/app/(registrering)/state/contextState", () => ({
  RegistreringViewControlProvider: ({
    ...props
  }: {
    [key: string]: unknown;
  }) => {
    mockState.registreringViewControlProviderProps = props;
    return <div>RegistreringViewControlProvider</div>;
  },
}));

vi.mock("@/app/(registrering)/components/EditView", () => ({
  EditView: () => <div>EditView</div>,
}));

vi.mock("@/app/(registrering)/components/SubmitView", () => ({
  SubmitView: () => <div>SubmitView</div>,
}));

import { ViewControl } from "@/app/(registrering)/components/ViewControl";
import { UiSelector } from "@/utils/uiSelectors";

const organisasjoner = [
  {
    orgnr: "912345678",
    navn: "Testbedrift AS",
    underenheter: [],
  },
];

describe("Registrering ViewControl", () => {
  beforeEach(() => {
    mockState.virksomhetProviderProps = undefined;
    mockState.registreringViewControlProviderProps = undefined;
  });

  it("viser virksomhetsvelger når organisasjoner finnes", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <ViewControl
        organisasjonerResult={{
          status: "available",
          organisasjoner,
        }}
      />,
    );

    expect(markup).toContain("RegistreringViewControlProvider");
    expect(mockState.virksomhetProviderProps).toMatchObject({
      organisasjoner,
      isSelectable: true,
      isRequired: true,
    });
  });

  it("viser blokkert feilstate når organisasjonslisten er tom", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <ViewControl
        organisasjonerResult={{
          status: "empty",
          organisasjoner: [],
        }}
      />,
    );

    expect(markup).toContain(
      `data-testid="${UiSelector.OrganisasjonerLoadError}"`,
    );
    expect(markup).toContain(
      "Du kan ikke registrere nærmeste leder akkurat nå",
    );
    expect(markup).toContain("Vi fant ingen virksomheter du kan velge mellom.");
    expect(markup).not.toContain("RegistreringViewControlProvider");
    expect(mockState.virksomhetProviderProps).toBeUndefined();
  });

  it("viser blokkert feilstate når organisasjonslasting feiler", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <ViewControl
        organisasjonerResult={{
          status: "error",
          organisasjoner: [],
        }}
      />,
    );

    expect(markup).toContain(
      `data-testid="${UiSelector.OrganisasjonerLoadError}"`,
    );
    expect(markup).toContain(
      "Vi klarte ikke å hente virksomhetene dine. Prøv igjen litt senere.",
    );
    expect(markup).not.toContain("RegistreringViewControlProvider");
    expect(mockState.virksomhetProviderProps).toBeUndefined();
  });

  it("setter initial virksomhet og sender returnTo videre", () => {
    ReactDOMServer.renderToStaticMarkup(
      <ViewControl
        organisasjonerResult={{
          status: "available",
          organisasjoner,
        }}
        initialOrgnr="912345678"
        returnTo="/arbeidsgiver/ansatte/narmesteleder/oversikt?orgnr=912345678&tab=aktiv-sykmelding"
      />,
    );

    expect(mockState.virksomhetProviderProps).toMatchObject({
      initialVirksomhet: {
        orgnummer: "912345678",
        orgnavn: "Testbedrift AS",
      },
    });
    expect(mockState.registreringViewControlProviderProps).toMatchObject({
      returnTo:
        "/arbeidsgiver/ansatte/narmesteleder/oversikt?orgnr=912345678&tab=aktiv-sykmelding",
    });
  });
});
