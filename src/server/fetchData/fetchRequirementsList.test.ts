import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRequirementsList } from "@/mocks/data/mockRequirementsList";
import { TokenXTargetApi } from "@/server/helpers";

const tokenXFetchGetMock = vi.fn();
const loggerWarnMock = vi.fn();

const collectionResponse = (requirements = mockRequirementsList) => ({
  linemanagerRequirements: requirements,
  meta: {
    size: requirements.length,
    pageSize: 50,
    hasMore: false,
  },
});

vi.mock("@navikt/next-logger", () => ({
  logger: {
    warn: loggerWarnMock,
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("server-only", () => ({}));

const importFetchRequirementsList = async (isLocalOrDemo: boolean) => {
  vi.resetModules();

  vi.doMock("@/env-variables/envHelpers", () => ({
    isLocalOrDemo,
    isNonProd: true,
    throwEnvSchemaParsingError: vi.fn(),
  }));

  vi.doMock("@/server/tokenXFetch", () => ({
    tokenXFetchGet: tokenXFetchGetMock,
  }));

  return import("@/server/fetchData/fetchRequirementsList");
};

beforeEach(() => {
  tokenXFetchGetMock.mockReset();
  loggerWarnMock.mockReset();
});

describe("fetchRequirementsList", () => {
  it("bruker mockdata i local/demo", async () => {
    const { fetchRequirementsList } = await importFetchRequirementsList(true);

    const result = await fetchRequirementsList("963890095");

    expect(result.status).toBe("available");
    expect(result.requirements).toEqual(mockRequirementsList);
    expect(tokenXFetchGetMock).not.toHaveBeenCalled();
  });

  it("returnerer tom liste ved ukjent orgnr i local/demo", async () => {
    const { fetchRequirementsList } = await importFetchRequirementsList(true);

    const result = await fetchRequirementsList("000000000");

    expect(result).toEqual({ status: "empty", requirements: [] });
    expect(tokenXFetchGetMock).not.toHaveBeenCalled();
  });

  it("returnerer tom status for tomt orgnummer i local/demo", async () => {
    const { fetchRequirementsList } = await importFetchRequirementsList(true);

    const result = await fetchRequirementsList("");

    expect(result).toEqual({ status: "empty", requirements: [] });
  });

  it("henter requirements fra backend i dev/prod", async () => {
    tokenXFetchGetMock.mockResolvedValue(collectionResponse());

    const { fetchRequirementsList } = await importFetchRequirementsList(false);
    const { lineManagerRequirementsCollectionSchema } = await import(
      "@/schemas/lineManagerRequirementsListSchema"
    );

    const result = await fetchRequirementsList("963890095");

    expect(result.status).toBe("available");
    expect(result.requirements).toEqual(mockRequirementsList);
    expect(tokenXFetchGetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        endpoint: expect.stringMatching(
          /\/api\/v1\/linemanager\/requirement\?orgNumber=963890095&createdAfter=\d{4}-\d{2}-\d{2}T\d{2}%3A\d{2}%3A\d{2}\.\d{3}Z/,
        ),
        responseDataSchema: lineManagerRequirementsCollectionSchema,
      }),
    );
  });

  it("returnerer tom status når backend svarer med tom liste", async () => {
    tokenXFetchGetMock.mockResolvedValue(collectionResponse([]));

    const { fetchRequirementsList } = await importFetchRequirementsList(false);
    const result = await fetchRequirementsList("963890095");

    expect(result).toEqual({ status: "empty", requirements: [] });
    expect(loggerWarnMock).not.toHaveBeenCalled();
  });

  it("returnerer feilstatus hvis backend-kall feiler", async () => {
    tokenXFetchGetMock.mockRejectedValue(new Error("backend unavailable"));

    const { fetchRequirementsList } = await importFetchRequirementsList(false);
    const result = await fetchRequirementsList("963890095");

    expect(result).toEqual({ status: "error", requirements: [] });
    expect(loggerWarnMock).toHaveBeenCalled();
  });

  it("returnerer tom status for tomt orgnummer i dev/prod", async () => {
    const { fetchRequirementsList } = await importFetchRequirementsList(false);
    const result = await fetchRequirementsList("");

    expect(result).toEqual({ status: "empty", requirements: [] });
    expect(tokenXFetchGetMock).not.toHaveBeenCalled();
  });
});
