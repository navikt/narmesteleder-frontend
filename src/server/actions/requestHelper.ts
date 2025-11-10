import {
  NarmesteLederForm,
  NarmesteLederInfo,
} from "@/schemas/nærmestelederFormSchema";

export type ManagerRequest = {
  nationalIdentificationNumber: string;
  mobile: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type LineManagerRequest = {
  employeeIdentificationNumber: string;
  orgnumber: string;
  manager: ManagerRequest;
};

export const mapToManagerRequest = (
  narmesteLeder: NarmesteLederForm,
): ManagerRequest => ({
  nationalIdentificationNumber: narmesteLeder.fodselsnummer,
  mobile: narmesteLeder.mobilnummer,
  email: narmesteLeder.epost,
  firstName: narmesteLeder.fornavn,
  lastName: narmesteLeder.etternavn,
});

export const mapToLineManagerRequest = (
  narmesteLederInfoForm: NarmesteLederInfo,
): LineManagerRequest => ({
  employeeIdentificationNumber: narmesteLederInfoForm.sykmeldt.fodselsnummer,
  orgnumber: narmesteLederInfoForm.sykmeldt.orgnummer,
  manager: mapToManagerRequest(narmesteLederInfoForm.leder),
});
