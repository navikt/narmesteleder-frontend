import { createServer } from "node:http";
import {
  assertLogEvent,
  type ExpectedLogEvent,
  parseLogs,
} from "@navikt/esyfo-logger-testkit";
import { context, trace } from "@opentelemetry/api";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { BasicTracerProvider } from "@opentelemetry/sdk-trace-base";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { z } from "zod";
import { TokenXTargetApi } from "@/server/helpers";
import {
  BackendErrorType,
  errorTypeToDetail,
  NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
} from "@/server/narmesteLederErrorUtils";
import {
  RuntimeErrorCode,
  type RuntimeErrorOperation,
} from "@/server/observability/runtimeErrorContract";
import {
  tokenXFetchGet,
  tokenXFetchPost,
  tokenXFetchUpdate,
} from "@/server/tokenXFetch";

const serializedLogLines = vi.hoisted((): string[] => []);
const nativeFetch = globalThis.fetch;
const {
  fetchMock,
  validateTokenAndGetTokenXMock,
  validateTokenAndGetTokenXOrRedirectMock,
} = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  validateTokenAndGetTokenXMock: vi.fn(),
  validateTokenAndGetTokenXOrRedirectMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@navikt/next-logger", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@navikt/next-logger")>();

  return {
    ...actual,
    logger: actual.backendLogger(
      {},
      {
        write(line: string) {
          serializedLogLines.push(line);
        },
      },
    ),
  };
});

vi.mock("@/server/auth/tokenX", () => ({
  isIdPortenTokenValidationError: (error: unknown) =>
    error instanceof Error && error.name === "IdPortenTokenValidationError",
  isTokenXExchangeError: (error: unknown) =>
    error instanceof Error && error.name === "TokenXExchangeError",
  validateTokenAndGetTokenXWithoutLogging: validateTokenAndGetTokenXMock,
  validateTokenAndGetTokenXOrRedirectWithoutLogging:
    validateTokenAndGetTokenXOrRedirectMock,
}));

const FNR = "12345678901";
const ORGNUMMER = "999888777";
const BEHOV_ID = "3ba48bb7-a967-4185-a0e7-c044011be683";
const REQUEST_ID = "request-id-canary";
const ACCESS_TOKEN = "token-canary";
const ERROR_DETAIL = `network failed for ${FNR}, ${ORGNUMMER} and ${BEHOV_ID}`;
const ENDPOINT = `https://backend.example.test/api/v1/linemanager/requirement/${BEHOV_ID}?orgNumber=${ORGNUMMER}&token=${ACCESS_TOKEN}`;
const RESPONSE_BODY_CANARY = `body-${FNR}-${REQUEST_ID}-${BEHOV_ID}`;

const successSchema = z.object({ ok: z.literal(true) });

const contextManager = new AsyncLocalStorageContextManager();
const tracerProvider = new BasicTracerProvider();

async function withActiveTrace(fn: () => Promise<unknown>): Promise<string> {
  return tracerProvider
    .getTracer("runtime-logging-test")
    .startActiveSpan("tokenx-request", async (span) => {
      try {
        await fn();
        return span.spanContext().traceId;
      } finally {
        span.end();
      }
    });
}

beforeAll(() => {
  context.disable();
  context.setGlobalContextManager(contextManager.enable());
  trace.setGlobalTracerProvider(tracerProvider);
});

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock.mockReset();
  serializedLogLines.length = 0;
  validateTokenAndGetTokenXMock.mockResolvedValue(ACCESS_TOKEN);
  validateTokenAndGetTokenXOrRedirectMock.mockResolvedValue(ACCESS_TOKEN);
  vi.stubGlobal("fetch", fetchMock);
});

afterAll(async () => {
  await tracerProvider.shutdown();
  trace.disable();
  contextManager.disable();
  context.disable();
  vi.unstubAllGlobals();
});

