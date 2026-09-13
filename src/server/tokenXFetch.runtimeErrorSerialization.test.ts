import { createServer } from "node:http";
import { assertLogEvent, parseLogs } from "@navikt/esyfo-logger-testkit";
import { logger } from "@navikt/next-logger";
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
  RuntimeErrorEvent,
  RuntimeErrorOperation,
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

describe("serialisert logg mot felles runtime-schema", () => {
  it("avviser en faktisk ERROR-logg som mangler event_type", () => {
    logger.error(
      { operation: RuntimeErrorOperation.HENT_ORGANISASJONER },
      "Kontrollert feil uten hendelsesidentitet",
    );

    expect(serializedLogLines).toHaveLength(1);
    expect(() =>
      assertLogEvent(serializedLogLines.join(""), {
        event: {
          name: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
          level: "error",
          message: "Kontrollert feil uten hendelsesidentitet",
        },
      }),
    ).toThrow(/required/);
  });

  it("avviser status som streng uten å konvertere eller fjerne feltet", () => {
    logger.error(
      {
        event_type: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
        upstream_status: "503",
      },
      "Kontrollert feil med ugyldig statustype",
    );

    expect(serializedLogLines).toHaveLength(1);
    const [log] = parseLogs(serializedLogLines.join(""));

    expect(() =>
      assertLogEvent(serializedLogLines.join(""), {
        event: {
          name: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
          level: "error",
          message: "Kontrollert feil med ugyldig statustype",
        },
      }),
    ).toThrow(/upstream_status.*type/);
    expect(log.upstream_status).toBe("503");
  });
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
      operation: RuntimeErrorOperation.HENT_BEHOV,
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

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_ORGANISASJONER);

    expectCanonicalLog({
      event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
      errorCode: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      message: "Kunne ikke hente organisasjoner",
      upstreamStatus: 403,
    });
  });

  it("logger én klassifisert ukjent 403 selv når backend-body ikke er JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response(RESPONSE_BODY_CANARY, {
        status: 403,
        statusText: `Forbidden ${BEHOV_ID}`,
      }),
    );

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_BEHOVSLISTE);

    expectCanonicalLog({
      event: RuntimeErrorEvent.BEHOVSLISTE_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOVSLISTE,
      errorCode: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      message: "Kunne ikke hente listen over behov for nærmeste leder",
      upstreamStatus: 403,
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
      expectTokenXGetToReject(RuntimeErrorOperation.HENT_BEHOV),
    );

    expectCanonicalLog({
      event: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOV,
      errorCode: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      message: "Kunne ikke hente behovet for nærmeste leder",
      upstreamStatus: 503,
      traceId,
    });
  });

  it("eier TokenX exchange-feilen uten å logge underliggende feil", async () => {
    const tokenXError = new Error(ERROR_DETAIL);
    tokenXError.name = "TokenXExchangeError";
    validateTokenAndGetTokenXOrRedirectMock.mockRejectedValue(tokenXError);

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_BEHOVSLISTE);

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: RuntimeErrorEvent.BEHOVSLISTE_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOVSLISTE,
      errorCode: RuntimeErrorCode.TOKEN_EXCHANGE_FAILED,
      message: "Kunne ikke hente listen over behov for nærmeste leder",
    });
  });

  it("eier teknisk tokenvalideringsfeil i stedet for å redirecte", async () => {
    const tokenValidationError = new Error(ERROR_DETAIL);
    tokenValidationError.name = "IdPortenTokenValidationError";
    validateTokenAndGetTokenXOrRedirectMock.mockRejectedValue(
      tokenValidationError,
    );

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_BEHOV);

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOV,
      errorCode: RuntimeErrorCode.TOKEN_VALIDATION_FAILED,
      message: "Kunne ikke hente behovet for nærmeste leder",
    });
  });

  it("logger nettverksfeil uten error.message eller oppdiktet HTTP-status", async () => {
    fetchMock.mockRejectedValue(new Error(ERROR_DETAIL));

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_ORGANISASJONER);

    expectCanonicalLog({
      event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke hente organisasjoner",
      networkCause: "UNKNOWN",
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

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_ORGANISASJONER);

    expectCanonicalLog({
      event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke hente organisasjoner",
      networkCause: "TIMEOUT",
    });
  });

  it.each([
    ["ETIMEDOUT", "TIMEOUT"],
    ["UND_ERR_HEADERS_TIMEOUT", "TIMEOUT"],
    ["UND_ERR_BODY_TIMEOUT", "TIMEOUT"],
    ["ENOTFOUND", "DNS_LOOKUP_FAILED"],
    ["EAI_AGAIN", "DNS_LOOKUP_FAILED"],
    ["ECONNREFUSED", "CONNECTION_REFUSED"],
    ["ECONNRESET", "CONNECTION_CLOSED"],
    ["EPIPE", "CONNECTION_CLOSED"],
    ["UND_ERR_SOCKET", "CONNECTION_CLOSED"],
    ["ABORT_ERR", "REQUEST_ABORTED"],
    ["UND_ERR_ABORTED", "REQUEST_ABORTED"],
    [ERROR_DETAIL, "UNKNOWN"],
  ])("beholder kjent transportårsak %s som %s", async (code, networkCause) => {
    fetchMock.mockRejectedValue(
      new TypeError(ERROR_DETAIL, {
        cause: Object.assign(new Error(ENDPOINT), { code, hostname: ENDPOINT }),
      }),
    );

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_ORGANISASJONER);

    expectCanonicalLog({
      event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke hente organisasjoner",
      networkCause,
    });
  });

  it.each([
    ["TimeoutError", "TIMEOUT"],
    ["AbortError", "REQUEST_ABORTED"],
  ])("beholder avbruddstypen %s fra fetch", async (name, networkCause) => {
    fetchMock.mockRejectedValue(new DOMException(ERROR_DETAIL, name));

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_ORGANISASJONER);

    expectCanonicalLog({
      event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke hente organisasjoner",
      networkCause,
    });
  });

  it.each([null, undefined, ERROR_DETAIL])(
    "logger ukjent årsak for ikke-standard feil uten å eksponere verdien",
    async (error) => {
      fetchMock.mockRejectedValue(error);

      await expectTokenXGetToReject(RuntimeErrorOperation.HENT_ORGANISASJONER);

      expectCanonicalLog({
        event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
        operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
        errorCode: RuntimeErrorCode.NETWORK_ERROR,
        message: "Kunne ikke hente organisasjoner",
        networkCause: "UNKNOWN",
      });
    },
  );

  it("håndterer en sirkulær cause som ukjent uten å endre feilresponsen", async () => {
    const error = new Error(ERROR_DETAIL);
    error.cause = error;
    fetchMock.mockRejectedValue(error);

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_ORGANISASJONER);

    expectCanonicalLog({
      event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke hente organisasjoner",
      networkCause: "UNKNOWN",
    });
  });

  it("klassifiserer en faktisk brutt forbindelse fra Node fetch", async () => {
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
          operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
          endpoint: `http://127.0.0.1:${address.port}/?token=${ACCESS_TOKEN}`,
          responseDataSchema: successSchema,
          redirectAfterLoginUrl: "/arbeidsgiver/oversikt",
        }),
      ).rejects.toMatchObject({
        name: "FrontendError",
        errorDetail: NARMESTE_LEDER_FALLBACK_ERROR_DETAIL,
      });

      expectCanonicalLog({
        event: RuntimeErrorEvent.ORGANISASJONER_FETCH_FAILED,
        operation: RuntimeErrorOperation.HENT_ORGANISASJONER,
        errorCode: RuntimeErrorCode.NETWORK_ERROR,
        message: "Kunne ikke hente organisasjoner",
        networkCause: "CONNECTION_CLOSED",
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

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_BEHOV);

    expectCanonicalLog({
      event: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOV,
      errorCode: RuntimeErrorCode.INVALID_RESPONSE,
      message: "Kunne ikke hente behovet for nærmeste leder",
      upstreamStatus: 200,
      validationTarget: "upstream_response",
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

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_BEHOV);

    expectCanonicalLog({
      event: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOV,
      errorCode: RuntimeErrorCode.INVALID_JSON,
      message: "Kunne ikke hente behovet for nærmeste leder",
      upstreamStatus: 200,
    });
  });
});

