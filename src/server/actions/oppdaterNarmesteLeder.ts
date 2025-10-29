import 'server-only'

import { NarmesteLederForm } from '@/schemas/nærmestelederFormSchema'
import { tokenXFetchUpdate } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { getServerEnv } from '@/env-variables/serverEnv'
import { mapToManagerRequest } from '@/server/actions/requestHelper'

const getLineManagerPutPath = (requirementId: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${requirementId}`

export const oppdaterNarmesteLeder = async (requirementId: string, narmesteLeder: NarmesteLederForm): Promise<void> => {
  // TODO validate with zod schema

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getLineManagerPutPath(requirementId),
    method: 'PUT',
    requestBody: mapToManagerRequest(narmesteLeder),
  })
}
