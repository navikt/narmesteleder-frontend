import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import { TokenXTargetApi } from "@/server/helpers";

const tokenXFetchGetMock = vi.fn();
const loggerWarnMock = vi.fn();

vi.mock("@navikt/next-logger", () => ({
  logger: {
    warn: loggerWarnMock,
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("server-only", () => ({}));

const importFetchOrganisasjoner = async (isLocalOrDemo: boolean) => {
  vi.resetModules();

  vi.doMock("@/env-variables/envHelpers", () => ({
    isLocalOrDemo,
    isNonProd: true,
    throwEnvSchemaParsingError: vi.fn(),
  }));

  vi.doMock("@/server/tokenXFetch", () => ({
    tokenXFetchGet: tokenXFetchGetMock,
  }));

  return import("@/server/fetchData/fetchOrganisasjoner");
};

beforeEach(() => {
  tokenXFetchGetMock.mockReset();
  loggerWarnMock.mockReset();
});

describe("fetchOrganisasjoner", () => {
  it("bruker mockdata i local/demo", async () => {
    const { fetchOrganisasjoner } = await importFetchOrganisasjoner(true);

    const result = await fetchOrganisasjoner();

    expect(result).toEqual({
      status: "available",
      organisasjoner: mockOrganisasjoner,
    });
    expect(tokenXFetchGetMock).not.toHaveBeenCalled();
  });

  it("henter organisasjoner fra backend i dev/prod", async () => {
    tokenXFetchGetMock.mockResolvedValue(mockOrganisasjoner);

    const { fetchOrganisasjoner } = await importFetchOrganisasjoner(false);
    const result = await fetchOrganisasjoner();

    expect(result).toEqual({
      status: "available",
      organisasjoner: mockOrganisasjoner,
    });
    expect(tokenXFetchGetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        endpoint: expect.stringContaining("/api/v1/tilganger"),
      }),
    );
  });

  it("returnerer tom status når backend svarer med tom liste", async () => {
    tokenXFetchGetMock.mockResolvedValue([]);

    const { fetchOrganisasjoner } = await importFetchOrganisasjoner(false);
    const result = await fetchOrganisasjoner();

    expect(result).toEqual({
      status: "empty",
      organisasjoner: [],
    });
    expect(loggerWarnMock).not.toHaveBeenCalled();
  });

  it("returnerer feilstatus hvis backend-kall feiler", async () => {
    tokenXFetchGetMock.mockRejectedValue(new Error("backend unavailable"));

    const { fetchOrganisasjoner } = await importFetchOrganisasjoner(false);
    const result = await fetchOrganisasjoner();

    expect(result).toEqual({
      status: "error",
      organisasjoner: [],
    });
    expect(loggerWarnMock).toHaveBeenCalled();
  });
});
