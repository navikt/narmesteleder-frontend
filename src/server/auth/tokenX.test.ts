import { logger } from "@navikt/next-logger";
import { requestOboToken } from "@navikt/oasis";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  validateTokenAndGetTokenX,
  validateTokenAndGetTokenXOrRedirect,
} from "@/server/auth/tokenX";
import { validateIdPortenToken } from "@/server/auth/validateIdPortenToken";
import { TokenXTargetApi } from "@/server/helpers";

// Mock logger
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

const successIdPortenValidation = {
  success: true as const,
  token: idPortenTokenMock,
};

const failIdPortenValidation = {
  success: false as const,
  reason: "invalid",
};

const validateIdPortenTokenMock = vi.mocked(validateIdPortenToken);
const requestOboTokenMock = vi.mocked(requestOboToken);
const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("validateTokenAndGetTokenX", () => {
  it("returns OBO token when validation and exchange succeed", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    requestOboTokenMock.mockResolvedValue({ ok: true, token: oboTokenMock });

    await expect(
      validateTokenAndGetTokenX(TokenXTargetApi.NARMESTELEDER_BACKEND),
    ).resolves.toBe(oboTokenMock);
  });

  it("throws when token validation fails", async () => {
    validateIdPortenTokenMock.mockResolvedValue(failIdPortenValidation);

    await expect(
      validateTokenAndGetTokenX(TokenXTargetApi.NARMESTELEDER_BACKEND),
    ).rejects.toThrow();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("IdPorten token validation failed"),
    );
  });

  it("throws when obo token request fails", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    // It is weird to mock that, but since we have to mock redirect, will the logic continue
    requestOboTokenMock.mockResolvedValue({
      ok: false,
      error: {
        cause: "some-error",
        name: "SomeError",
        message: "some message",
      },
    });

    await expect(
      validateTokenAndGetTokenX(TokenXTargetApi.NARMESTELEDER_BACKEND),
    ).rejects.toThrow();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to exchange idporten token"),
    );
  });
});

describe("validateTokenAndGetTokenXOrRedirect", () => {
  it("returns OBO token when validation and exchange succeed", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    requestOboTokenMock.mockResolvedValue({ ok: true, token: oboTokenMock });

    await expect(
      validateTokenAndGetTokenXOrRedirect(
        "/dummy-redirect",
        TokenXTargetApi.NARMESTELEDER_BACKEND,
      ),
    ).resolves.toBe(oboTokenMock);
  });

  it("redirects when token validation fails", async () => {
    validateIdPortenTokenMock.mockResolvedValue(failIdPortenValidation);
    // It is weird to mock that, but since we have to mock redirect, will the logic continue
    requestOboTokenMock.mockResolvedValue({ ok: true, token: "obo-token" });

    await validateTokenAndGetTokenXOrRedirect(
      "/dummy-redirect",
      TokenXTargetApi.NARMESTELEDER_BACKEND,
    );

    expect(redirectMock).toHaveBeenCalledWith(
      "/oauth2/login?redirect=%2Fdummy-redirect",
    );
  });

  it("throws when obo token request fails", async () => {
    validateIdPortenTokenMock.mockResolvedValue(successIdPortenValidation);
    // It is weird to mock that, but since we have to mock redirect, will the logic continue
    requestOboTokenMock.mockResolvedValue({
      ok: false,
      error: {
        cause: "some-error",
        name: "SomeError",
        message: "some message",
      },
    });

    await expect(
      validateTokenAndGetTokenXOrRedirect(
        "/dummy-redirect",
        TokenXTargetApi.NARMESTELEDER_BACKEND,
      ),
    ).rejects.toThrow();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to exchange idporten token"),
    );
  });
});
