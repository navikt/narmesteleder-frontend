import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { FnrSchema } from "@/schemas/nærmestelederFormSchema";

type TestCase = {
  input: string;
  description: string;
  isValid: boolean;
};

const runTestCase = (testCase: TestCase) => {
  const expectation = expect(
    () => FnrSchema.parse(testCase.input),
    `${testCase.description} (input: "${testCase.input}")`,
  );

  if (testCase.isValid) {
    expectation.not.toThrow();
  } else {
    expectation.toThrow(ZodError);
  }
};

const fnrSchemaTestCases: TestCase[] = [
  { input: "", description: "empty string", isValid: false },
  { input: "   ", description: "whitespace only", isValid: false },
  {
    input: "123456789",
    description: "too short (9 digits)",
    isValid: false,
  },
  {
    input: "123456789012",
    description: "too long (12 digits)",
    isValid: false,
  },
  {
    input: "1234567890a",
    description: "contains non-numeric characters",
    isValid: false,
  },
  { input: "00000000000", description: "invalid FNR/DNR", isValid: false },
  {
    input: "  12345678901  ",
    description: "invalid FNR with whitespace",
    isValid: false,
  },
  { input: "20017912152", description: "valid FNR", isValid: true },
  { input: "42034406566", description: "valid DNR", isValid: true },
  {
    input: "  20017912152  ",
    description: "valid FNR with whitespace",
    isValid: true,
  },
];

describe("FnrSchema", () => {
  it("should validate FNR inputs correctly", () => {
    fnrSchemaTestCases.forEach(runTestCase);
  });
});
