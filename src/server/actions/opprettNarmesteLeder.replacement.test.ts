import { beforeEach, describe, expect, it, vi } from "vitest";

const tokenXFetchUpdateMock = vi.fn();

vi.mock("server-only", () => ({}));

const importAction = async () => {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", () => ({ isNonProd: true }));
  vi.doMock("@/env-variables/serverEnv", () => ({
    getServerEnv: () => ({ NARMESTELEDER_BACKEND_HOST: "https://backend" }),
  }));
  vi.doMock("@/server/tokenXFetch", () => ({
    tokenXFetchUpdate: tokenXFetchUpdateMock,
  }));
  vi.doMock("@/server/observability/runtimeErrorLogger", () => ({
    logRuntimeValidationWarning: vi.fn(),
    RuntimeValidationTarget: { NARMESTE_LEDER_INFO: "narmeste_leder_info" },
  }));
  return import("@/server/actions/opprettNarmesteLeder");
};

const replacementData = {
  sykmeldt: {
    fodselsnummer: "11111111111",
    etternavn: "Employee",
    orgnummer: "123456789",
  },
  leder: {
    fodselsnummer: "22222222222",
    etternavn: "Manager",
    mobilnummer: "12345678",
    epost: "manager@example.test",
  },
};

describe("opprettNarmesteLeder replacement submission", () => {
  beforeEach(() => {
    tokenXFetchUpdateMock.mockReset();
  });

  it("submits the replacement through POST and returns success", async () => {
    tokenXFetchUpdateMock.mockResolvedValue({ success: true });
    const { opprettNarmesteLeder } = await importAction();

    await expect(opprettNarmesteLeder(replacementData)).resolves.toEqual({
      success: true,
    });
    expect(tokenXFetchUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "https://backend/api/v1/linemanager",
        method: "POST",
      }),
    );
  });

  it("returns the existing action error for a rejected replacement", async () => {
    const result = {
      success: false as const,
      errorDetail: { title: "Error", message: "Try again" },
    };
    tokenXFetchUpdateMock.mockResolvedValue(result);
    const { opprettNarmesteLeder } = await importAction();

    await expect(opprettNarmesteLeder(replacementData)).resolves.toEqual(
      result,
    );
  });
});