describe("serialized TokenX GET runtime errors", () => {
  it("logger ikke kjent domeneavvisning som driftsfeil", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: BackendErrorType.MISSING_ORG_ACCESS,
          message: RESPONSE_BODY_CANARY,
          path: ENDPOINT,
        }),
        { status: 403, statusText: `Forbidden ${BEHOV_ID}` },
      ),
    );

    const rejection = await tokenXFetchGet({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      operation: "hent_behov",
      endpoint: ENDPOINT,
      responseDataSchema: successSchema,
      redirectAfterLoginUrl: `/arbeidsgiver/${BEHOV_ID}`,
    }).catch((error: unknown) => error);

    expect(rejection).toMatchObject({
      name: "FrontendError",
      errorDetail: errorTypeToDetail[BackendErrorType.MISSING_ORG_ACCESS],
    });
    expect(serializedLogLines).toHaveLength(0);
  });

  it("logger samme type og status når kombinasjonen ikke er forventet for operasjonen", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: BackendErrorType.MISSING_ORG_ACCESS,
          message: RESPONSE_BODY_CANARY,
        }),
        { status: 403 },
      ),
    );

    await expectTokenXGetToReject("hent_organisasjoner");

    expectCanonicalLog({
      event: {
        name: "organisasjoner_fetch_failed",
        operation: "hent_organisasjoner",
        message: "Kunne ikke hente organisasjoner",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        upstream_status: 403,
      },
    });
  });

  it("logger én klassifisert ukjent 403 selv når backend-body ikke er JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response(RESPONSE_BODY_CANARY, {
        status: 403,
        statusText: `Forbidden ${BEHOV_ID}`,
      }),
    );

    await expectTokenXGetToReject("hent_behovsliste");

    expectCanonicalLog({
      event: {
        name: "behovsliste_fetch_failed",
        operation: "hent_behovsliste",
        message: "Kunne ikke hente listen over behov for nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        upstream_status: 403,
      },
    });
  });

  it("logger 5xx med trace_id fra aktiv OpenTelemetry-span", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: BackendErrorType.MISSING_ORG_ACCESS,
          message: RESPONSE_BODY_CANARY,
        }),
        { status: 503, statusText: `Unavailable ${BEHOV_ID}` },
      ),
    );

    const traceId = await withActiveTrace(() =>
      expectTokenXGetToReject("hent_behov"),
    );

    expectCanonicalLog({
      event: {
        name: "behov_fetch_failed",
        operation: "hent_behov",
        message: "Kunne ikke hente behovet for nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        upstream_status: 503,
      },
      traceId,
    });
  });

  it("eier TokenX exchange-feilen uten å logge underliggende feil", async () => {
    const tokenXError = new Error(ERROR_DETAIL);
    tokenXError.name = "TokenXExchangeError";
    validateTokenAndGetTokenXOrRedirectMock.mockRejectedValue(tokenXError);

    await expectTokenXGetToReject("hent_behovsliste");

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: {
        name: "behovsliste_fetch_failed",
        operation: "hent_behovsliste",
        message: "Kunne ikke hente listen over behov for nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.TOKEN_EXCHANGE_FAILED,
      },
    });
  });

  it("eier teknisk tokenvalideringsfeil i stedet for å redirecte", async () => {
    const tokenValidationError = new Error(ERROR_DETAIL);
    tokenValidationError.name = "IdPortenTokenValidationError";
    validateTokenAndGetTokenXOrRedirectMock.mockRejectedValue(
      tokenValidationError,
    );

    await expectTokenXGetToReject("hent_behov");

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: {
        name: "behov_fetch_failed",
        operation: "hent_behov",
        message: "Kunne ikke hente behovet for nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.TOKEN_VALIDATION_FAILED,
      },
    });
  });

  it("logger nettverksfeil uten error.message eller oppdiktet HTTP-status", async () => {
    fetchMock.mockRejectedValue(new Error(ERROR_DETAIL));

    await expectTokenXGetToReject("hent_organisasjoner");

    expectCanonicalLog({
      event: {
        name: "organisasjoner_fetch_failed",
        operation: "hent_organisasjoner",
        message: "Kunne ikke hente organisasjoner",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.NETWORK_ERROR,
      },
    });
  });

  it("beholder timeout-årsaken fra fetch uten å logge underliggende melding", async () => {
    fetchMock.mockRejectedValue(
      new TypeError(ERROR_DETAIL, {
        cause: Object.assign(new Error(ENDPOINT), {
          code: "UND_ERR_CONNECT_TIMEOUT",
        }),
      }),
    );

    await expectTokenXGetToReject("hent_organisasjoner");

    expectCanonicalLog({
      event: {
        name: "organisasjoner_fetch_failed",
        operation: "hent_organisasjoner",
        message: "Kunne ikke hente organisasjoner",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.NETWORK_ERROR,
        network_code: "UND_ERR_CONNECT_TIMEOUT",
      },
    });
  });

  it.each([null, undefined, ERROR_DETAIL])(
    "utelater transportkode for ikke-standard feil uten å eksponere verdien",
    async (error) => {
      fetchMock.mockRejectedValue(error);

      await expectTokenXGetToReject("hent_organisasjoner");

      expectCanonicalLog({
        event: {
          name: "organisasjoner_fetch_failed",
          operation: "hent_organisasjoner",
          message: "Kunne ikke hente organisasjoner",
          level: "error",
        },
        context: {
          error_code: RuntimeErrorCode.NETWORK_ERROR,
        },
      });
    },
  );

  it("håndterer en sirkulær cause uten å endre feilresponsen", async () => {
    const error = new Error(ERROR_DETAIL);
    error.cause = error;
    fetchMock.mockRejectedValue(error);

    await expectTokenXGetToReject("hent_organisasjoner");

    expectCanonicalLog({
      event: {
        name: "organisasjoner_fetch_failed",
        operation: "hent_organisasjoner",
        message: "Kunne ikke hente organisasjoner",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.NETWORK_ERROR,
      },
    });
  });

  it("beholder originalkoden for en faktisk brutt forbindelse fra Node fetch", async () => {
    const server = createServer((request) => request.destroy());
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );

    try {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Testserveren mangler en TCP-port");
      }
      vi.stubGlobal("fetch", nativeFetch);

      await expect(
        tokenXFetchGet({
          targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
          operation: "hent_organisasjoner",
          endpoint: `http://127.0.0.1:${address.port}/?token=${ACCESS_TOKEN}`,
          responseDataSchema: successSchema,
          redirectAfterLoginUrl: "/arbeidsgiver/oversikt",
        }),
      ).rejects.toMatchObject({
        name: "FrontendError",
        errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
      });

      expectCanonicalLog({
        event: {
          name: "organisasjoner_fetch_failed",
          operation: "hent_organisasjoner",
          message: "Kunne ikke hente organisasjoner",
          level: "error",
        },
        context: {
          error_code: RuntimeErrorCode.NETWORK_ERROR,
          network_code: "UND_ERR_SOCKET",
        },
      });
      expect(serializedLogLines[0]).not.toContain("127.0.0.1");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it("logger trygg Zod-diagnostikk for ugyldig suksesspayload", async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        ok: false,
        fnr: FNR,
        orgnummer: ORGNUMMER,
        behovId: BEHOV_ID,
      }),
    );

    await expectTokenXGetToReject("hent_behov");

    expectCanonicalLog({
      event: {
        name: "behov_fetch_failed",
        operation: "hent_behov",
        message: "Kunne ikke hente behovet for nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.INVALID_RESPONSE,
        upstream_status: 200,
        validation_target: "upstream_response",
      },
      validationIssue: "at ok",
    });
  });

  it("logger ugyldig JSON-respons uten parserens error.message", async () => {
    fetchMock.mockResolvedValue(
      new Response(RESPONSE_BODY_CANARY, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expectTokenXGetToReject("hent_behov");

    expectCanonicalLog({
      event: {
        name: "behov_fetch_failed",
        operation: "hent_behov",
        message: "Kunne ikke hente behovet for nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.INVALID_JSON,
        upstream_status: 200,
      },
    });
  });
});

