import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const lumiSurveyConfig: LumiSurveyConfig = {
  type: "rating",
  questions: [
    {
      id: "narmesteleder-til-hjelp",
      type: "rating",
      variant: "emoji",
      prompt: "Hvor enkelt var det å melde inn nærmesteleder?",
    },
    {
      id: "narmesteleder-begrunnelse",
      type: "text",
      prompt: "Legg gjerne til en begrunnelse",
      required: false,
      minRows: 3,
      maxLength: 500,
      visibleIf: {
        field: "ANSWER",
        questionId: "narmesteleder-til-hjelp",
        operator: "EXISTS",
      },
    },
  ],
};
