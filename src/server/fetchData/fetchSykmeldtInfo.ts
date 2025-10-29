'use server'

import { getServerEnv } from '@/env-variables/serverEnv'
import { mockSykmeldtInfo } from '@/server/fetchData/demoMockData/mockSykmeldtInfo'
import { SykmeldtInfoResponse, sykmeldtInfoSchema, SykmeldtResponse } from '@/schemas/sykmeldtInfoSchema'
import { tokenXFetchGet } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { getRedirectAfterLoginUrlForAG } from '@/auth/redirectToLogin'
import { formatFnr } from '@/utils/formatting'
import { withMockForLocalOrDemo } from '@/utils/mock'

const getNarmestelederGetPath = (behovId: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/narmesteleder/behov/${behovId}`

export type Sykmeldt = {
  fornavn: string
  etternavn: string
  mellomnavn?: string
  fullnavn: string
}

export type SykmeldtInfo = {
  id: string
  sykmeldtFnr: string
  orgnummer: string
  hovedenhetOrgnummer: string
  narmesteLederFnr: string
  sykmeldt: Sykmeldt
}

const mapSykmeldtInfo = (sykmeldtInfoResponse: SykmeldtInfoResponse): SykmeldtInfo => {
  return {
    id: sykmeldtInfoResponse.id,
    sykmeldtFnr: formatFnr(sykmeldtInfoResponse.sykmeldtFnr),
    orgnummer: sykmeldtInfoResponse.orgnummer,
    hovedenhetOrgnummer: sykmeldtInfoResponse.hovedenhetOrgnummer,
    narmesteLederFnr: sykmeldtInfoResponse.narmesteLederFnr,
    sykmeldt: {
      fornavn: sykmeldtInfoResponse.name.firstName,
      etternavn: sykmeldtInfoResponse.name.lastName,
      mellomnavn: sykmeldtInfoResponse.name.middleName || undefined,
      fullnavn: getFullName(sykmeldtInfoResponse.name),
    },
  }
}

const getFullName = (sykmeldt: SykmeldtResponse): string =>
  [sykmeldt.firstName, sykmeldt.middleName, sykmeldt.lastName].filter(Boolean).join(' ')

export const fetchSykmeldtInfo = withMockForLocalOrDemo(
  mapSykmeldtInfo(mockSykmeldtInfo),
  async (behovId: string): Promise<SykmeldtInfo> => {
    const result = await tokenXFetchGet({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint: getNarmestelederGetPath(behovId),
      responseDataSchema: sykmeldtInfoSchema,
      redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(behovId),
    })
    return mapSykmeldtInfo(result)
  },
)