describe("serialized TokenX POST runtime errors", () => {
  it("logger én nettverksfeil uten request-body eller fanget feil", async () => {
    fetchMock.mockRejectedValue(new Error(ERROR_DETAIL));

    await expectTokenXPostToReject();

    expectCanonicalLog({
      event: {
        name: "narmeste_ledere_search_failed",
        operation: "sok_narmeste_ledere",
        message: "Kunne ikke søke etter nærmeste ledere",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.NETWORK_ERROR,
      },
    });
  });

  it("beholder DNS-årsak for POST uten søkeparametere eller request-body", async () => {
    fetchMock.mockRejectedValue(
      new TypeError(ERROR_DETAIL, {
        cause: Object.assign(new Error(ENDPOINT), { code: "ENOTFOUND" }),
      }),
    );

    await expectTokenXPostToReject();

    expectCanonicalLog({
      event: {
        name: "narmeste_ledere_search_failed",
        operation: "sok_narmeste_ledere",
        message: "Kunne ikke søke etter nærmeste ledere",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.NETWORK_ERROR,
        network_code: "ENOTFOUND",
      },
    });
  });

  it("beholder kjent domeneavvisning som trygg, ikke-logget feil", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: BackendErrorType.MISSING_ORG_ACCESS,
          message: RESPONSE_BODY_CANARY,
        }),
        { status: 403 },
      ),
    );

    await expectTokenXPostToReject();

    expect(serializedLogLines).toHaveLength(0);
  });
});

