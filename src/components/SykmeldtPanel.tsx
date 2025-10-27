'use client'
import { NarmesteLederGetResponse } from '@/services/narmesteleder/narmestelederService'
import { BodyShort, GuidePanel, Heading, Page, VStack } from '@navikt/ds-react'
import { getFullName } from '@/services/narmesteleder/schemas/formSchema'

export default function SykmeldtPanel({ sykmeldt }: { sykmeldt: NarmesteLederGetResponse }) {
  return (
    <Page>
      <Page.Block width={'2xl'}>
        <Heading size="large" level="1">
          Oppgi nærmeste leder
        </Heading>
      </Page.Block>
      <Page.Block width={'2xl'}>
        <GuidePanel>
          <VStack gap="space-20">
            <BodyShort>Hei xxx!</BodyShort>
            <BodyShort>
              <span className="font-bold">
                {getFullName(sykmeldt.name)} ({sykmeldt.sykmeldtFnr})
              </span>{' '}
              er sykmeldt. Nav mangler informasjon om hvem som er nærmeste leder i bedrift{' '}
              <span className="font-bold">{sykmeldt.orgnummer}</span>. Personen som oppgis som nærmeste leder, får
              tilgang den sykmeldte ansatte og oppfølgingstjenestene Nav tilbyr på &quot;Dine sykmeldte&quot; hos Nav.
            </BodyShort>
            <BodyShort>
              Vi har forhåndsutfylt skjemaet med navn og f.nr til den ansatte. Du må legge inn kontaktinformasjonen til
              lederen som skal få tilgang.
            </BodyShort>
            <BodyShort>
              Den ansatte vil se hvem bedriften har meldt inn som leder på &quot;Ditt sykefravær&quot; hos Nav
            </BodyShort>
          </VStack>
        </GuidePanel>
      </Page.Block>
    </Page>
  )
}
