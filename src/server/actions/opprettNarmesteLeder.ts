'use server'

import 'server-only'

import { NarmesteLederInfo, narmesteLederInfoSchema } from '@/schemas/nærmestelederFormSchema'
import { getServerEnv } from '@/env-variables/serverEnv'
import { tokenXFetchUpdate } from '@/server/tokenXFetch'
import { TokenXTargetApi } from '@/server/helpers'
import { mapToLineManagerRequest } from '@/server/actions/requestHelper'
import { withActionResult } from '@/server/actions/ActionResult'

const getLineManagerPostPath = () => `${getServerEnv().NARMESTELEDER_BACKEND_HOST}/api/v1/linemanager`

export const opprettNaresteLeder = (narmesteLeder: NarmesteLederInfo) =>
  withActionResult(async () => {
    narmesteLederInfoSchema.parse(narmesteLeder)

    await tokenXFetchUpdate({
      targetApi: TokenXTargetApi.NARMESTELEDER_BACKEND,
      endpoint: getLineManagerPostPath(),
      method: 'POST',
      requestBody: mapToLineManagerRequest(narmesteLeder),
    })
  })
