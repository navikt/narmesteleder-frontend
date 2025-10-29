import { NarmesteLederInfo } from '@/schemas/nærmestelederFormSchema'
import { getServerEnv } from '@/env-variables/serverEnv'
import { tokenXFetchUpdate } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { mapToNarmesteLederInfoRequest } from '@/server/actions/requestHelper'

const getNarmestelederPostPath = () => `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/narmesteleder/`

export const opprettNaresteLeder = async (narmesteLeder: NarmesteLederInfo): Promise<void> => {
  // TODO validate with zod schema

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getNarmestelederPostPath(),
    method: 'POST',
    requestBody: mapToNarmesteLederInfoRequest(narmesteLeder),
  })
}
