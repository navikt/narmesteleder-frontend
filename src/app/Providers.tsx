'use client'

import { PropsWithChildren } from 'react'
import { configureLogger } from '@navikt/next-logger'
import { BASE_PATH } from '../../next.config'

configureLogger({
  basePath: BASE_PATH,
})

export default function Providers({ children }: PropsWithChildren) {
  return children
}
