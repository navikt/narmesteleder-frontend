'use server'

import { NarmesteLederInfo } from '@/schemas/nærmestelederFormSchema'
import { getServerEnv } from '@/env-variables/serverEnv'
import { tokenXFetchUpdate } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { mapToLineManagerRequest } from '@/server/actions/requestHelper'

const getLineManagerPostPath = () => `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/`

export const opprettNaresteLeder = async (narmesteLeder: NarmesteLederInfo): Promise<void> => {
  // TODO validate with zod schema

  await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
    endpoint: getLineManagerPostPath(),
    method: 'POST',
    requestBody: mapToLineManagerRequest(narmesteLeder),
  })
}
