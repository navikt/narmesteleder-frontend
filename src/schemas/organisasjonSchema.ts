import type { Organisasjon } from "@navikt/virksomhetsvelger";
import { array, lazy, object, string, type z } from "zod";

export const organisasjonSchema: z.ZodType<Organisasjon> = object({
  orgnr: string(),
  navn: string(),
  underenheter: array(lazy(() => organisasjonSchema)),
});

export const organisasjonerSchema = object({
  organisasjoner: array(organisasjonSchema),
});

export type OrganisasjonResponse = z.infer<typeof organisasjonSchema>;
