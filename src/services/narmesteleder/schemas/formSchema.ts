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
