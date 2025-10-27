export type SykmeldtPost = {
  navn: string
  fodselsnummer: string
}

export type LederPost = {
  fodselsnummer: string
  fornavn: string
  etternavn: string
  mobilnummer: string
  epost: string
}

export type RegisterRequest = {
  sykmeldt: SykmeldtPost
  leder: LederPost
}

export type PrefillResponse = {
  sykmeldt: SykmeldtPost
}

export type Sykmeldt = {
  firstName: string
  lastName: string
  middleName?: string
}

export const getFullName = (sykmeldt: Sykmeldt): string =>
  [sykmeldt.firstName, sykmeldt.middleName, sykmeldt.lastName].filter(Boolean).join(' ')
