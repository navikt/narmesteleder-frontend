import { validateSurveyDocumentV1 } from "@navikt/lumi-survey";
import { describe, expect, it } from "vitest";
import { lumiSurveyConfig } from "./lumiSurveyConfig";

describe("lumiSurveyConfig", () => {
  it("is a valid page-based survey with the existing analytics contract", () => {
    expect(validateSurveyDocumentV1(lumiSurveyConfig)).toBe(lumiSurveyConfig);
    const questions = lumiSurveyConfig.pages.flatMap((page) => page.questions);

    expect(
      questions.map((question) => ({
        id: question.id,
        type: question.type,
        ratingVariant:
          question.type === "rating" ? question.variant : undefined,
      })),
    ).toEqual([
      {
        id: "narmesteleder-til-hjelp",
        type: "rating",
        ratingVariant: "emoji",
      },
      {
        id: "narmesteleder-begrunnelse",
        type: "text",
        ratingVariant: undefined,
      },
    ]);
  });
});
