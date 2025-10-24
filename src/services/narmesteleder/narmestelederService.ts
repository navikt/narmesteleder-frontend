import { getServerEnv } from '@/constants/envs'
import { getOboTokenX } from '@/auth/tokenUtils'
import { withErrorLogging } from '@/utils/logging'
import { withMockForLocalOrDemo } from '@/utils/mock'

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

const getBackendUrl = () => getServerEnv().NARMESTELEDER_BACKEND_URL

const getPostNarmestelederPath = () => `${getBackendUrl()}/api/v1/narmesteleder`

const narmestelederBackendId = () => `${getServerEnv().NAIS_CLUSTER_NAME}:team-esyfo:esyfo-narmesteleder`

// TODO replace with real data from form
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
  const response = await fetch(getPostNarmestelederPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getOboTokenX(narmestelederBackendId())}`,
    },
    body: JSON.stringify(narmestelederPostRequestDemoSample),
  })
  if (!response.ok) {
    throw Error(`Failed to register narmesteleder: ${response.statusText}`)
  }
  return response.text()
})

export const registerNarmestelederWithLogging = withErrorLogging(registerNarmesteleder)
