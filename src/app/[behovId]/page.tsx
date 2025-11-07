import OppgiLederPanel from '@/components/OppgiLederPanel'
import { logger } from '@navikt/next-logger'
import notFound from '@/app/not-found'
import { fetchLederInfo } from '@/server/fetchData/fetchLederInfo'
import { requirementIdSchema } from '@/schemas/requirementSchema'
import OppgiNarmesteLederForSykmeldt from '@/components/form/OppgiNarmesteLederForSykmeldt'
import { Heading, Page, VStack } from '@navikt/ds-react'
import SykmeldtBox from '@/components/SykmeldtBox'

const isValidBehovId = (behovId: string) => !requirementIdSchema.safeParse(behovId).success

export default async function Home({ params }: { params: Promise<{ behovId: string }> }) {
  const { behovId } = await params
  if (isValidBehovId(behovId)) {
    logger.warn(`Invalid behovId format: ${behovId}`)
    return notFound()
  }
  const lederInfo = await fetchLederInfo(behovId)

  return (
    <Page>
      <Heading size="large" level="1" spacing>
        Oppgi nærmeste leder for sykmeldt
      </Heading>
      <VStack gap="8">
        <OppgiLederPanel lederInfo={lederInfo} />
        <SykmeldtBox fodselsnummer={lederInfo.sykmeldtFnr} navn={lederInfo.sykmeldt.fullnavn} />
        <OppgiNarmesteLederForSykmeldt behovId={behovId} />
      </VStack>
    </Page>
  )
}
