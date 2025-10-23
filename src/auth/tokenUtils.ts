import { logger } from '@navikt/next-logger'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getServerEnv, isLocalOrDemo, loginUrl } from '@/constants/envs'

async function getTokenFromHeaders() {
  const requestHeaders = await headers()
  return getToken(requestHeaders)
}

export async function verifyUserLoggedIn(): Promise<string> {
  if (isLocalOrDemo) {
    logger.warn('Is running locally, skipping RSC auth')
    return 'fake-local-token'
  }
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
}

export async function exchangeIdportenTokenForNarmestelederBackendTokenx(
  idportenToken: string | null,
): Promise<string> {
  if (isLocalOrDemo) {
    logger.warn('Is running locally, skipping obo auth')
    return 'obo-local-token'
  }

  if (!idportenToken) {
    throw new Error('Mangler idportenToken')
  }
  const NARMESTELEDER_BACKEND_CLIENT_ID = `${getServerEnv().NAIS_CLUSTER_NAME}:team-esyfo:esyfo-narmesteleder`
  const tokenxGrant = await requestOboToken(idportenToken, NARMESTELEDER_BACKEND_CLIENT_ID)

  if (!tokenxGrant.ok) {
    throw new Error(`Failed to exchange idporten token for narmesteleder-backend tokenx: ${tokenxGrant.error}`)
  }

  return tokenxGrant.token
}
