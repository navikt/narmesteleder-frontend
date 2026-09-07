import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFrontendError,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "@/server/narmesteLederErrorUtils";

const tokenXFetchPostMock = vi.fn();

vi.mock("server-only", () => ({}));

const importFetchLinemanagerSearch = async () => {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", () => ({
    isLocalOrDemo: false,
    isNonProd: true,
    throwEnvSchemaParsingError: vi.fn(),
  }));
  vi.doMock("@/server/tokenXFetch", () => ({
    tokenXFetchPost: tokenXFetchPostMock,
  }));
  return import("@/server/fetchData/fetchLinemanagerSearch");
};

beforeEach(() => {
  tokenXFetchPostMock.mockReset();
});

describe("fetchLinemanagerSearch", () => {
  const params = { orgNumber: "999999999", hasActiveSickLeave: true };

  it("returnerer tom status uten backend-kall når organisasjon mangler", async () => {
    const { fetchLinemanagerSearch } = await importFetchLinemanagerSearch();

    await expect(
      fetchLinemanagerSearch({ ...params, orgNumber: "" }),
    ).resolves.toEqual({ status: "empty", linemanagers: [], meta: null });
    expect(tokenXFetchPostMock).not.toHaveBeenCalled();
  });

  it("returnerer feilstatus for en allerede håndtert backend-feil", async () => {
    tokenXFetchPostMock.mockRejectedValue(
      createFrontendError(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL),
    );
    const { fetchLinemanagerSearch } = await importFetchLinemanagerSearch();

    await expect(fetchLinemanagerSearch(params)).resolves.toEqual({
      status: "error",
      linemanagers: [],
      meta: null,
    });
  });

  it("lar uventede feil propagere i stedet for å skjule dem som feilstatus", async () => {
    const error = new TypeError("unexpected mapping failure");
    tokenXFetchPostMock.mockRejectedValue(error);
    const { fetchLinemanagerSearch } = await importFetchLinemanagerSearch();

    await expect(fetchLinemanagerSearch(params)).rejects.toBe(error);
  });
});
