import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UiSelector } from "@/utils/uiSelectors";

const mockState = vi.hoisted(() => ({
  virksomhetProviderProps: undefined as Record<string, unknown> | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
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
});
