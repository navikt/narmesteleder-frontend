import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockLinemanagerIds,
  mockLinemanagerSearchActive,
  mockLinemanagerSearchInactive,
} from "@/mocks/data/mockLinemanagerSearch";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { NARMESTE_LEDER_FALLBACK_ERROR_DETAIL } from "../narmesteLederErrorUtils";

const tokenXFetchGetMock = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@/mocks/simulateBackendDelay", () => ({
  simulateBackendDelay: vi.fn(),
}));

const importFetcher = async (isLocalOrDemo = false) => {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", () => ({ isLocalOrDemo }));
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

  it.each(mockLinemanagerSearchActive.linemanagers)(
    "maps active mock relation $linemanagerId to that employee and organization",
    async (selectedRelation) => {
      const { fetchLinemanagerReplacement } = await importFetcher(true);

      await expect(
        fetchLinemanagerReplacement(selectedRelation.linemanagerId),
      ).resolves.toEqual({
        sykmeldt: {
          fodselsnummer: selectedRelation.employee.nationalIdentificationNumber,
          etternavn: selectedRelation.employee.name?.lastName,
          orgnummer: selectedRelation.orgNumber,
        },
        leder: {
          fodselsnummer: "",
          etternavn: "",
          mobilnummer: "",
          epost: "",
        },
      });
      expect(tokenXFetchGetMock).not.toHaveBeenCalled();
    },
  );

  it("uses valid UUIDs for all local relation fixtures", () => {
    const relationIds = [
      ...mockLinemanagerSearchActive.linemanagers,
      ...mockLinemanagerSearchInactive.linemanagers,
    ].map(({ linemanagerId }) => linemanagerId);

    expect(
      relationIds.every(
        (linemanagerId) => requirementIdSchema.safeParse(linemanagerId).success,
      ),
    ).toBe(true);
  });

  it.each([
    ["inactive", mockLinemanagerIds.inactiveLars],
    ["unknown", "44444444-4444-4444-8444-444444444444"],
  ])("returns null for an %s mock relation ID", async (_case, id) => {
    const { fetchLinemanagerReplacement } = await importFetcher(true);

    await expect(fetchLinemanagerReplacement(id)).resolves.toBeNull();
  });

  it("retains the local fetch-error scenario", async () => {
    const { fetchLinemanagerReplacement } = await importFetcher(true);

    await expect(
      fetchLinemanagerReplacement(mockLinemanagerIds.activeKari, "fetch-error"),
    ).rejects.toMatchObject({
      name: "FrontendError",
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    });
  });
});
