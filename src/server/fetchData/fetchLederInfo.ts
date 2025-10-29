'use server'

import { getServerEnv } from '@/env-variables/serverEnv'
import { mockLineManagerRequirement } from '@/server/fetchData/demoMockData/mockLineManagerRequirement'
import { LineManagerReadResponse, lineManagerReadSchema, EmployeeResponse } from '@/schemas/lineManagerReadSchema'
import { tokenXFetchGet } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { getRedirectAfterLoginUrlForAG } from '@/auth/redirectToLogin'
import { formatFnr } from '@/utils/formatting'
import { withMockForLocalOrDemo } from '@/utils/mock'

const getLineManagerRequirementPath = (id: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${id}`

const mapToLederInfo = (sykmeldtInfoResponse: LineManagerReadResponse): LederInfo => {
  return {
    id: sykmeldtInfoResponse.id,
    sykmeldtFnr: formatFnr(sykmeldtInfoResponse.employeeIdentificationNumber),
    orgnummer: sykmeldtInfoResponse.orgnumber,
    hovedenhetOrgnummer: sykmeldtInfoResponse.mainOrgnumber,
    narmesteLederFnr: sykmeldtInfoResponse.managerIdentificationNumber,
    sykmeldt: {
      fornavn: sykmeldtInfoResponse.name.firstName,
      etternavn: sykmeldtInfoResponse.name.lastName,
      mellomnavn: sykmeldtInfoResponse.name.middleName || undefined,
      fullnavn: getFullName(sykmeldtInfoResponse.name),
    },
  }
}

const getFullName = (employee: EmployeeResponse): string =>
  [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(' ')

export type Navn = {
  fornavn: string
  etternavn: string
  mellomnavn?: string
  fullnavn: string
}

export type LederInfo = {
  id: string
  sykmeldtFnr: string
  orgnummer: string
  hovedenhetOrgnummer: string
  narmesteLederFnr: string
  sykmeldt: Navn
}

export const fetchLederInfo = withMockForLocalOrDemo(
  mapToLederInfo(mockLineManagerRequirement),
  async (requirementId: string): Promise<LederInfo> => {
    const result = await tokenXFetchGet({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint: getLineManagerRequirementPath(requirementId),
      responseDataSchema: lineManagerReadSchema,
      redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(requirementId),
    })
    return mapToLederInfo(result)
  },
)
