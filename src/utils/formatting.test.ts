import { describe, expect, it } from "vitest";
import { joinNonEmpty } from "@/utils/formatting";

describe("joinNonEmpty", () => {
  type TestCase = {
    name: string;
    input: Array<string | null | undefined>;
    separator?: string;
    expected: string;
  };

  const testCases: TestCase[] = [
    {
      name: "should join multiple strings with default separator",
      input: ["John", "William", "Doe"],
      expected: "John William Doe",
    },
    {
      name: "should filter out multiple falsy values",
      input: ["John", null, "", undefined, "Doe"],
      expected: "John Doe",
    },
    {
      name: "should return empty string for all falsy values",
      input: [null, undefined, ""],
      expected: "",
    },
    {
      name: "should handle single valid string",
      input: ["John"],
      expected: "John",
    },
    {
      name: "should handle empty array",
      input: [],
      expected: "",
    },

    {
      name: "should join with custom comma separator",
      input: ["Apple", "Banana", "Cherry"],
      separator: ", ",
      expected: "Apple, Banana, Cherry",
    },
    {
      name: "should join with no separator",
      input: ["pre", "fix"],
      separator: "",
      expected: "prefix",
    },
  ];

  const runTestCase = (testCase: TestCase): void => {
    const result =
      testCase.separator !== undefined
        ? joinNonEmpty(testCase.input, testCase.separator)
        : joinNonEmpty(testCase.input);

    expect(result).toBe(testCase.expected);
  };

  testCases.forEach((testCase) => {
    it(testCase.name, () => {
      runTestCase(testCase);
    });
  });
});
