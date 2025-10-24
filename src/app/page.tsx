import NarmestelederLanding from '@/features/NarmestelederLanding'
import { registerNarmestelederWithLogging } from '@/services/narmesteleder/narmestelederService'

export default async function Home() {
  const backendPostResult = await registerNarmestelederWithLogging()
  const narmestelederContext = { backendPostResult }

  return <NarmestelederLanding {...narmestelederContext} />
}
