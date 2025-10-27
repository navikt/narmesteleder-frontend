import { getServerEnv } from '@/constants/envs'
import { getOboTokenX } from '@/auth/tokenUtils'
import { withErrorLogging } from '@/utils/logging'
import { withMockForLocalOrDemo } from '@/utils/mock'
import { Sykmeldt } from '@/services/narmesteleder/schemas/formSchema'

type Leder = {
  fnr: string
  mobil: string
  epost: string
  fornavn: string
  etternavn: string
}

type NarmesteLederPostRequest = {
  sykmeldtFnr: string
  organisasjonsnummer: string
  leder: Leder
}

// TODO replace with real data from form validated with zod schema
export type NarmesteLederGetResponse = {
  id: string
  sykmeldtFnr: string
  orgnummer: string
  hovedenhetOrgnummer: string
  narmesteLederFnr: string
  name: Sykmeldt
}

const getBackendUrl = () => getServerEnv().NARMESTELEDER_BACKEND_URL

const getNarmestelederPostPath = () => `${getBackendUrl()}/api/v1/narmesteleder`

const getNarmestelederGetPath = (behovId: string) => `${getBackendUrl()}/api/v1/narmesteleder/behov/${behovId}`

const backendId = () => `${getServerEnv().NAIS_CLUSTER_NAME}:team-esyfo:esyfo-narmesteleder`

// TODO replace with real data from form validated with zod schema
const narmestelederPostRequestDemoSample: NarmesteLederPostRequest = {
  sykmeldtFnr: '26095514420',
  organisasjonsnummer: '963890095',
  leder: {
    fnr: '19048938755',
    mobil: '99988877',
    fornavn: 'John',
    etternavn: 'Petrucci',
    epost: 'john.petrucci@guitarhero.com',
  },
}

const registerNarmesteleder = withMockForLocalOrDemo('test-post-narmesteleder', async (): Promise<string> => {
  const response = await fetch(getNarmestelederPostPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getOboTokenX(backendId())}`,
    },
    body: JSON.stringify(narmestelederPostRequestDemoSample),
  })
  if (!response.ok) {
    throw Error(`Failed to register narmesteleder: ${response.statusText}`)
  }
  return response.text()
})

export const registerNarmestelederWithLogging = withErrorLogging(registerNarmesteleder)

const getMockSykmeldt = (): NarmesteLederGetResponse => ({
  id: '123456',
  sykmeldtFnr: '26095514420',
  orgnummer: '963890095',
  hovedenhetOrgnummer: '123456789',
  narmesteLederFnr: '19048938755',
  name: {
    firstName: 'John',
    lastName: 'Doe',
  },
})

// TODO logging
export const getSykmeldtInfoForNarmesteleder = (behovId: string) =>
  withMockForLocalOrDemo(getMockSykmeldt(), async (): Promise<NarmesteLederGetResponse> => {
    const response = await fetch(getNarmestelederGetPath(behovId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getOboTokenX(backendId())}`,
      },
    })
    if (!response.ok) {
      throw Error(`Failed to get narmesteleder info with ${behovId}: ${response.statusText}`)
    }
    return response.json()
  })
