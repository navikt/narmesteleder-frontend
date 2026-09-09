import ReactDOMServer from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NarmesteLederInfo } from "@/schemas/nærmestelederFormSchema";
import {
  createFrontendError,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "@/server/narmesteLederErrorUtils";

const {
  fetchLinemanagerReplacementMock,
  fetchOrganisasjonerMock,
  viewControlProps,
} = vi.hoisted(() => ({
  fetchLinemanagerReplacementMock: vi.fn(),
  fetchOrganisasjonerMock: vi.fn(),
  viewControlProps: {
    current: undefined as Record<string, unknown> | undefined,
  },
}));

vi.mock("@/server/fetchData/fetchLinemanagerReplacement", () => ({
  fetchLinemanagerReplacement: fetchLinemanagerReplacementMock,
}));

vi.mock("@/server/fetchData/fetchOrganisasjoner", () => ({
  fetchOrganisasjoner: fetchOrganisasjonerMock,
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
    fetchOrganisasjonerMock.mockReset();
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

  it("resolves the organisation name for the read-only selector", async () => {
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
    fetchLinemanagerReplacementMock.mockResolvedValue(initialData);
    fetchOrganisasjonerMock.mockResolvedValue({
      status: "available",
      organisasjoner: [
        {
          orgnr: "811076732",
          navn: "Havna Holding AS",
          underenheter: [
            {
              orgnr: "963890095",
              navn: "Shark AS",
              underenheter: [],
            },
          ],
        },
      ],
    });

    const element = await ReplacementLoader({ linemanagerId: "relation-id" });
    ReactDOMServer.renderToStaticMarkup(element);

    expect(viewControlProps.current).toMatchObject({
      initialData,
      initialOrgnavn: "Shark AS",
    });
  });
});
