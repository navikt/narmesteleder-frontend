import { publicEnv } from '@/env-variables/publicEnv'
import { redirect } from 'next/navigation'

export function getRedirectAfterLoginUrlForAG(behovId: string) {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${behovId}`
}

export const redirectToLogin = (redirectAfterLoginUrl: string) => {
  const loginPath = `/oauth2/login?redirect=${encodeURIComponent(redirectAfterLoginUrl)}`

  return redirect(loginPath)
}
