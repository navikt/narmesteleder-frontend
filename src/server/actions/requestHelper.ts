import { NarmesteLederForm, NarmesteLederInfo } from '@/schemas/nærmestelederFormSchema'

export type NarmestelederRequest = {
  fnr: string
  mobil: string
  epost: string
  fornavn: string
  etternavn: string
}

export type NarmestelederInfoRequest = {
  sykmeldtFnr: string
  organisasjonsnummer: string
  leder: NarmestelederRequest
}

export const mapToNarmesteLederRequest = (narmesteLeder: NarmesteLederForm): NarmestelederRequest => ({
  fnr: narmesteLeder.fodselsnummer,
  mobil: narmesteLeder.mobilnummer,
  epost: narmesteLeder.epost,
  fornavn: narmesteLeder.fornavn,
  etternavn: narmesteLeder.etternavn,
})

export const mapToNarmesteLederInfoRequest = (narmesteLederInfoForm: NarmesteLederInfo): NarmestelederInfoRequest => ({
  sykmeldtFnr: narmesteLederInfoForm.sykmeldt.fodselsnummer,
  organisasjonsnummer: narmesteLederInfoForm.sykmeldt.orgnummer,
  leder: mapToNarmesteLederRequest(narmesteLederInfoForm.leder),
})
