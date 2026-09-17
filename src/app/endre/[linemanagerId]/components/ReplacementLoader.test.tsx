import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import {
  createFrontendError,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "@/server/narmesteLederErrorUtils";

const { fetchLinemanagerReplacementMock, viewControlProps } = vi.hoisted(
  () => ({
    fetchLinemanagerReplacementMock: vi.fn(),
    viewControlProps: {
      current: undefined as Record<string, unknown> | undefined,
    },
  }),
);

vi.mock("@/server/fetchData/fetchLinemanagerReplacement", () => ({
  fetchLinemanagerReplacement: fetchLinemanagerReplacementMock,
}));

vi.mock("@/shared/components/LederInfoError", () => ({
  LederInfoError: () => <div>Mapped error</div>,
}));

vi.mock("./ViewControl", () => ({
  ViewControl: (props: Record<string, unknown>) => {
    viewControlProps.current = props;
    return <div>Replacement form</div>;
  },
}));

import { ReplacementLoader } from "./ReplacementLoader";

describe("ReplacementLoader", () => {
  beforeEach(() => {
    fetchLinemanagerReplacementMock.mockReset();
    viewControlProps.current = undefined;
  });

  it("shows the standard not-found page for invalid or missing IDs", async () => {
    const element = await ReplacementLoader({ unavailable: true });
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    expect(markup).toContain("Beklager, vi fant ikke siden");
    expect(fetchLinemanagerReplacementMock).not.toHaveBeenCalled();
  });

  it("shows the standard not-found page when the relation is absent", async () => {
    fetchLinemanagerReplacementMock.mockResolvedValue(null);
    const element = await ReplacementLoader({ linemanagerId: "relation-id" });
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    expect(markup).toContain("Beklager, vi fant ikke siden");
  });

  it("uses the established mapped error presentation", async () => {
    fetchLinemanagerReplacementMock.mockRejectedValue(
      createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL),
    );
    const element = await ReplacementLoader({ linemanagerId: "relation-id" });
    const markup = ReactDOMServer.renderToStaticMarkup(element);

    expect(markup).toContain("Mapped error");
  });

  it("passes form defaults and endpoint organization context separately", async () => {
    const initialData = {
      sykmeldt: {
        fodselsnummer: "26895514420",
        etternavn: "Nordmann",
        orgnummer: "963890095",
      },
      leder: {
        fodselsnummer: "",
        etternavn: "",
        mobilnummer: "",
        epost: "",
      },
    } satisfies NarmesteLederInfo;
    const virksomhet = { orgnummer: "963890095", orgnavn: "Shark AS" };
    fetchLinemanagerReplacementMock.mockResolvedValue({
      initialData,
      virksomhet,
    });

    const element = await ReplacementLoader({
      linemanagerId: "relation-id",
      returnTo: "/oversikt",
    });
    ReactDOMServer.renderToStaticMarkup(element);

    expect(viewControlProps.current).toEqual({
      initialData,
      initialVirksomhet: virksomhet,
      returnTo: "/oversikt",
    });
  });
});
