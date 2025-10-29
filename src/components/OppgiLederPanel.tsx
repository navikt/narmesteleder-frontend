'use client'
import { BodyLong, GuidePanel, Heading, Page } from '@navikt/ds-react'
import { LederInfo } from '@/server/fetchData/fetchLederInfo'

export default function OppgiLederPanel({ lederInfo }: { lederInfo: LederInfo }) {
  return (
    <Page>
      <Page.Block width={'2xl'}>
        <Heading size="large" level="1" spacing>
          Oppgi nærmeste leder
        </Heading>
      </Page.Block>
      <Page.Block width={'2xl'}>
        <GuidePanel>
          <Heading size="medium" level="2" spacing>
            Hei xxx!
          </Heading>
          <BodyLong spacing>
            <span className="font-bold">
              {lederInfo.sykmeldt.fullnavn} ({lederInfo.sykmeldtFnr})
            </span>{' '}
            er sykmeldt. Nav mangler informasjon om hvem som er nærmeste leder i bedrift{' '}
            <span className="font-bold">{lederInfo.orgnummer}</span>. Personen som oppgis som nærmeste leder, får
            tilgang den sykmeldte ansatte og oppfølgingstjenestene Nav tilbyr på &quot;Dine sykmeldte&quot; hos Nav.
          </BodyLong>
          <BodyLong>
            Vi har forhåndsutfylt skjemaet med navn og f.nr til den ansatte. Du må legge inn kontaktinformasjonen til
            lederen som skal få tilgang.
          </BodyLong>
          <BodyLong>
            Den ansatte vil se hvem bedriften har meldt inn som leder på &quot;Ditt sykefravær&quot; hos Nav
          </BodyLong>
        </GuidePanel>
      </Page.Block>
    </Page>
  )
}
