import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@navikt/next-logger";
import {
  BackendErrorType,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
  errorTypeToDetail,
  toFrontendError,
} from "./narmesteLederErrors";

vi.mock("@navikt/next-logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

const loggerErrorMock = logger.error as unknown as Mock;

const backendErrorTypes = Object.values(BackendErrorType) as BackendErrorType[];

beforeEach(() => {
  loggerErrorMock.mockClear();
});

describe("toFrontendError", () => {
  for (const backendType of backendErrorTypes) {
    it(`returns translated error detail for backend type ${backendType}`, async () => {
      const payload = {
        status: { value: 403, description: "Forbidden" },
        type: backendType,
        message: "Some message",
      };
      const response = new Response(JSON.stringify(payload), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });

      const result = await toFrontendError(response);

      const expectedDetail = errorTypeToDetail[backendType];
      expect(expectedDetail).toBeDefined();

      expect(result.type).toBe(backendType);
      expect(result.errorDetail).toEqual(expectedDetail);
    });
  }

  it("has translations for every backend error type", () => {
    expect(new Set(Object.keys(errorTypeToDetail))).toEqual(
      new Set(backendErrorTypes),
    );
  });

  it("falls back to generic message when payload type is wrong or unknown", async () => {
    const payload = {
      status: { value: 400, description: "Bad Request" },
      type: "TYPE_UNKNOWN_TO_FRONTEND",
      message:
        "Last name for linemanager does not correspond with registered value for the given national identification number",
      path: "/api/v1/linemanager/requirement/3ba48bb7-a967-4185-a0e7-c044011be683",
      timestamp: "2025-12-02T10:16:50.250516Z",
    };
    const response = new Response(JSON.stringify(payload), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

    const result = await toFrontendError(response);

    expect(result.type).toBeUndefined();
    expect(result.errorDetail).toEqual(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);
  });

  it("falls back when response body was already consumed", async () => {
    const payload = {
      type: "BAD_REQUEST_NAME_NIN_MISMATCH_LINEMANAGER",
      message: "Consumed",
    };

    const response = new Response(JSON.stringify(payload), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

    // Simulate a previous reader consuming the body
    await response.text();

    const result = await toFrontendError(response);

    expect(result.type).toBeUndefined();
    expect(result.errorDetail).toEqual(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);
    expect(loggerErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to parse backend error response as JSON"),
    );
  });

  it("falls back when response body cannot be read", async () => {
    const brokenResponse = {
      clone: () =>
        ({
          text: () => Promise.reject(new Error("connection lost")),
        }) as Response,
    } as unknown as Response;

    const result = await toFrontendError(brokenResponse);

    expect(result.type).toBeUndefined();
    expect(result.errorDetail).toEqual(NARMESTE_LEDER_FALLBACK_ERROR_DETAIL);
    expect(loggerErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to parse backend error response as JSON"),
    );
  });
});
