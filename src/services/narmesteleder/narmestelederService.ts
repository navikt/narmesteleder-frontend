import { getOboTokenX } from '@/auth/tokenUtils'
import { withMockForLocalOrDemo } from '@/utils/mock'
import { getServerEnv } from '@/env-variables/serverEnv'

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

const getBackendUrl = () => getServerEnv().NARMESTELEDER_BACKEND_HOST

const getNarmestelederPostPath = () => `${getBackendUrl()}/api/v1/narmesteleder`

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