describe("serialized TokenX POST runtime errors", () => {
  it("logger én nettverksfeil uten request-body eller fanget feil", async () => {
    fetchMock.mockRejectedValue(new Error(ERROR_DETAIL));

    await expectTokenXPostToReject();

    expectCanonicalLog({
      event: RuntimeErrorEvent.NARMESTE_LEDERE_SEARCH_FAILED,
      operation: RuntimeErrorOperation.SOK_NARMESTE_LEDERE,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke søke etter nærmeste ledere",
      networkCause: "UNKNOWN",
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
      event: RuntimeErrorEvent.NARMESTE_LEDERE_SEARCH_FAILED,
      operation: RuntimeErrorOperation.SOK_NARMESTE_LEDERE,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke søke etter nærmeste ledere",
      networkCause: "DNS_LOOKUP_FAILED",
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
          operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
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
      event: RuntimeErrorEvent.NARMESTE_LEDER_UPDATE_FAILED,
      operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
      errorCode: RuntimeErrorCode.NETWORK_ERROR,
      message: "Kunne ikke oppdatere nærmeste leder",
      networkCause: "CONNECTION_CLOSED",
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
        operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR, orgnummer: ORGNUMMER, behovId: BEHOV_ID },
        method: "PUT",
      }),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_UPDATE_FAILED,
      operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
      errorCode: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      message: "Kunne ikke oppdatere nærmeste leder",
      upstreamStatus: 503,
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
      operation: RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER,
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
        operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR },
        method: "DELETE",
      }),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_REVOKE_FAILED,
      operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
      errorCode: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      message: "Kunne ikke fjerne nærmeste leder",
      upstreamStatus: 400,
    });
  });

  it("eier tokenvalideringsfeilen og logger ingen rå auth-detaljer", async () => {
    const tokenValidationError = new Error(ERROR_DETAIL);
    tokenValidationError.name = "IdPortenTokenValidationError";
    validateTokenAndGetTokenXMock.mockRejectedValue(tokenValidationError);

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR },
        method: "DELETE",
      }),
    ).resolves.toMatchObject({ success: false });

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_REVOKE_FAILED,
      operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
      errorCode: RuntimeErrorCode.TOKEN_VALIDATION_FAILED,
      message: "Kunne ikke fjerne nærmeste leder",
    });
  });

  it("eier TokenX-utvekslingsfeilen uten duplikat fra auth-laget", async () => {
    const tokenXError = new Error(ERROR_DETAIL);
    tokenXError.name = "TokenXExchangeError";
    validateTokenAndGetTokenXMock.mockRejectedValue(tokenXError);

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER,
        endpoint: ENDPOINT,
        requestBody: { fnr: FNR },
      }),
    ).resolves.toMatchObject({ success: false });

    expect(fetchMock).not.toHaveBeenCalled();
    expectCanonicalLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_CREATE_FAILED,
      operation: RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER,
      errorCode: RuntimeErrorCode.TOKEN_EXCHANGE_FAILED,
      message: "Kunne ikke opprette nærmeste leder",
    });
  });

  it("returnerer suksess uten å logge", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 202 }));

    await expect(
      tokenXFetchUpdate({
        targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
        operation: RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER,
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
      operation: RuntimeErrorOperation.SOK_NARMESTE_LEDERE,
      endpoint: ENDPOINT,
      requestBody: { fnr: FNR, orgnummer: ORGNUMMER, behovId: BEHOV_ID },
      responseDataSchema: successSchema,
      redirectAfterLoginUrl: "/arbeidsgiver/oversikt",
    }),
  ).rejects.toMatchObject({ name: "FrontendError" });
}

