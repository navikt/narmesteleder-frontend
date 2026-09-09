import { beforeEach, describe, expect, it, vi } from "vitest";

const tokenXFetchGetMock = vi.fn();

vi.mock("server-only", () => ({}));

const importFetcher = async () => {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", () => ({ isLocalOrDemo: false }));
  vi.doMock("@/env-variables/serverEnv", () => ({
    getServerEnv: () => ({ NARMESTELEDER_BACKEND_HOST: "https://backend" }),
  }));
  vi.doMock("@/server/tokenXFetch", () => ({
    tokenXFetchGet: tokenXFetchGetMock,
  }));
  return import("@/server/fetchData/fetchLinemanagerReplacement");
};

describe("fetchLinemanagerReplacement", () => {
  beforeEach(() => {
    tokenXFetchGetMock.mockReset();
  });

  it("maps loaded employee and organization data while leaving manager fields empty", async () => {
    tokenXFetchGetMock.mockResolvedValue({
      employeeIdentificationNumber: "employee-id",
      orgNumber: "organization-id",
      orgName: "Organization",
      name: { lastName: "Last name" },
    });
    const { fetchLinemanagerReplacement } = await importFetcher();

    await expect(fetchLinemanagerReplacement("relation-id")).resolves.toEqual({
      sykmeldt: {
        fodselsnummer: "employee-id",
        etternavn: "Last name",
        orgnummer: "organization-id",
      },
      leder: {
        fodselsnummer: "",
        etternavn: "",
        mobilnummer: "",
        epost: "",
      },
    });
    expect(tokenXFetchGetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "https://backend/api/v1/linemanager/relation-id",
        returnNullOnNotFound: true,
      }),
    );
  });

  it("returns null for the data-free unavailable response", async () => {
    tokenXFetchGetMock.mockResolvedValue(null);
    const { fetchLinemanagerReplacement } = await importFetcher();

    await expect(
      fetchLinemanagerReplacement("relation-id"),
    ).resolves.toBeNull();
  });
});
