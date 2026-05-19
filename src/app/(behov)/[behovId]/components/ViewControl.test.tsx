import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => ({
  virksomhetProviderProps: {} as Record<string, unknown>,
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

vi.mock("@/app/(behov)/[behovId]/state/contextState", () => ({
  BehovViewControlProvider: () => <div>BehovViewControlProvider</div>,
}));

vi.mock("@/app/(behov)/[behovId]/components/EditView", () => ({
  EditView: () => <div>EditView</div>,
}));

vi.mock("@/app/(behov)/[behovId]/components/SubmitView", () => ({
  SubmitView: () => <div>SubmitView</div>,
}));

import { ViewControl } from "@/app/(behov)/[behovId]/components/ViewControl";

const lederInfo = {
  id: "behov-id",
  sykmeldtFnr: "12345678910",
  orgnummer: "912345678",
  orgnavn: "Testbedrift AS",
  hovedenhetOrgnummer: "987654321",
  narmesteLederFnr: "10987654321",
  sykmeldt: {
    fornavn: "Ola",
    etternavn: "Nordmann",
    mellomnavn: null,
    fullnavn: "Ola Nordmann",
  },
};

describe("Behov ViewControl", () => {
  beforeEach(() => {
    mockState.virksomhetProviderProps = {};
  });

  it("uses virksomhet as read-only context in all environments", () => {
    ReactDOMServer.renderToStaticMarkup(
      <ViewControl lederInfo={lederInfo} behovId="behov-id" />,
    );

    expect(mockState.virksomhetProviderProps).toMatchObject({
      initialVirksomhet: {
        orgnummer: "912345678",
        orgnavn: "Testbedrift AS",
      },
      isSelectable: false,
    });
    expect(mockState.virksomhetProviderProps).not.toHaveProperty(
      "organisasjoner",
    );
  });
});
