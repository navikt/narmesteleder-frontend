import { array, lazy, object, string, type z } from "zod";

export interface AccessibleOrganizationResponse {
  orgNumber: string;
  name: string;
  subOrganizations: AccessibleOrganizationResponse[];
}

export const accessibleOrganizationSchema: z.ZodType<AccessibleOrganizationResponse> =
  object({
    orgNumber: string(),
    name: string(),
    subOrganizations: array(lazy(() => accessibleOrganizationSchema)),
  });

export const accessibleOrganizationsResponseSchema = object({
  organizations: array(accessibleOrganizationSchema),
});
