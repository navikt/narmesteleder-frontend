'use server'

import { NarmesteLederForm, narmesteLederFormSchema } from '@/schemas/nærmestelederFormSchema'
import { tokenXFetchUpdate } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { getServerEnv } from '@/env-variables/serverEnv'
import { mapToManagerRequest } from '@/server/actions/requestHelper'
import { withActionResult } from '@/server/actions/ActionResult'

const getLineManagerPutPath = (requirementId: string) =>
  `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager/requirement/${requirementId}`

export const oppdaterNarmesteLeder = (requirementId: string, narmesteLeder: NarmesteLederForm) =>
  withActionResult(async () => {
    narmesteLederFormSchema.parse(narmesteLeder)

    await tokenXFetchUpdate({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint: getLineManagerPutPath(requirementId),
      method: 'PUT',
      requestBody: mapToManagerRequest(narmesteLeder),
    })
  })
