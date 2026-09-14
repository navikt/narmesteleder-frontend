import { describe, expect, it } from "vitest";
import { networkErrorCode } from "./networkErrorCode";

describe("networkErrorCode", () => {
  it.each(["code", "name", "cause"])(
    "lar ikke en kastende %s-getter maskere den opprinnelige feilen",
    (property) => {
      const error = Object.defineProperty(
        new Error("Original error"),
        property,
        {
          get() {
            throw new Error("Synthetic getter failure");
          },
        },
      );
      expect(networkErrorCode(error)).toBeUndefined();
    },
  );

  it.each(["AbortError", "TimeoutError"])(
    "beholder DOMException-navnet %s når strengkode mangler",
    (name) => {
      expect(
        networkErrorCode(new DOMException("Synthetic diagnostic", name)),
      ).toBe(name);
    },
  );

  it.each([
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
    "ENOTFOUND",
    "EAI_AGAIN",
    "ECONNREFUSED",
    "ECONNRESET",
    "EPIPE",
    "UND_ERR_SOCKET",
    "ABORT_ERR",
    "UND_ERR_ABORTED",
    "CERT_HAS_EXPIRED",
    "CERT_NOT_YET_VALID",
    "ERR_TLS_CERT_ALTNAME_INVALID",
    "ERR_TLS_HANDSHAKE_TIMEOUT",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  ])("beholder kjent Node-/Undici-kode %s uendret", (code) => {
    expect(
      networkErrorCode(
        Object.assign(new Error("Synthetic diagnostic"), { code }),
      ),
    ).toBe(code);
  });

  it("beholder den konkrete timeout-koden fra fetch sin cause", () => {
    const error = new TypeError("Fetch failed", {
      cause: Object.assign(new Error("Synthetic diagnostic"), {
        code: "UND_ERR_CONNECT_TIMEOUT",
      }),
    });

    expect(networkErrorCode(error)).toBe("UND_ERR_CONNECT_TIMEOUT");
  });

  it("foretrekker den konkrete koden fremfor et generelt feilnavn", () => {
    expect(
      networkErrorCode({
        code: "UND_ERR_HEADERS_TIMEOUT",
        name: "TimeoutError",
      }),
    ).toBe("UND_ERR_HEADERS_TIMEOUT");
  });

  it.each([
    null,
    undefined,
    "synthetic-private-token",
    503,
    { code: "ERR_PRIVATE_12345678901", name: "PrivateError" },
    { code: 20 },
    { message: "https://example.test/?token=synthetic-private-token" },
  ])("utelater ukjente verdier uten å utlede kode fra innhold", (error) => {
    expect(networkErrorCode(error)).toBeUndefined();
  });

  it("avslutter en sirkulær cause-kjede uten resultat", () => {
    const error = new Error("Synthetic diagnostic");
    error.cause = error;

    expect(networkErrorCode(error)).toBeUndefined();
  });

  it("avgrenser oppslag i svært lange cause-kjeder", () => {
    let error = Object.assign(new Error("Synthetic diagnostic"), {
      code: "ENOTFOUND",
    }) as Error;
    for (let i = 0; i < 100; i++)
      error = new Error("Wrapper", { cause: error });

    expect(networkErrorCode(error)).toBeUndefined();
  });

  it("velger ikke en vilkårlig feil fra AggregateError", () => {
    const error = new AggregateError([
      Object.assign(new Error("Synthetic diagnostic"), { code: "ENOTFOUND" }),
      Object.assign(new Error("Synthetic diagnostic"), {
        code: "ECONNREFUSED",
      }),
    ]);

    expect(networkErrorCode(error)).toBeUndefined();
  });

  it("leser ikke melding eller stack for å finne en kode", () => {
    const error = Object.defineProperties(
      { code: "ENOTFOUND" },
      {
        message: {
          get() {
            throw new Error("Message must not be read");
          },
        },
        stack: {
          get() {
            throw new Error("Stack must not be read");
          },
        },
      },
    );

    expect(networkErrorCode(error)).toBe("ENOTFOUND");
  });
});