describe("serialized TokenX update runtime errors", () => {
  it("beholder brutt forbindelse og aktiv trace ved oppdatering", async () => {
    fetchMock.mockRejectedValue(
      new TypeError(ERROR_DETAIL, {
        cause: Object.assign(new Error(ENDPOINT), { code: "UND_ERR_SOCKET" }),
      }),
    );

    const traceId = await withActiveTrace(async () => {
      await expect(
        tokenXFetchUpdate({
          targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
          operation: "oppdater_narmeste_leder",
          endpoint: ENDPOINT,
          requestBody: { fnr: FNR, orgnummer: ORGNUMMER, behovId: BEHOV_ID },
          method: "PUT",
        }),
      ).resolves.toEqual({
        success: false,
        errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
      });
    });

    expectCanonicalLog({
      event: {
        name: "narmeste_leder_update_failed",
        operation: "oppdater_narmeste_leder",
        message: "Kunne ikke oppdatere nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.NETWORK_ERROR,
        network_code: "UND_ERR_SOCKET",
      },
      traceId,
    });
  });

  it("logger én teknisk HTTP-feil og returnerer trygg feiltilstand", async () => {
    fetchMock.mockResolvedValue(
      new Response(RESPONSE_BODY_CANARY, {
        status: 503,
        statusText: `Unavailable ${BEHOV_ID}`,
      }),
    );

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: "oppdater_narmeste_leder",
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR, orgnummer: ORGNUMMER, behovId: BEHOV_ID },
        method: "PUT",
      }),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalLog({
      event: {
        name: "narmeste_leder_update_failed",
        operation: "oppdater_narmeste_leder",
        message: "Kunne ikke oppdatere nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        upstream_status: 503,
      },
    });
  });

  it("returnerer kjent domeneavvisning uten ERROR", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: BackendErrorType.LINEMANAGER_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH,
          message: RESPONSE_BODY_CANARY,
        }),
        { status: 400 },
      ),
    );

    const result = await tokenXFetchUpdate({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      operation: "opprett_narmeste_leder",
      endpoint: ENDPOINT,
      requestBody: { fnr: FNR },
    });

    expect(result).toEqual({
      success: false,
      errorDetail:
        errorTypeToDetail[
          BackendErrorType
            .LINEMANAGER_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH
        ],
    });
    expect(serializedLogLines).toHaveLength(0);
  });

  it("logger samme type og status når kombinasjonen ikke er dokumentert for operasjonen", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: BackendErrorType.LINEMANAGER_NAME_NATIONAL_IDENTIFICATION_NUMBER_MISMATCH,
          message: RESPONSE_BODY_CANARY,
        }),
        { status: 400 },
      ),
    );

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: "fjern_narmeste_leder",
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR },
        method: "DELETE",
      }),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalLog({
      event: {
        name: "narmeste_leder_revoke_failed",
        operation: "fjern_narmeste_leder",
        message: "Kunne ikke fjerne nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
        upstream_status: 400,
      },
    });
  });

  it("eier tokenvalideringsfeilen og logger ingen rå auth-detaljer", async () => {
    const tokenValidationError = new Error(ERROR_DETAIL);
    tokenValidationError.name = "IdPortenTokenValidationError";
    validateTokenAndGetTokenXMock.mockRejectedValue(tokenValidationError);

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: "fjern_narmeste_leder",
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR },
        method: "DELETE",
      }),
    ).resolves.toMatchObject({ success: false });

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: {
        name: "narmeste_leder_revoke_failed",
        operation: "fjern_narmeste_leder",
        message: "Kunne ikke fjerne nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.TOKEN_VALIDATION_FAILED,
      },
    });
  });

  it("eier TokenX-utvekslingsfeilen uten duplikat fra auth-laget", async () => {
    const tokenXError = new Error(ERROR_DETAIL);
    tokenXError.name = "TokenXExchangeError";
    validateTokenAndGetTokenXMock.mockRejectedValue(tokenXError);

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: "opprett_narmeste_leder",
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR },
      }),
    ).resolves.toMatchObject({ success: false });

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: {
        name: "narmeste_leder_create_failed",
        operation: "opprett_narmeste_leder",
        message: "Kunne ikke opprette nærmeste leder",
        level: "error",
      },
      context: {
        error_code: RuntimeErrorCode.TOKEN_EXCHANGE_FAILED,
      },
    });
  });

  it("returnerer suksess uten å logge", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 202 }));

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: "opprett_narmeste_leder",
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR },
      }),
    ).resolves.toEqual({ success: true });
    expect(serializedLogLines).toHaveLength(0);
  });
});

