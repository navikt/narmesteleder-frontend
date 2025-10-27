import { getSykmeldtInfoForNarmesteleder } from '@/services/narmesteleder/narmestelederService'
import SykmeldtPanel from '@/components/SykmeldtPanel'
import { logger } from '@navikt/next-logger'

export default async function Home({ params }: { params: { behovId: string } }) {
  logger.info(`Henter sykmeldt info for nærmeste leder med behovId ${params.behovId}`)
  const sykmeldt = await getSykmeldtInfoForNarmesteleder(params.behovId)()

  return <SykmeldtPanel sykmeldt={sykmeldt} />
}
