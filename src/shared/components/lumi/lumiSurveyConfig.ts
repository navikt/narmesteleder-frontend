import type { SurveyDocumentV1 } from "@navikt/lumi-survey";

export const lumiSurveyConfig = {
  authoringSchemaVersion: 1,
  type: "rating",
  pages: [
    {
      id: "tilbakemelding",
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
            questionId: "narmesteleder-til-hjelp",
            operator: "EXISTS",
          },
        },
      ],
    },
  ],
} satisfies SurveyDocumentV1;
