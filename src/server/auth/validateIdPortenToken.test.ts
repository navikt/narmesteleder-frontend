import { logger } from "@navikt/next-logger";
import { getToken, validateIdportenToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  TokenValidationFailureReason,
  validateIdPortenToken,
} from "@/server/auth/validateIdPortenToken";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("@navikt/oasis", () => ({
  getToken: vi.fn(),
  validateIdportenToken: vi.fn(),
}));

vi.mock("@navikt/next-logger", () => ({
  logger: { warn: vi.fn(), error: vi.fn() },
}));

const PRIVATE_DETAIL = "private-jwt-detail-fnr-12345678901";
const VALID_TOKEN = "valid-token";
const headersMock = vi.mocked(headers);
const getTokenMock = vi.mocked(getToken);
const validateIdportenTokenMock = vi.mocked(validateIdportenToken);

beforeEach(() => {
  vi.resetAllMocks();
  headersMock.mockResolvedValue(new Headers() as never);
});

describe("validateIdPortenToken", () => {
  it.each([undefined, null])(
    "returns a closed missing-token reason for %s",
    async (token) => {
      getTokenMock.mockReturnValue(token as string | null);

      await expect(validateIdPortenToken()).resolves.toEqual({
        success: false,
        reason: TokenValidationFailureReason.MISSING_TOKEN,
      });
      expectNoLogging();
    },
  );

  it("returns a closed invalid-token reason without Oasis details", async () => {
    getTokenMock.mockReturnValue(VALID_TOKEN);
    validateIdportenTokenMock.mockResolvedValue({
      ok: false,
      errorType: "unknown",
      error: new Error(PRIVATE_DETAIL),
    });

    const result = await validateIdPortenToken();

    expect(result).toEqual({
      success: false,
      reason: TokenValidationFailureReason.INVALID_TOKEN,
    });
    expect(JSON.stringify(result)).not.toContain(PRIVATE_DETAIL);
    expectNoLogging();
  });

  it("sanitizes a thrown Oasis validation failure", async () => {
    getTokenMock.mockReturnValue(VALID_TOKEN);
    validateIdportenTokenMock.mockRejectedValue(new Error(PRIVATE_DETAIL));

    const result = await validateIdPortenToken();

    expect(result).toEqual({
      success: false,
      reason: TokenValidationFailureReason.VALIDATION_ERROR,
    });
    expect(JSON.stringify(result)).not.toContain(PRIVATE_DETAIL);
    expectNoLogging();
  });

  it("sanitizes a thrown token extraction failure", async () => {
    getTokenMock.mockImplementation(() => {
      throw new Error(PRIVATE_DETAIL);
    });

    await expect(validateIdPortenToken()).resolves.toEqual({
      success: false,
      reason: TokenValidationFailureReason.VALIDATION_ERROR,
    });
    expectNoLogging();
  });

  it("sanitizes a thrown headers failure", async () => {
    headersMock.mockRejectedValue(new Error(PRIVATE_DETAIL));

    await expect(validateIdPortenToken()).resolves.toEqual({
      success: false,
      reason: TokenValidationFailureReason.VALIDATION_ERROR,
    });
    expect(getTokenMock).not.toHaveBeenCalled();
    expectNoLogging();
  });

  it("returns the token when validation succeeds", async () => {
    getTokenMock.mockReturnValue(VALID_TOKEN);
    validateIdportenTokenMock.mockResolvedValue({
      ok: true,
      payload: {} as never,
    });

    await expect(validateIdPortenToken()).resolves.toEqual({
      success: true,
      token: VALID_TOKEN,
    });
    expectNoLogging();
  });
});

function expectNoLogging(): void {
  expect(logger.warn).not.toHaveBeenCalled();
  expect(logger.error).not.toHaveBeenCalled();
}
