import { array, boolean, object, string, type z } from "zod";
import { employeeSchema } from "@/schemas/lineManagerReadSchema";

export const requirementsListItemSchema = object({
  id: string(),
  employeeIdentificationNumber: string(),
  orgNumber: string(),
  orgName: string().nullable(),
  mainOrgNumber: string(),
  managerIdentificationNumber: string().nullable(),
  name: employeeSchema,
  /**
   * Scaffold: angir om sykmeldingen fortsatt er aktiv.
   * Feltet er valgfritt i responsen og defaulter til true.
   * Oppdateres når API-kontrakten er bekreftet.
   */
  isActive: boolean().optional().default(true),
});

export const lineManagerRequirementsListSchema = array(
  requirementsListItemSchema,
);

export type RequirementsListItem = z.infer<typeof requirementsListItemSchema>;
export type LineManagerRequirementsList = z.infer<
  typeof lineManagerRequirementsListSchema
>;
