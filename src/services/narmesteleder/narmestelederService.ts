import { getServerEnv, isLocalOrDemo } from '@/constants/envs'
import { exchangeIdportenTokenForNarmestelederBackendTokenx, verifyUserLoggedIn } from '@/auth/tokenUtils'

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

const getOboToken = async () => {
  const idPortenToken = await verifyUserLoggedIn()
  return exchangeIdportenTokenForNarmestelederBackendTokenx(idPortenToken)
}

const getPostNarmestelederPath = () => `${getBackendUrl}/api/v1/narmesteleder`

const narmestelederPostRequestSample: NarmesteLederPostRequest = {
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

export async function registerNarmesteleder(): Promise<string> {
  if (isLocalOrDemo) {
    return 'test-post-narmesteleder'
  }
  const response = await fetch(getPostNarmestelederPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getOboToken()}`,
    },
    body: JSON.stringify(narmestelederPostRequestSample),
  })

  if (!response.ok) {
    throw new Error(`Failed to register narmesteleder: ${response.statusText}`)
  }

  return await response.text()
}
