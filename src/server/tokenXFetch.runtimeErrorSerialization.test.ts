import {
  type Context,
  type ContextManager,
  context,
  ROOT_CONTEXT,
  TraceFlags,
  trace,
} from "@opentelemetry/api";
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

let activeContext: Context = ROOT_CONTEXT;

const synchronousContextManager: ContextManager = {
  active: () => activeContext,
  bind: (_context, target) => target,
  disable() {
    activeContext = ROOT_CONTEXT;
    return this;
  },
  enable() {
    return this;
  },
  with(contextToActivate, fn, thisArg, ...args) {
    const previousContext = activeContext;
    activeContext = contextToActivate;
    try {
      return fn.call(thisArg, ...args);
    } finally {
      activeContext = previousContext;
    }
  },
};

async function withActiveTrace<T>(
  traceId: string,
  fn: () => T | Promise<T>,
): Promise<T> {
  const previousContext = activeContext;
  const span = trace.wrapSpanContext({
    traceId,
    spanId: "1234567890abcdef",
    traceFlags: TraceFlags.SAMPLED,
    isRemote: false,
  });
  activeContext = trace.setSpan(ROOT_CONTEXT, span);

  try {
    return await fn();
  } finally {
    activeContext = previousContext;
  }
}

beforeAll(() => {
  context.disable();
  context.setGlobalContextManager(synchronousContextManager.enable());
});

beforeEach(() => {
  activeContext = ROOT_CONTEXT;
  vi.clearAllMocks();
  fetchMock.mockReset();
  serializedLogLines.length = 0;
  validateTokenAndGetTokenXMock.mockResolvedValue(ACCESS_TOKEN);
  validateTokenAndGetTokenXOrRedirectMock.mockResolvedValue(ACCESS_TOKEN);
  vi.stubGlobal("fetch", fetchMock);
});

afterAll(() => {
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
    const traceId = "1234567890abcdef1234567890abcdef";
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: BackendErrorType.MISSING_ORG_ACCESS,
          message: RESPONSE_BODY_CANARY,
        }),
        { status: 503, statusText: `Unavailable ${BEHOV_ID}` },
      ),
    );

    await withActiveTrace(traceId, () =>
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
    });
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
}: {
  event: RuntimeErrorEvent;
  operation: RuntimeErrorOperation;
  errorCode: RuntimeErrorCode;
  message: string;
  upstreamStatus?: number;
  traceId?: string;
  validationTarget?: string;
  validationIssue?: string;
}): void {
  expect(serializedLogLines).toHaveLength(1);

  const serializedLog = serializedLogLines[0];
  const parsedLog = JSON.parse(serializedLog) as Record<string, unknown>;

  expect(parsedLog).toMatchObject({
    level: "error",
    event_type: event,
    operation,
    error_code: errorCode,
    message,
  });

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

  for (const canary of [
    FNR,
    ORGNUMMER,
    BEHOV_ID,
    REQUEST_ID,
    ACCESS_TOKEN,
    ERROR_DETAIL,
    ENDPOINT,
    RESPONSE_BODY_CANARY,
  ]) {
    expect(serializedLog).not.toContain(canary);
  }
}
