import { getServerEnv } from '@/env-variables/serverEnv'
import { isLocalOrDemo } from '@/env-variables/envHelpers'
import { logger } from '@navikt/next-logger'

export enum TokenXTargetApi {
  NARMESTELEDER_BACKEND = 'NARMESTELEDER_BACKEND',
}

export const getBackendRequestHeaders = (oboToken: string) => ({
  Authorization: `Bearer ${oboToken}`,
  'Content-Type': 'application/json',
})

export function getClientIdForTokenXTargetApi(targetApi: TokenXTargetApi): string {
  if (targetApi === TokenXTargetApi.NARMESTELEDER_BACKEND) {
    return getServerEnv().NARMESTELEDER_BACKEND_CLIENT_ID
  } else {
    return '' as never
  }
}

export const withMockForLocalOrDemo =
  <T, TArgs extends unknown[]>(mockValue: T, fn: (...args: TArgs) => Promise<T>): ((...args: TArgs) => Promise<T>) =>
  async (...args: TArgs) => {
    if (isLocalOrDemo) {
      logger.warn('Is running locally or demo, returning mock value ${mockValue}')
      return mockValue
    }
    return fn(...args)
  }
