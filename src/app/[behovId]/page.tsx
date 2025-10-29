import OppgiLederPanel from '@/components/OppgiLederPanel'
import { logger } from '@navikt/next-logger'
import notFound from '@/app/not-found'
import { fetchLederInfo } from '@/server/fetchData/fetchLederInfo'

export default async function Home({ params }: { params: Promise<{ behovId: string }> }) {
  const { behovId } = await params
  const isValidUuid = /^[0-9a-fA-F-]{36}$/.test(behovId)
  if (!isValidUuid) {
    logger.warn(`Invalid behovId format: ${behovId}`)
    await notFound() // triggers Next.js 404 page
  }

  logger.debug(`Henter sykmeldt info for nærmeste leder med behovId ${behovId}`)
  const lederInfo = await fetchLederInfo(behovId)

  return <OppgiLederPanel lederInfo={lederInfo} />
}