function expectCanonicalLog({
  event,
  operation,
  errorCode,
  message,
  upstreamStatus,
  traceId,
  validationTarget,
  validationIssue,
  networkCause,
}: {
  event: RuntimeErrorEvent;
  operation: RuntimeErrorOperation;
  errorCode: RuntimeErrorCode;
  message: string;
  upstreamStatus?: number;
  traceId?: string;
  validationTarget?: string;
  validationIssue?: string;
  networkCause?: string;
}): void {
  const serializedLog = serializedLogLines.join("");
  assertLogEvent(serializedLog, {
    event: { name: event, level: "error", operation, message },
    context: { error_code: errorCode },
    ...(traceId === undefined ? {} : { traceId }),
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
  const [parsedLog] = parseLogs(serializedLog);

  if (networkCause === undefined) {
    expect(parsedLog).not.toHaveProperty("network_cause");
  } else {
    expect(parsedLog).toHaveProperty("network_cause", networkCause);
  }

  if (upstreamStatus === undefined) {
    expect(parsedLog).not.toHaveProperty("upstream_status");
  } else {
    expect(parsedLog).toHaveProperty("upstream_status", upstreamStatus);
  }

  if (traceId === undefined) {
    expect(parsedLog).not.toHaveProperty("trace_id");
  } else {
    expect(parsedLog).toHaveProperty("trace_id", traceId);
    expect(traceId).toMatch(/^[0-9a-f]{32}$/);
  }

  if (validationTarget === undefined) {
    expect(parsedLog).not.toHaveProperty("validation_target");
    expect(parsedLog).not.toHaveProperty("validationIssues");
  } else {
    if (validationIssue === undefined) {
      throw new Error("validationIssue is required with validationTarget");
    }
    expect(parsedLog).toHaveProperty("validation_target", validationTarget);
    expect(parsedLog).toHaveProperty(
      "validationIssues",
      expect.stringContaining(validationIssue),
    );
  }

  for (const field of [
    "endpoint",
    "url",
    "body",
    "errorMessage",
    "error_message",
    "error",
    "err",
    "stack",
  ]) {
    expect(parsedLog).not.toHaveProperty(field);
  }
}
