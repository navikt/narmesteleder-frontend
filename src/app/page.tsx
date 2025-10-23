import { exchangeIdportenTokenForNarmestelederBackendTokenx, verifyUserLoggedIn } from '@/auth/tokenUtils'
import NarmestelederLanding from '@/features/NarmestelederLanding'
import { registerNarmestelederWithLogging } from '@/services/narmesteleder/narmestelederService'

export default async function Home() {
  const idPortToken = await verifyUserLoggedIn()
  const oboToken = await exchangeIdportenTokenForNarmestelederBackendTokenx(idPortToken) // In a real scenario, you would exchange the idPortToken for an OBO token here.
  const backendPostResult = await registerNarmestelederWithLogging()
  const narmestelederContext = { idPortToken, oboToken, backendPostResult }

  return <NarmestelederLanding {...narmestelederContext} />
}
