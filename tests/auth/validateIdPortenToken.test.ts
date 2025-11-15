import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateIdPortenToken } from "../../src/auth/validateIdPortenToken";

vi.mock("next/headers", () => ({
  headers: () => ({ get: () => undefined }),
}));
vi.mock("@navikt/oasis", () => ({
  getToken: vi.fn(() => undefined),
  validateIdportenToken: vi.fn(),
}));

vi.mock("@navikt/next-logger", () => ({
  logger: { warn: vi.fn() },
}));

const getOasisMock = async () => await import("@navikt/oasis");

const validTokenName = "valid-token";

const setupOasisMockToken = async (tokenName: string = validTokenName) => {
  const oasis = await getOasisMock();
  (oasis.getToken as ReturnType<typeof vi.fn>).mockImplementation(
    () => tokenName,
  );
  return oasis;
};

const setupOasisMockValid = async (tokenName?: string) => {
  const oasis = await setupOasisMockToken(tokenName);
  (oasis.validateIdportenToken as ReturnType<typeof vi.fn>).mockImplementation(
    () => ({ ok: true }),
  );
};

const setupOasisMockInvalid = async () => {
  const oasis = await setupOasisMockToken("fake-token");
  (oasis.validateIdportenToken as ReturnType<typeof vi.fn>).mockImplementation(
    () => ({
      ok: false,
      errorType: "JWT",
      error: "expired",
    }),
  );
};

const setupOasisMockNullToken = async () => {
  const oasis = await getOasisMock();
  (oasis.getToken as ReturnType<typeof vi.fn>).mockImplementation(() => null);
};

const expectedMissingTokenResult = {
  success: false,
  reason: "Missing idporten token",
};

describe("validateIdPortenToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("returns failure when token is missing", async () => {
    const result = await validateIdPortenToken();
    expect(result).toEqual(expectedMissingTokenResult);
  });

  it("returns failure when token is null", async () => {
    await setupOasisMockNullToken();
    const result = await validateIdPortenToken();
    expect(result).toEqual(expectedMissingTokenResult);
  });

  it("returns failure when token is invalid", async () => {
    await setupOasisMockInvalid();
    const result = await validateIdPortenToken();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toContain("Invalid JWT token found");
      expect(result.reason).toContain("expired");
    }
  });

  it("returns success when token is valid", async () => {
    await setupOasisMockValid();
    const result = await validateIdPortenToken();
    expect(result).toEqual({ success: true, token: validTokenName });
  });
});
