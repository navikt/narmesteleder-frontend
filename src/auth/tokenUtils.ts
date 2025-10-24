import { logger } from '@navikt/next-logger'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginUrl } from '@/constants/envs'
import { withMockForLocalOrDemo } from '@/utils/mock'

const getTokenFromHeaders = async () => {
  const requestHeaders = await headers()
  return getToken(requestHeaders)
}

const verifyUserLoggedIn = withMockForLocalOrDemo('fake-local-token', async () => {
  const token = await getTokenFromHeaders()
  if (!token) {
    logger.info('Found no token, redirecting to login')
    redirect(loginUrl)
  }
  const validationResult = await validateToken(token)
  if (!validationResult.ok) {
    logger.warn(`Token validation failed with error: ${validationResult.error}, redirecting to login`)
    redirect(loginUrl)
  }

  return token
})

const exchangeIdportenTokenToOboTokenX = withMockForLocalOrDemo(
  'obo-local-token',
  async (idportenToken: string, backendClientId: string): Promise<string> => {
    const oboTokenResult = await requestOboToken(idportenToken, backendClientId)
    if (!oboTokenResult.ok) {
      throw new Error(`Failed to exchange idporten token for narmesteleder-backend tokenx: ${oboTokenResult.error}`)
    }
    return oboTokenResult.token
  },
)

export const getOboTokenX = async (backendClientId: string): Promise<string> => {
  const idportenToken = await verifyUserLoggedIn()
  return exchangeIdportenTokenToOboTokenX(idportenToken, backendClientId)
}
