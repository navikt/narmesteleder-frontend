import { logger } from "@navikt/next-logger";
import { requestOboToken } from "@navikt/oasis";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  IdPortenTokenValidationError,
  TokenXExchangeError,
  validateTokenAndGetTokenXOrRedirectWithoutLogging,
  validateTokenAndGetTokenXWithoutLogging,
} from "@/server/auth/tokenX";
import { validateIdPortenToken } from "@/server/auth/validateIdPortenToken";
import { TokenXTargetApi } from "@/server/helpers";

vi.mock("@navikt/next-logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/server/auth/validateIdPortenToken", () => ({
  validateIdPortenToken: vi.fn(),
}));

vi.mock("@navikt/oasis", () => ({
  requestOboToken: vi.fn(),
}));

const oboTokenMock = "obo-token-mock";
const idPortenTokenMock = "idporten-token-mock";
const PRIVATE_DETAIL = "private-token-error-fnr-12345678901";

const successIdPortenValidation = {
  success: true as const,
  token: idPortenTokenMock,
};

const failIdPortenValidation = {
  success: false as const,
  reason: PRIVATE_DETAIL,
};

const validateIdPortenTokenMock = vi.mocked(validateIdPortenToken);
const requestOboTokenMock = vi.mocked(requestOboToken);
const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("validateTokenAndGetTokenXWithoutLogging", () => {
  it("returns OBO token when validation and exchange succeed", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    requestOboTokenMock.mockResolvedValue({ ok: true, token: oboTokenMock });

    await expect(
      validateTokenAndGetTokenXWithoutLogging(
        TokenXTargetApi.NARMESTELEDER_BACKEND,
      ),
    ).resolves.toBe(oboTokenMock);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("throws a sanitized typed token-validation failure", async () => {
    validateIdPortenTokenMock.mockResolvedValue(failIdPortenValidation);

    const rejection = await validateTokenAndGetTokenXWithoutLogging(
      TokenXTargetApi.NARMESTELEDER_BACKEND,
    ).catch((error: unknown) => error);

    expect(rejection).toBeInstanceOf(IdPortenTokenValidationError);
    expect((rejection as Error).message).toBe(
      "Kunne ikke validere ID-porten-token",
    );
    expect((rejection as Error).message).not.toContain(PRIVATE_DETAIL);
    expect(requestOboTokenMock).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("throws a sanitized typed unsuccessful exchange", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    requestOboTokenMock.mockResolvedValue({
      ok: false,
      error: {
        cause: PRIVATE_DETAIL,
        name: "PrivateError",
        message: PRIVATE_DETAIL,
      },
    });

    const rejection = await validateTokenAndGetTokenXWithoutLogging(
      TokenXTargetApi.NARMESTELEDER_BACKEND,
    ).catch((error: unknown) => error);

    expectSanitizedTokenXExchangeError(rejection);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("wraps a thrown exchange failure without leaking its message", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    requestOboTokenMock.mockRejectedValue(new Error(PRIVATE_DETAIL));

    const rejection = await validateTokenAndGetTokenXWithoutLogging(
      TokenXTargetApi.NARMESTELEDER_BACKEND,
    ).catch((error: unknown) => error);

    expectSanitizedTokenXExchangeError(rejection);
    expect(logger.error).not.toHaveBeenCalled();
  });
});

describe("validateTokenAndGetTokenXOrRedirectWithoutLogging", () => {
  it("returns OBO token when validation and exchange succeed", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    requestOboTokenMock.mockResolvedValue({ ok: true, token: oboTokenMock });

    await expect(
      validateTokenAndGetTokenXOrRedirectWithoutLogging(
        "/dummy-redirect",
        TokenXTargetApi.NARMESTELEDER_BACKEND,
      ),
    ).resolves.toBe(oboTokenMock);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("leaves the Next.js redirect sentinel untouched", async () => {
    const redirectSentinel = new Error("NEXT_REDIRECT_SENTINEL");
    validateIdPortenTokenMock.mockResolvedValue(failIdPortenValidation);
    redirectMock.mockImplementation(() => {
      throw redirectSentinel;
    });

    await expect(
      validateTokenAndGetTokenXOrRedirectWithoutLogging(
        "/dummy-redirect",
        TokenXTargetApi.NARMESTELEDER_BACKEND,
      ),
    ).rejects.toBe(redirectSentinel);

    expect(redirectMock).toHaveBeenCalledWith(
      "/oauth2/login?redirect=%2Fdummy-redirect",
    );
    expect(requestOboTokenMock).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("throws a sanitized typed exchange failure", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    requestOboTokenMock.mockRejectedValue(new Error(PRIVATE_DETAIL));

    const rejection = await validateTokenAndGetTokenXOrRedirectWithoutLogging(
      "/dummy-redirect",
      TokenXTargetApi.NARMESTELEDER_BACKEND,
    ).catch((error: unknown) => error);

    expectSanitizedTokenXExchangeError(rejection);
    expect(logger.error).not.toHaveBeenCalled();
  });
});

function expectSanitizedTokenXExchangeError(error: unknown): void {
  expect(error).toBeInstanceOf(TokenXExchangeError);
  expect((error as Error).message).toBe("Kunne ikke hente TokenX-token");
  expect((error as Error).message).not.toContain(PRIVATE_DETAIL);
}
