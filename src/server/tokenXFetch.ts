import 'server-only'

import { cache } from 'react'
import z from 'zod'
import { logger } from '@navikt/next-logger'
import { requestOboToken } from '@navikt/oasis'
import { validateIdPortenToken } from '@/auth/validateIdPortenToken'
import { redirectToLogin } from '@/auth/redirectToLogin'
import { getBackendRequestHeaders, getClientIdForTokenXTargetApi, TokenXTargetApi } from './helpers'

/**
 * Redirects users to login if validation is unsuccessful.
 */
const validateAndGetIdPortenTokenOrRedirectToLogin = async (redirectAfterLoginUrl: string) => {
  const validationResult = await validateIdPortenToken()

  if (!validationResult.success) {
    return redirectToLogin(redirectAfterLoginUrl)
  }

  return validationResult.token
}

/**
 * Throws error if validation is unsuccessful.
 */
const validateAndGetIdPortenToken = async () => {
  const validationResult = await validateIdPortenToken()

  if (!validationResult.success) {
    const errorMessage = `IdPorten token validation failed: ${validationResult.reason}`
    logErrorMessageAndThrowError(errorMessage)
  }

  return validationResult.token
}

const exchangeIdPortenTokenForTokenXOboToken = cache(async (idPortenToken: string, targetApi: TokenXTargetApi) => {
  const tokenXGrant = await requestOboToken(idPortenToken, getClientIdForTokenXTargetApi(targetApi))

  if (!tokenXGrant.ok) {
    const errorMessage = `Failed to exchange idporten token: ${tokenXGrant.error}`
    logErrorMessageAndThrowError(errorMessage)
  }

  return tokenXGrant.token
})

function logErrorMessageAndThrowError(logMessage: string): never {
  logger.error(logMessage)
  throw new Error('Det oppstod en feil ved henting av data.')
}

async function logFailedFetchAndThrowError(
  response: Response,
  calledEndpoint: string,
  calledMethod: string = 'GET',
): Promise<never> {
  let bodySnippet: string | undefined
  try {
    const text = await response.text()
    bodySnippet = text.slice(0, 500)
  } catch {
    /* ignore */
  }

  const errorMessage = `Fetch failed: method=${calledMethod} endpoint=${calledEndpoint} status=${response.status} ${response.statusText}${bodySnippet ? ` body=${bodySnippet}` : ''}`
  logErrorMessageAndThrowError(errorMessage)
}

export async function tokenXFetchGet<S extends z.ZodType>({
  targetApi,
  endpoint,
  responseDataSchema,
  redirectAfterLoginUrl,
}: {
  targetApi: TokenXTargetApi
  endpoint: string
  responseDataSchema: S
  redirectAfterLoginUrl: string
}): Promise<z.infer<S>> {
  const idPortenToken = await validateAndGetIdPortenTokenOrRedirectToLogin(redirectAfterLoginUrl)

  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi)

  const response = await fetch(endpoint, {
    headers: getBackendRequestHeaders(oboToken),
  })

  if (!response.ok) {
    await logFailedFetchAndThrowError(response, endpoint)
  }

  let responseData: unknown
  try {
    responseData = await response.json()
  } catch (err) {
    const errorMessage = `Failed to parse response as JSON from ${endpoint}: ${err}`
    logErrorMessageAndThrowError(errorMessage)
  }

  try {
    return responseDataSchema.parse(responseData)
  } catch (err) {
    const errorMessage = `Failed to parse response data with zod schema from ${endpoint}: ${err}`
    logErrorMessageAndThrowError(errorMessage)
  }
}

export async function tokenXFetchUpdate({
  targetApi,
  endpoint,
  requestBody,
  method = 'POST',
}: {
  targetApi: TokenXTargetApi
  endpoint: string
  requestBody: unknown
  method?: 'POST' | 'PUT' | 'DELETE'
}) {
  const idPortenToken = await validateAndGetIdPortenToken()

  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(idPortenToken, targetApi)

  const response = await fetch(endpoint, {
    method,
    body: JSON.stringify(requestBody),
    headers: getBackendRequestHeaders(oboToken),
  })

  if (!response.ok) {
    await logFailedFetchAndThrowError(response, endpoint, method)
  }

  return true
}
