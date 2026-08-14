import { z } from "zod";

export const lineManagerRevokeRequestSchema = z.object({
  employeeIdentificationNumber: z.string().regex(/^\d{11}$/),
  orgNumber: z.string().regex(/^\d{9}$/),
  lastName: z.string().trim().min(1),
});

export type LineManagerRevokeRequest = z.infer<
  typeof lineManagerRevokeRequestSchema
>;
