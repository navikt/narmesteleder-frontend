import { logger } from '@navikt/next-logger'

export const withErrorLogging =
  <T>(fn: () => Promise<T>) =>
  async () => {
    try {
      return await fn()
    } catch (error) {
      logger.error(error)
      throw error
    }
  }
