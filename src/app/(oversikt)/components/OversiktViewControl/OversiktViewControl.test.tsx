import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UiSelector } from "@/utils/uiSelectors";

vi.mock("server-only", () => ({}));

vi.mock("@/app/(oversikt)/actions/searchLinemanagers", () => ({
  searchLinemanagersAction: vi.fn().mockResolvedValue({
    status: "empty",
    linemanagers: [],
    meta: null,
  }),
}));

const mockState = vi.hoisted(() => ({
  virksomhetProviderProps: undefined as Record<string, unknown> | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
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
  useVirksomhetContext: () => ({
    orgnummer: "963890095",
    orgnavn: "Shark AS",
  }),
  useOptionalVirksomhetContext: () => ({
    orgnummer: "963890095",
    orgnavn: "Shark AS",
  }),
}));

vi.mock(
  "@/app/(oversikt)/components/OversiktViewControl/OversiktHeadingLeder",
  () => ({
    OversiktHeadingLeder: () => (
      <div data-testid="headingVirksomhet">Virksomhetsvelger</div>
    ),
  }),
);

import { OversiktViewControl } from "@/app/(oversikt)/components/OversiktViewControl/OversiktViewControl";

const organisasjoner = [
  {
    orgnr: "963890095",
    navn: "Shark AS",
    underenheter: [],
  },
];

describe("Oversikt ViewControl", () => {
  beforeEach(() => {
    mockState.virksomhetProviderProps = undefined;
  });

  it("viser virksomhetsvelger selv om requirements-kallet feiler", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <OversiktViewControl
        organisasjonerResult={{
          status: "available",
          organisasjoner,
        }}
        requirementsResult={{
          status: "error",
          requirements: [],
        }}
        selectedOrgnr="963890095"
      />,
    );

    expect(mockState.virksomhetProviderProps).toMatchObject({
      organisasjoner,
      initialVirksomhet: {
        orgnummer: "963890095",
        orgnavn: "Shark AS",
      },
      isSelectable: true,
    });
    expect(markup).toContain(`data-testid="${UiSelector.HeadingVirksomhet}"`);
    expect(markup).toContain(`data-testid="${UiSelector.OversiktFeilAlert}"`);
  });

  it("viser én fast oversikt med synlig søk og statusfiltre", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <OversiktViewControl
        organisasjonerResult={{
          status: "available",
          organisasjoner,
        }}
        requirementsResult={{
          status: "available",
          requirements: [],
        }}
        selectedOrgnr="963890095"
      />,
    );

    expect(markup).toContain("Ansatte");
    expect(markup).toContain("Søk og filtrer ansatte i virksomheten.");
    expect(markup).toContain("Status");
    expect(markup).toContain("Mangler nærmeste leder");
    expect(markup).toContain("Aktiv sykmelding");
    expect(markup).toContain("Ingen aktiv sykmelding");
    expect(markup).not.toMatch(/Mangler nærmeste leder \(\d+\)/);
    expect(markup).not.toMatch(/Aktiv sykmelding \(\d+\)/);
    expect(markup).not.toMatch(/Ingen aktiv sykmelding \(\d+\)/);
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain("Søk etter ansatt");
    expect(markup).toContain("Søk med navn eller fødselsnummer");
    expect(markup).toContain(`data-testid="${UiSelector.OversiktSok}"`);
    expect(markup).toContain(
      "Viser ansatte som trenger registrert nærmeste leder.",
    );
  });

  it("viser riktig beskrivelse for ansatte med aktiv sykmelding", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <OversiktViewControl
        organisasjonerResult={{
          status: "available",
          organisasjoner,
        }}
        requirementsResult={{
          status: "available",
          requirements: [],
        }}
        selectedOrgnr="963890095"
        selectedTab="aktiv-sykmelding"
      />,
    );

    expect(markup).toContain("Viser ansatte med aktiv sykmelding.");
    expect(markup).toContain("Søk etter ansatt");
    expect(markup).toContain(`data-testid="${UiSelector.OversiktSok}"`);
    expect(markup).not.toContain(
      "Du kan bryte koblingen mellom ansatt og leder fra",
    );
  });

  it("viser konsekvensen for ansatte uten aktiv sykmelding", () => {
    const markup = ReactDOMServer.renderToStaticMarkup(
      <OversiktViewControl
        organisasjonerResult={{
          status: "available",
          organisasjoner,
        }}
        requirementsResult={{
          status: "available",
          requirements: [],
        }}
        selectedOrgnr="963890095"
        selectedTab="ikke-aktiv-sykmelding"
      />,
    );

    expect(markup).toContain("Søk etter ansatt");
    expect(markup).toContain(`data-testid="${UiSelector.OversiktSok}"`);
    expect(markup).toContain(
      "Viser ansatte uten aktiv sykmelding. Fjerner du nærmeste leder, vil den ansatte ikke lenger vises i oversikten.",
    );
  });
});
