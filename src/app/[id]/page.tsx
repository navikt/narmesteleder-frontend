import { getSykmeldtInfoForNarmesteleder } from '@/services/narmesteleder/narmestelederService'
import SykmeldtPanel from '@/components/SykmeldtPanel'

export default async function Home({ params }: { params: { behovId: string } }) {
  const sykmeldt = await getSykmeldtInfoForNarmesteleder(params.behovId)()

  return <SykmeldtPanel sykmeldt={sykmeldt} />
}
