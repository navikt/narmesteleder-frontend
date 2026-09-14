import { assertLogEvent } from "@navikt/esyfo-logger-testkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

const lines = vi.hoisted((): string[] => []);
const notFound = vi.hoisted(() => vi.fn(() => "not found"));

vi.mock("@/app/not-found", () => ({ default: notFound }));
vi.mock("./components/InfoLoader", () => ({ InfoLoader: () => null }));
vi.mock("@navikt/next-logger", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@navikt/next-logger")>();
  return {
    ...actual,
    logger: actual.backendLogger(
      {},
      { write: (line: string) => lines.push(line) },
    ),
  };
});

beforeEach(() => {
  lines.length = 0;
  vi.clearAllMocks();
});

describe("behov route logging", () => {
  it("preserves validation diagnostics and the not-found result", async () => {
    const invalidId = "private-identifier-canary";
    const result = await Home({
      params: Promise.resolve({ behovId: invalidId }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBe("not found");
    expect(notFound).toHaveBeenCalledOnce();
    assertLogEvent(lines.join(""), {
      event: {
        name: "behov_route_invalid_parameter",
        operation: "vis_behov",
        level: "warn",
        message: "[Route] invalid behovId parameter in URL",
      },
      context: { error_code: "INVALID_INPUT" },
      contains: ["Invalid UUID"],
      excludes: [invalidId],
    });
  });

  it("does not warn or reject a valid behov ID", async () => {
    const result = await Home({
      params: Promise.resolve({
        behovId: "3ba48bb7-a967-4185-a0e7-c044011be683",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(notFound).not.toHaveBeenCalled();
    expect(lines).toEqual([]);
  });
});
