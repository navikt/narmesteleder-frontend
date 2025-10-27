import { getSykmeldtInfoForNarmesteleder } from '@/services/narmesteleder/narmestelederService'
import SykmeldtPanel from '@/components/SykmeldtPanel'
import { logger } from '@navikt/next-logger'
import notFound from '@/app/not-found'

export default async function Home({ params }: { params: { behovId: string } }) {
  const isValidUuid = /^[0-9a-fA-F-]{36}$/.test(params.behovId)
  if (!isValidUuid) {
    logger.warn(`Invalid behovId format: ${params.behovId}`)
    await notFound() // triggers Next.js 404 page
  }

  logger.info(`Henter sykmeldt info for nærmeste leder med behovId ${params.behovId}`)
  const sykmeldt = await getSykmeldtInfoForNarmesteleder(params.behovId)()

  return <SykmeldtPanel sykmeldt={sykmeldt} />
}
