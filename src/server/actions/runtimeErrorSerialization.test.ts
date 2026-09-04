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

describe("serialized server-action validation warnings", () => {
  it("logger trygg Zod-diagnostikk for ugyldig opprett-payload", async () => {
    await expect(
      opprettNarmesteLeder({
        sykmeldt: { fodselsnummer: FNR, etternavn: PRIVATE_DETAIL },
      } as never),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalActionLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_CREATE_FAILED,
      operation: RuntimeErrorOperation.OPPRETT_NARMESTE_LEDER,
      message: "Kunne ikke opprette nærmeste leder",
      validationTarget: "narmeste_leder_info",
      validationIssue: "sykmeldt.orgnummer",
    });
  });

  it("skiller ugyldig behov-ID fra ugyldig skjema", async () => {
    await expect(
      oppdaterNarmesteLeder(PRIVATE_DETAIL, {} as never),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalActionLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_UPDATE_FAILED,
      operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
      message: "Kunne ikke oppdatere nærmeste leder",
      validationTarget: "requirement_id",
      validationIssue: "Invalid UUID",
    });
  });

  it("logger trygg Zod-diagnostikk for ugyldig oppdateringsskjema", async () => {
    await expect(
      oppdaterNarmesteLeder(BEHOV_ID, {
        fodselsnummer: FNR,
        etternavn: PRIVATE_DETAIL,
      } as never),
    ).resolves.toMatchObject({ success: false });

    expectCanonicalActionLog({
      event: RuntimeErrorEvent.NARMESTE_LEDER_UPDATE_FAILED,
      operation: RuntimeErrorOperation.OPPDATER_NARMESTE_LEDER,
      message: "Kunne ikke oppdatere nærmeste leder",
      validationTarget: "narmeste_leder_form",
      validationIssue: "mobilnummer",
    });
  });

  it("logger trygg Zod-diagnostikk for ugyldig fjern-payload", async () => {
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
      validationTarget: "revoke_request",
      validationIssue: "employeeIdentificationNumber",
    });
  });
});

function expectCanonicalActionLog({
  event,
  operation,
  message,
  validationTarget,
  validationIssue,
}: {
  event: RuntimeErrorEvent;
  operation: RuntimeErrorOperation;
  message: string;
  validationTarget: string;
  validationIssue: string;
}): void {
  expect(serializedLogLines).toHaveLength(1);
  const line = serializedLogLines[0];
  const record = JSON.parse(line) as Record<string, unknown>;

  expect(record).toMatchObject({
    level: "warn",
    event_type: event,
    operation,
    error_code: RuntimeErrorCode.INVALID_INPUT,
    message,
    validation_target: validationTarget,
    validationIssues: expect.stringContaining(validationIssue),
  });
  expect(record).not.toHaveProperty("upstream_status");

  for (const forbiddenField of ["body", "error", "err", "stack", "issues"]) {
    expect(record).not.toHaveProperty(forbiddenField);
  }
  for (const canary of [FNR, ORGNUMMER, BEHOV_ID, PRIVATE_DETAIL]) {
    expect(line).not.toContain(canary);
  }
}
