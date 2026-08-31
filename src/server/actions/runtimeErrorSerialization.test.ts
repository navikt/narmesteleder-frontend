import { beforeEach, describe, expect, it, vi } from "vitest";
import { oppdaterNarmesteLeder } from "@/server/actions/oppdaterNarmesteLeder";
import { opprettNarmesteLeder } from "@/server/actions/opprettNarmesteLeder";
import { revokeLinemanager } from "@/server/actions/revokeLinemanager";
import {
  RuntimeErrorCode,
  RuntimeErrorEvent,
  RuntimeErrorOperation,
} from "@/server/observability/runtimeErrorContract";

const serializedLogLines = vi.hoisted((): string[] => []);

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

vi.mock("@/server/tokenXFetch", () => ({
  tokenXFetchUpdate: vi.fn(),
}));

const FNR = "12345678901";
const ORGNUMMER = "999888777";
const BEHOV_ID = "3ba48bb7-a967-4185-a0e7-c044011be683";
const PRIVATE_DETAIL = `invalid-${FNR}-${ORGNUMMER}-${BEHOV_ID}`;

beforeEach(() => {
  vi.clearAllMocks();
  serializedLogLines.length = 0;
});

describe("serialized server-action validation errors", () => {
  it("logger ugyldig opprett-payload uten Zod- eller persondetaljer", async () => {
    await expect(
      opprettNarmesteLeder({
        sykmeldt: { fodselsnummer: FNR, etternavn: PRIVATE_DETAIL },
      } as never),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalActionLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_CREATE_FAILED,
      operation: RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER,
      message: "Kunne ikke opprette nærmeste leder",
    });
  });

  it("logger ugyldig behov-ID uten ID eller skjemadetaljer", async () => {
    await expect(
      oppdaterNarmesteLeder(PRIVATE_DETAIL, {} as never),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalActionLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_UPDATE_FAILED,
      operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
      message: "Kunne ikke oppdatere nærmeste leder",
    });
  });

  it("logger ugyldig fjern-payload uten request-data", async () => {
    await expect(
      revokeLinemanager({
        employeeIdentificationNumber: PRIVATE_DETAIL,
        orgNumber: ORGNUMMER,
        lastName: BEHOV_ID,
      }),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalActionLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_REVOKE_FAILED,
      operation: RuntimeErrorOperation.FJERN_NARMESTE_LEDER,
      message: "Kunne ikke fjerne nærmeste leder",
    });
  });
});

function expectCanonicalActionLog({
  event,
  operation,
  message,
}: {
  event: RuntimeErrorEvent;
  operation: RuntimeErrorOperation;
  message: string;
}): void {
  expect(serializedLogLines).toHaveLength(1);
  const line = serializedLogLines[0];
  const record = JSON.parse(line) as Record<string, unknown>;

  expect(record).toMatchObject({
    level: "error",
    event_type: event,
    operation,
    error_code: RuntimeErrorCode.INVALID_INPUT,
    message,
  });
  expect(record).not.toHaveProperty("upstream_status");

  for (const forbiddenField of [
    "body",
    "error",
    "err",
    "stack",
    "validationIssues",
    "issues",
  ]) {
    expect(record).not.toHaveProperty(forbiddenField);
  }
  for (const canary of [FNR, ORGNUMMER, BEHOV_ID, PRIVATE_DETAIL]) {
    expect(line).not.toContain(canary);
  }
}
