import { beforeEach, describe, expect, it, vi } from "vitest";
import { TokenXTargetApi } from "@/server/helpers";
import { RuntimeErrorOperation } from "@/server/observability/runtimeErrorContract";
import { NARMESTE_LEDER_FALLBACK_ERROR_DETAIL } from "../narmesteLederErrorUtils";

const simulateBackendDelayMock = vi.fn();
const tokenXFetchUpdateMock = vi.fn();
const logRuntimeValidationWarningMock = vi.fn();

vi.mock("server-only", () => ({}));

const importAction = async (isLocalOrDemo: boolean) => {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", () => ({ isLocalOrDemo }));
  vi.doMock("@/env-variables/serverEnv", () => ({
    getServerEnv: () => ({ NARMESTELEDER_BACKEND_HOST: "https://backend" }),
  }));
  vi.doMock("@/mocks/simulateBackendDelay", () => ({
    simulateBackendDelay: simulateBackendDelayMock,
  }));
  vi.doMock("@/server/tokenXFetch", () => ({
    tokenXFetchUpdate: tokenXFetchUpdateMock,
  }));
  vi.doMock(
    "@/server/observability/runtimeErrorLogger",
    async (importOriginal) => {
      const actual =
        await importOriginal<
          typeof import("@/server/observability/runtimeErrorLogger")
        >();

      return {
        ...actual,
        logRuntimeValidationWarning: logRuntimeValidationWarningMock,
      };
    },
  );
  return import("@/server/actions/revokeLinemanager");
};

const validPayload = {
  employeeIdentificationNumber: "00000000000",
  orgNumber: "000000000",
  lastName: "Testperson",
};

describe("revokeLinemanager", () => {
  beforeEach(() => {
    simulateBackendDelayMock.mockReset();
    tokenXFetchUpdateMock.mockReset();
    logRuntimeValidationWarningMock.mockReset();
  });

  it("returns success without calling TokenX for a valid local/demo revoke", async () => {
    const { revokeLinemanager } = await importAction(true);

    await expect(revokeLinemanager(validPayload)).resolves.toEqual({
      success: true,
    });
    expect(simulateBackendDelayMock).toHaveBeenCalledOnce();
    expect(tokenXFetchUpdateMock).not.toHaveBeenCalled();
  });

  it("posts a valid revoke to the backend outside local and demo", async () => {
    tokenXFetchUpdateMock.mockResolvedValue({ success: true });
    const { revokeLinemanager } = await importAction(false);

    await expect(revokeLinemanager(validPayload)).resolves.toEqual({
      success: true,
    });
    expect(tokenXFetchUpdateMock).toHaveBeenCalledWith({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
      endpoint: "https://backend/api/v1/linemanager/revoke",
      requestBody: validPayload,
      method: "POST",
    });
    expect(simulateBackendDelayMock).not.toHaveBeenCalled();
  });

  it("rejects invalid input before local delay or TokenX", async () => {
    const { revokeLinemanager } = await importAction(true);

    await expect(
      revokeLinemanager({
        ...validPayload,
        employeeIdentificationNumber: "invalid",
      }),
    ).resolves.toEqual({
      success: false,
      errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
    });
    expect(simulateBackendDelayMock).not.toHaveBeenCalled();
    expect(tokenXFetchUpdateMock).not.toHaveBeenCalled();
  });
});
