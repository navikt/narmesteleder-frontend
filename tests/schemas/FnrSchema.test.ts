import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { FnrSchema } from "@/schemas/nærmestelederFormSchema";

vi.mock("@/env-variables/envHelpers", () => ({
  isNonProd: false, // Default to production
}));

describe("FnrSchema", () => {
  it("should reject empty strings", () => {
    expect(() => FnrSchema.parse("")).toThrow(ZodError);
    expect(() => FnrSchema.parse("   ")).toThrow(ZodError); // Only whitespace
  });

  it("should reject non-11-digit numbers", () => {
    expect(() => FnrSchema.parse("123456789")).toThrow(ZodError); // 9 digits
    expect(() => FnrSchema.parse("12345678901234")).toThrow(ZodError); // 14 digits
  });

  it("should reject non-numeric strings", () => {
    expect(() => FnrSchema.parse("1234567890a")).toThrow(ZodError);
    expect(() => FnrSchema.parse("abc")).toThrow(ZodError);
  });

  it("should trim whitespace and validate", () => {
    // This should fail because it's not a valid FNR in production
    expect(() => FnrSchema.parse("  12345678901  ")).toThrow(ZodError);
  });

  it("should validate with real fnr package in production", () => {
    // Test with obviously invalid numbers - should throw
    expect(() => FnrSchema.parse("00000000000")).toThrow(ZodError);
    expect(() => FnrSchema.parse("12345678901")).toThrow(ZodError);

    // Test with valid FNR (generated with https://www.funksjoner.no/fodselsnummer-generator)
    expect(() => FnrSchema.parse("20017912152")).not.toThrow();
    expect(FnrSchema.parse("20017912152")).toBe("20017912152");
  });
});
