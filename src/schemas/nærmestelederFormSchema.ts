import { dnr, fnr } from "@navikt/fnrvalidator";
import { email, object, string, type z } from "zod";
import { isNonProd } from "@/env-variables/envHelpers";
import { ValidationMessages } from "@/utils/validationMessages";

const validateFnr = (
  value: string,
  isNonProdEnv: boolean = isNonProd,
): boolean =>
  isNonProdEnv ||
  fnr(value).status === "valid" ||
  dnr(value).status === "valid";

export const FnrSchema = string()
  .trim()
  .nonempty(ValidationMessages.RequiredFnr)
  .regex(/^\d{11}$/, ValidationMessages.LengthAndNumberFnr)
  .refine((value) => validateFnr(value), {
    message: ValidationMessages.InvalidFnr,
  });

export const narmesteLederFormSchema = object({
  fodselsnummer: FnrSchema,
  etternavn: string().trim().nonempty(ValidationMessages.RequireField),
  mobilnummer: string()
    .trim()
    .nonempty(ValidationMessages.RequireField)
    .regex(/^\d{8}$/, ValidationMessages.InvalidMobilnummer),
  epost: email(ValidationMessages.InvalidEmail).nonempty(
    ValidationMessages.RequireField,
  ),
});

export type NarmesteLederForm = z.infer<typeof narmesteLederFormSchema>;

export const sykmeldtFormSchema = object({
  fodselsnummer: FnrSchema,
  etternavn: string().trim().nonempty(ValidationMessages.RequireField),
  orgnummer: string()
    .trim()
    .nonempty(ValidationMessages.RequireField)
    .regex(/^\d{9}$/, ValidationMessages.InvalidOrgnummer),
});

export type SykmeldtForm = z.infer<typeof sykmeldtFormSchema>;

export const narmesteLederInfoSchema = object({
  sykmeldt: sykmeldtFormSchema,
  leder: narmesteLederFormSchema,
});

export type NarmesteLederInfo = z.infer<typeof narmesteLederInfoSchema>;

export const sykmeldtFormDefaults: SykmeldtForm = {
  fodselsnummer: "",
  etternavn: "",
  orgnummer: "",
} satisfies SykmeldtForm;

export const narmesteLederFormDefaults: NarmesteLederForm = {
  fodselsnummer: "",
  etternavn: "",
  mobilnummer: "",
  epost: "",
} satisfies NarmesteLederForm;

export const narmesteLederInfoDefaults = {
  sykmeldt: sykmeldtFormDefaults,
  leder: narmesteLederFormDefaults,
} satisfies NarmesteLederInfo;

export const lederSchema = narmesteLederInfoSchema.pick({ leder: true });
export type Leder = Pick<NarmesteLederInfo, "leder">;
export const lederDefaults: Leder = {
  leder: narmesteLederFormDefaults,
};
