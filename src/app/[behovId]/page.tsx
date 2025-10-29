import SykmeldtPanel from '@/components/SykmeldtPanel'
import { logger } from '@navikt/next-logger'
import notFound from '@/app/not-found'
import { fetchSykmeldtInfo } from '@/server/fetchData/fetchSykmeldtInfo'

export default async function Home({ params }: { params: Promise<{ behovId: string }> }) {
  const { behovId } = await params
  const isValidUuid = /^[0-9a-fA-F-]{36}$/.test(behovId)
  if (!isValidUuid) {
    logger.warn(`Invalid behovId format: ${behovId}`)
    await notFound() // triggers Next.js 404 page
  }

  logger.info(`Henter sykmeldt info for nærmeste leder med behovId ${behovId}`)
  const sykmeldt = await fetchSykmeldtInfo(behovId)

  return <SykmeldtPanel sykmeldt={sykmeldt} />
}