async function expectTokenXGetToReject(
  operation: RuntimeErrorOperation,
): Promise<void> {
  await expect(
    tokenXFetchGet({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      operation,
      endpoint: ENDPOINT,
      responseDataSchema: successSchema,
      redirectAfterLoginUrl: `/arbeidsgiver/${BEHOV_ID}`,
    }),
  ).rejects.toMatchObject({ name: "FrontendError" });
}

async function expectTokenXPostToReject(): Promise<void> {
  await expect(
    tokenXFetchPost({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      operation: "sok_narmeste_ledere",
      endpoint: ENDPOINT,
      requestBody: { fnr: FNR, orgnummer: ORGNUMMER, behovId: BEHOV_ID },
      responseDataSchema: successSchema,
      redirectAfterLoginUrl: "/arbeidsgiver/oversikt",
    }),
  ).rejects.toMatchObject({ name: "FrontendError" });
}

function expectCanonicalLog(
  expected: ExpectedLogEvent & { validationIssue?: string },
): void {
  const output = serializedLogLines.join("");
  assertLogEvent(output, {
    ...expected,
    excludes: [
      FNR,
      ORGNUMMER,
      BEHOV_ID,
      REQUEST_ID,
      ACCESS_TOKEN,
      ERROR_DETAIL,
      ENDPOINT,
      RESPONSE_BODY_CANARY,
    ],
  });
  const [record] = parseLogs(output);

  for (const field of [
    "network_code",
    "upstream_status",
    "validation_target",
  ]) {
    if (!(field in (expected.context ?? {}))) {
      expect(record).not.toHaveProperty(field);
    }
  }
  if (expected.traceId === undefined) {
    expect(record).not.toHaveProperty("trace_id");
  }
  if (expected.validationIssue === undefined) {
    expect(record).not.toHaveProperty("validationIssues");
  } else {
    expect(record.validationIssues).toEqual(
      expect.stringContaining(expected.validationIssue),
    );
  }
  for (const field of [
    "network_cause",
    "endpoint",
    "url",
    "body",
    "errorMessage",
    "error_message",
    "error",
    "err",
    "stack",
  ]) {
    expect(record).not.toHaveProperty(field);
  }
}
