import { email, object, string, z } from "zod";
import { dnr, fnr } from "@navikt/fnrvalidator";
import { isNonProd } from "@/env-variables/envHelpers";

const requireFieldErrorMessage = "Feltet er påkrevd";
const invalidEmailErrorMessage = "Ugyldig e-postadresse";
const invalidOrgnummerMessage = "Organisasjonsnummer må være 9 siffer";
const invalidFnrErrorMessage = "Fødselsnummeret er ikke gyldig";
const requiredFnrErrorMessage = "Fødselsnummeret er påkrevd";
const lengthAndNumberFnrErrorMessage =
  "Fødselsnummeret må være nøyaktig 11 siffer";
const invalidMobilnummerErrorMessage = "Mobilnummeret må være 8 siffer";

const validateFnr = (
  value: string,
  isNonProdEnv: boolean = isNonProd,
): boolean =>
  isNonProdEnv ||
  fnr(value).status === "valid" ||
  dnr(value).status === "valid";

export const FnrSchema = string()
  .trim()
  .nonempty(requiredFnrErrorMessage)
  .regex(/^\d{11}$/, lengthAndNumberFnrErrorMessage)
  .refine((value) => validateFnr(value), {
    message: invalidFnrErrorMessage,
  });

export const narmesteLederFormSchema = object({
  fodselsnummer: FnrSchema,
  etternavn: string().trim().nonempty(requireFieldErrorMessage),
  mobilnummer: string()
    .trim()
    .nonempty(requireFieldErrorMessage)
    .regex(/^\d{8}$/, invalidMobilnummerErrorMessage),
  epost: email(invalidEmailErrorMessage).nonempty(requireFieldErrorMessage),
});

export type NarmesteLederForm = z.infer<typeof narmesteLederFormSchema>;

export const sykmeldtFormSchema = object({
  fodselsnummer: FnrSchema,
  etternavn: string().trim().nonempty(requireFieldErrorMessage),
  orgnummer: string()
    .trim()
    .nonempty(requireFieldErrorMessage)
    .regex(/^\d{9}$/, invalidOrgnummerMessage),
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
