import { beforeEach, describe, expect, it, vi } from "vitest";
import * as envHelpers from "@/env-variables/envHelpers";
import { mockable } from "@/utils/mockable";

describe("mockable", () => {
  const realFn = vi.fn(async (x: number) => x + 1);
  const fakeFn = vi.fn(async (x: number) => x - 1);

  beforeEach(() => {
    realFn.mockClear();
    fakeFn.mockClear();
  });

  it("calls real implementation when isLocalOrDemo is false", async () => {
    vi.spyOn(envHelpers, "isLocalOrDemo", "get").mockReturnValue(false);

    const fn = mockable({ real: realFn, mock: fakeFn });
    expect(await fn(5)).toBe(6);
    expect(realFn).toHaveBeenCalledWith(5);
    expect(fakeFn).not.toHaveBeenCalled();
  });

  it("calls fake implementation when isLocalOrDemo is true", async () => {
    vi.spyOn(envHelpers, "isLocalOrDemo", "get").mockReturnValue(true);

    const fn = mockable({ real: realFn, mock: fakeFn });
    expect(await fn(5)).toBe(4);
    expect(fakeFn).toHaveBeenCalledWith(5);
    expect(realFn).not.toHaveBeenCalled();
  });

  it("throws error if impl is not a function", () => {
    vi.spyOn(envHelpers, "isLocalOrDemo", "get").mockReturnValue(true);

    // @ts-expect-error purposely wrong for test
    expect(() => mockable({ real: realFn, mock: null })).toThrow(
      "Provided implementation does not contain a valid function.",
    );
  });
});
