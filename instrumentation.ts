import { type Instrumentation } from 'next'
import { logger } from '@navikt/next-logger'

export const onRequestError: Instrumentation.onRequestError = async (error) => {
  logger.error(error, 'Unexpected error on request')
}
