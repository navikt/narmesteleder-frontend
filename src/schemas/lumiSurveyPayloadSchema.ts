import { z } from "zod";

export const lumiSurveyPayloadSchema = z
  .object({
    schemaVersion: z.literal(1),
    surveyId: z.string().min(1),
    surveyType: z.enum([
      "rating",
      "topTasks",
      "discovery",
      "taskPriority",
      "custom",
    ]),
    submittedAt: z.string().min(1),
    startedAt: z.string().optional(),
    timeToCompleteMs: z.number().optional(),
    context: z
      .object({
        url: z.string().optional(),
        pathname: z.string().optional(),
        viewport: z
          .object({
            width: z.number(),
            height: z.number(),
          })
          .optional(),
        deviceType: z.enum(["mobile", "tablet", "desktop"]).optional(),
        userAgent: z.string().optional(),
        tags: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
        debug: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
    answers: z
      .array(
        z.object({
          fieldId: z.string().min(1),
          fieldType: z.enum([
            "RATING",
            "TEXT",
            "SINGLE_CHOICE",
            "MULTI_CHOICE",
          ]),
          question: z.object({
            label: z.string(),
            description: z.string().optional(),
            options: z
              .array(
                z.object({
                  id: z.string(),
                  label: z.string(),
                }),
              )
              .optional(),
          }),
          value: z.object({
            type: z.enum(["rating", "text", "singleChoice", "multiChoice"]),
            rating: z.number().optional(),
            ratingVariant: z
              .enum(["emoji", "thumbs", "stars", "nps"])
              .optional(),
            ratingScale: z.number().optional(),
            text: z.string().optional(),
            selectedOptionId: z.string().optional(),
            selectedOptionIds: z.array(z.string()).optional(),
          }),
        }),
      )
      .min(1),
  })
  .strict();
