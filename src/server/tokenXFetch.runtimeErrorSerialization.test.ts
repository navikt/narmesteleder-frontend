import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { TokenXTargetApi } from "@/server/helpers";
import {
  RuntimeErrorCode,
  RuntimeErrorEvent,
  RuntimeErrorOperation,
} from "@/server/observability/runtimeErrorContract";
import { tokenXFetchGet } from "@/server/tokenXFetch";

const serializedLogLines = vi.hoisted((): string[] => []);
const { fetchMock, validateTokenAndGetTokenXOrRedirectMock } = vi.hoisted(
  () => ({
    fetchMock: vi.fn(),
    validateTokenAndGetTokenXOrRedirectMock: vi.fn(),
  }),
);

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
  validateTokenAndGetTokenX: vi.fn(),
  validateTokenAndGetTokenXOrRedirect: validateTokenAndGetTokenXOrRedirectMock,
}));

vi.stubGlobal("fetch", fetchMock);

const FNR = "12345678901";
const ORGNUMMER = "999888777";
const BEHOV_ID = "3ba48bb7-a967-4185-a0e7-c044011be683";
const REQUEST_ID = "request-id-canary";
const ACCESS_TOKEN = "token-canary";
const ERROR_DETAIL = `network failed for ${FNR}, ${ORGNUMMER} and ${BEHOV_ID}`;
const ENDPOINT = `https://backend.example.test/api/v1/linemanager/requirement/${BEHOV_ID}?orgNumber=${ORGNUMMER}&token=${ACCESS_TOKEN}`;
const RESPONSE_BODY_CANARY = `body-${FNR}-${REQUEST_ID}-${BEHOV_ID}`;

const successSchema = z.object({ ok: z.literal(true) });

beforeEach(() => {
  vi.clearAllMocks();
  serializedLogLines.length = 0;
  validateTokenAndGetTokenXOrRedirectMock.mockResolvedValue(ACCESS_TOKEN);
});

describe("serialized TokenX GET runtime errors", () => {
  it("logger én klassifisert 403 uten endpoint, behov-ID eller backend-body", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "MISSING_ORG_ACCESS",
          message: RESPONSE_BODY_CANARY,
          path: ENDPOINT,
        }),
        { status: 403, statusText: `Forbidden ${BEHOV_ID}` },
      ),
    );

    await expectTokenXGetToReject(RuntimeErrorOperation.HENT_BEHOV);

    expectCanonicalLog({
      event: RuntimeErrorEvent.BEHOV_FETCH_FAILED,
      operation: RuntimeErrorOperation.HENT_BEHOV,
      errorCode: RuntimeErrorCode.UPSTREAM_HTTP_ERROR,
      message: "Kunne ikke hente behovet for nærmeste leder",
      upstreamStatus: 403,
    });
  });

  it("logger én klassifisert HTTP-feil selv når backend-body ikke er JSON", async () => {
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

  it("logger ugyldig suksesspayload uten valideringsdetaljer", async () => {
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

function expectCanonicalLog({
  event,
  operation,
  errorCode,
  message,
  upstreamStatus,
}: {
  event: RuntimeErrorEvent;
  operation: RuntimeErrorOperation;
  errorCode: RuntimeErrorCode;
  message: string;
  upstreamStatus?: number;
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

  for (const field of [
    "endpoint",
    "url",
    "body",
    "errorMessage",
    "error_message",
    "error",
    "err",
    "stack",
    "validationIssues",
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
