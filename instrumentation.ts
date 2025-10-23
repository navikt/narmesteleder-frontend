import { type Instrumentation } from 'next'
import { configureLogger, logger } from '@navikt/next-logger'
import { BASE_PATH } from './next.config'

configureLogger({
  basePath: BASE_PATH,
})

export const onRequestError: Instrumentation.onRequestError = async (error) => {
  logger.error(error)
}
