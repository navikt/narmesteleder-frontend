import { beforeEach, describe, expect, it, vi } from "vitest";
import { logUnhandledFrontendError } from "@/app/logUnhandledFrontendError";
import {
  RuntimeErrorCode,
  RuntimeErrorEvent,
  RuntimeErrorOperation,
} from "@/server/observability/runtimeErrorContract";

const serializedLogLines = vi.hoisted((): string[] => []);

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

beforeEach(() => {
  serializedLogLines.length = 0;
});

describe("global frontend error logging", () => {
  it("serialiserer bare den lukkede kontrakten", () => {
    logUnhandledFrontendError();

    expect(serializedLogLines).toHaveLength(1);
    const record = JSON.parse(serializedLogLines[0]) as Record<string, unknown>;
    expect(record).toMatchObject({
      level: "error",
      event_type: RuntimeErrorEvent.FRONTEND_RENDER_FAILED,
      operation: RuntimeErrorOperation.VIS_GENERELL_FEILSIDE,
      error_code: RuntimeErrorCode.UNHANDLED_ERROR,
      message: "Viser generell feilside etter en uventet feil",
    });
    for (const forbiddenField of [
      "error",
      "err",
      "errorMessage",
      "error_message",
      "stack",
      "digest",
      "url",
    ]) {
      expect(record).not.toHaveProperty(forbiddenField);
    }
  });
});
