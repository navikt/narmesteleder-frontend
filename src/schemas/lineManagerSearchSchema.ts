import { array, boolean, int, nullable, object, string, type z } from "zod";

const nameSchema = object({
  firstName: string(),
  middleName: nullable(string()),
  lastName: string(),
});

const linemanagerPersonSchema = object({
  nationalIdentificationNumber: string(),
  name: nameSchema.nullable(),
});

const linemanagerManagerSchema = object({
  nationalIdentificationNumber: string(),
  name: nameSchema.nullable(),
  email: string(),
  mobile: string(),
});

export const linemanagerSearchItemSchema = object({
  orgNumber: string(),
  activeFrom: string(),
  employee: linemanagerPersonSchema,
  manager: linemanagerManagerSchema,
});

export const linemanagerSearchPageInfoSchema = object({
  size: int(),
  pageSize: int(),
  hasMore: boolean(),
  nextPageToken: nullable(string()),
});

export const linemanagerSearchResponseSchema = object({
  linemanagers: array(linemanagerSearchItemSchema),
  meta: linemanagerSearchPageInfoSchema,
});

export const linemanagerSearchRequestSchema = object({
  orgNumber: string(),
  hasActiveSickLeave: nullable(boolean()).optional(),
  text: nullable(string()).optional(),
  pageToken: nullable(string()).optional(),
  pageSize: int().optional(),
});

export type LinemanagerSearchItem = z.infer<typeof linemanagerSearchItemSchema>;
export type LinemanagerSearchResponse = z.infer<
  typeof linemanagerSearchResponseSchema
>;
export type LinemanagerSearchRequest = z.infer<
  typeof linemanagerSearchRequestSchema
>;
export type LinemanagerSearchPageInfo = z.infer<
  typeof linemanagerSearchPageInfoSchema
>;
