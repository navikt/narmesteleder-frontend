'use client'
import { BodyLong, GuidePanel, Heading } from '@navikt/ds-react'
import { LederInfo } from '@/server/fetchData/fetchLederInfo'

export default function AngiLederPanel({ lederInfo }: { lederInfo: LederInfo }) {
  return (
    <GuidePanel>
      <Heading size="medium" level="2" spacing>
        Hei!
      </Heading>
      <BodyLong spacing>
        <strong>
          {lederInfo.sykmeldt.fullnavn} ({lederInfo.sykmeldtFnr})
        </strong>{' '}
        er sykmeldt. Nav mangler informasjon om hvem som er nærmeste leder i bedrift{' '}
        <strong>{lederInfo.orgnummer}</strong>. Personen som oppgis som nærmeste leder, får tilgang den sykmeldte
        ansatte og oppfølgingstjenestene Nav tilbyr på &quot;Dine sykmeldte&quot; hos Nav.
      </BodyLong>
      <BodyLong>
        Vi har forhåndsutfylt skjemaet med navn og fødselsnummer til den ansatte. Du må legge inn kontaktinformasjonen
        til lederen som skal få tilgang.
      </BodyLong>
      <BodyLong>
        Den ansatte vil se hvem bedriften har meldt inn som leder på &quot;Ditt sykefravær&quot; hos Nav
      </BodyLong>
    </GuidePanel>
  )
}
