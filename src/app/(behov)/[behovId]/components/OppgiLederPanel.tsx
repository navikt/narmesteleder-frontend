import { BodyLong, GuidePanel } from "@navikt/ds-react";
import { useBehovContextState } from "@/app/(behov)/[behovId]/state/contextState";
import { TestId } from "@/utils/testIds";

export default function OppgiLederPanel() {
  const { lederInfo } = useBehovContextState();
  return (
    <GuidePanel poster={true} data-testid={TestId.OppgiLederPanel}>
      <BodyLong spacing>
        <strong>
          {lederInfo.sykmeldt.fullnavn} ({lederInfo.sykmeldtFnr})
        </strong>{" "}
        er sykmeldt. Nav mangler informasjon om hvem som er nærmeste leder for
        den sykmeldte i{" "}
        {lederInfo.orgnavn ? (
          <span>
            <strong>{lederInfo.orgnavn}</strong>
          </span>
        ) : (
          " organisasjonen/virksomheten"
        )}
        . Personen som oppgis som nærmeste leder, får tilgang den sykmeldte
        ansatte og oppfølgingstjenestene Nav tilbyr på &quot;Dine
        sykmeldte&quot; hos Nav.
      </BodyLong>

      <BodyLong spacing>
        Vi har forhåndsutfylt skjemaet med navn og fødselsnummer til den
        ansatte. Du må legge inn kontaktinformasjonen til lederen som skal få
        tilgang.
      </BodyLong>

      <BodyLong>
        Den ansatte vil se hvem som er meldt inn som nærmeste leder på
        &quot;Ditt sykefravær&quot; hos Nav.
      </BodyLong>
    </GuidePanel>
  );
}
