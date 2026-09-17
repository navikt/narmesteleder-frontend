import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockLinemanagerIds,
  mockLinemanagerSearchActive,
  mockLinemanagerSearchInactive,
} from "@/mocks/data/mockLinemanagerSearch";
import { mockOrganisasjoner } from "@/mocks/data/mockOrganisasjoner";
import { replacementSchema } from "@/schemas/lineManagerReadSchema";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { findOrganisasjonNavn } from "@/utils/findOrganisasjonNavn";
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
    const response = {
      linemanagerRelation: {
        id: "11111111-1111-4111-8111-111111111111",
        employee: {
          nationalIdentificationNumber: "employee-id",
          name: {
            firstName: "Ola",
            middleName: null,
            lastName: "Nordmann",
          },
        },
        organization: {
          orgNumber: "organization-id",
          name: "organization-name",
        },
      },
    };
    expect(replacementSchema.safeParse(response).success).toBe(true);
    tokenXFetchGetMock.mockResolvedValue(response);
    const { fetchLinemanagerReplacement } = await importFetcher();

    await expect(fetchLinemanagerReplacement("relation-id")).resolves.toEqual({
      initialData: {
        sykmeldt: {
          fodselsnummer: "employee-id",
          etternavn: "Nordmann",
          orgnummer: "organization-id",
        },
        leder: {
          fodselsnummer: "",
          etternavn: "",
          mobilnummer: "",
          epost: "",
        },
      },
      virksomhet: {
        orgnummer: "organization-id",
        orgnavn: "organization-name",
      },
    });
    expect(tokenXFetchGetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "https://backend/internal/api/v1/linemanager/relation-id",
        returnNullOnNotFound: true,
      }),
    );
    const { responseDataSchema } = tokenXFetchGetMock.mock.calls[0][0] as {
      responseDataSchema: typeof replacementSchema;
    };
    expect(responseDataSchema.safeParse(response).success).toBe(true);
  });

  it("requires a UUID and nullable middleName in the nested response", () => {
    const response = {
      linemanagerRelation: {
        id: mockLinemanagerIds.activeKari,
        employee: {
          nationalIdentificationNumber: "employee-id",
          name: { firstName: "Ola", middleName: "Per", lastName: "Nordmann" },
        },
        organization: { orgNumber: "organization-id", name: "Test AS" },
      },
    };
    expect(replacementSchema.safeParse(response).success).toBe(true);
    expect(
      replacementSchema.safeParse({
        linemanagerRelation: { ...response.linemanagerRelation, id: "invalid" },
      }).success,
    ).toBe(false);
    expect(
      replacementSchema.safeParse({
        linemanagerRelation: {
          ...response.linemanagerRelation,
          employee: {
            ...response.linemanagerRelation.employee,
            name: { firstName: "Ola", lastName: "Nordmann" },
          },
        },
      }).success,
    ).toBe(false);
  });

  it("returns null for the data-free unavailable response", async () => {
    tokenXFetchGetMock.mockResolvedValue(null);
    const { fetchLinemanagerReplacement } = await importFetcher();

    await expect(
      fetchLinemanagerReplacement("relation-id"),
    ).resolves.toBeNull();
  });

  it("preserves a safe overview return path through login", async () => {
    tokenXFetchGetMock.mockResolvedValue(null);
    const { fetchLinemanagerReplacement } = await importFetcher();

    await fetchLinemanagerReplacement(
      "relation-id",
      undefined,
      "/oversikt?orgnr=912345678&tab=aktiv-sykmelding",
    );

    expect(tokenXFetchGetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        redirectAfterLoginUrl:
          "/arbeidsgiver/ansatte/narmesteleder/endre/relation-id?returnTo=%2Farbeidsgiver%2Fansatte%2Fnarmesteleder%2Foversikt%3Forgnr%3D912345678%26tab%3Daktiv-sykmelding",
      }),
    );
  });

  it.each(mockLinemanagerSearchActive.linemanagers)(
    "maps active mock relation $linemanagerId to that employee and organization",
    async (selectedRelation) => {
      const { fetchLinemanagerReplacement } = await importFetcher(true);

      await expect(
        fetchLinemanagerReplacement(selectedRelation.linemanagerId),
      ).resolves.toEqual({
        initialData: {
          sykmeldt: {
            fodselsnummer:
              selectedRelation.employee.nationalIdentificationNumber,
            etternavn: selectedRelation.employee.name?.lastName,
            orgnummer: selectedRelation.orgNumber,
          },
          leder: {
            fodselsnummer: "",
            etternavn: "",
            mobilnummer: "",
            epost: "",
          },
        },
        virksomhet: {
          orgnummer: selectedRelation.orgNumber,
          orgnavn: findOrganisasjonNavn(
            selectedRelation.orgNumber,
            mockOrganisasjoner,
          ),
        },
      });
      expect(tokenXFetchGetMock).not.toHaveBeenCalled();
    },
  );

  it("provides a valid response with a non-empty organization name in demo", async () => {
    const { getMockLinemanagerReplacement } = await import(
      "@/mocks/data/mockLinemanagerReplacement"
    );
    const response = getMockLinemanagerReplacement(
      mockLinemanagerIds.activeKari,
    );
    expect(replacementSchema.safeParse(response).success).toBe(true);
    expect(response?.linemanagerRelation.organization.name).toBe("Shark AS");
  });

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
