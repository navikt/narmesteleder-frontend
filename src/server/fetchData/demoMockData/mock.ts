import { logger } from '@navikt/next-logger'
import { isLocalOrDemo } from '@/env-variables/envHelpers'

export const withMockForLocalOrDemo =
  <T, TArgs extends unknown[]>(mockValue: T, fn: (...args: TArgs) => Promise<T>): ((...args: TArgs) => Promise<T>) =>
  async (...args: TArgs) => {
    if (isLocalOrDemo) {
      logger.warn('Is running locally or demo, returning mock value ${mockValue}')
      return mockValue
    }
    return fn(...args)
  }
