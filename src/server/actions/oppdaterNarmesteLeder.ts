import { NarmesteLederForm } from '@/schemas/nærmestelederFormSchema'
import { tokenXFetchUpdate } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { getServerEnv } from '@/env-variables/serverEnv'
import { mapToNarmesteLederRequest } from '@/server/actions/requestHelper'

const getNarmestelederPutPath = (behovId: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/narmesteleder/behov/${behovId}`

export const oppdaterNarmesteLeder = async (behovId: string, narmesteLeder: NarmesteLederForm): Promise<void> => {
  // TODO validate with zod schema

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getNarmestelederPutPath(behovId),
    method: 'PUT',
    requestBody: mapToNarmesteLederRequest(narmesteLeder),
  })
}
