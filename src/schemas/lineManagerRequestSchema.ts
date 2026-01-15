import { z } from "zod";
import type {
  NarmesteLederForm,
  NarmesteLederInfo,
} from "@/schemas/nærmestelederFormSchema";

export const managerRequestSchema = z.object({
  nationalIdentificationNumber: z.string(),
  lastName: z.string(),
  mobile: z.string(),
  email: z.string(),
});

export type ManagerRequest = z.infer<typeof managerRequestSchema>;

export const lineManagerRequestSchema = z.object({
  employeeIdentificationNumber: z.string(),
  orgNumber: z.string(),
  lastName: z.string(),
  manager: managerRequestSchema,
});

export type LineManagerRequest = z.infer<typeof lineManagerRequestSchema>;

export const toManagerRequest = (form: NarmesteLederForm): ManagerRequest => ({
  nationalIdentificationNumber: form.fodselsnummer,
  lastName: form.etternavn,
  mobile: form.mobilnummer,
  email: form.epost,
});

export const toLineManagerRequest = (
  info: NarmesteLederInfo,
): LineManagerRequest => ({
  employeeIdentificationNumber: info.sykmeldt.fodselsnummer,
  lastName: info.sykmeldt.etternavn,
  orgNumber: info.sykmeldt.orgnummer,
  manager: toManagerRequest(info.leder),
});
