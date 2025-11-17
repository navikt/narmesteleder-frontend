import { z } from "zod";
import {
  NarmesteLederForm,
  NarmesteLederInfo,
} from "@/schemas/nærmestelederFormSchema";

export const managerRequestSchema = z.object({
  nationalIdentificationNumber: z.string(),
  mobile: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type ManagerRequest = z.infer<typeof managerRequestSchema>;

export const lineManagerRequestSchema = z.object({
  employeeIdentificationNumber: z.string(),
  orgNumber: z.string(),
  manager: managerRequestSchema,
});

export type LineManagerRequest = z.infer<typeof lineManagerRequestSchema>;

export const toManagerRequest = (form: NarmesteLederForm): ManagerRequest => ({
  nationalIdentificationNumber: form.fodselsnummer,
  mobile: form.mobilnummer,
  email: form.epost,
  firstName: form.fornavn,
  lastName: form.etternavn,
});

export const toLineManagerRequest = (
  info: NarmesteLederInfo,
): LineManagerRequest => ({
  employeeIdentificationNumber: info.sykmeldt.fodselsnummer,
  orgNumber: info.sykmeldt.orgnummer,
  manager: toManagerRequest(info.leder),
});
