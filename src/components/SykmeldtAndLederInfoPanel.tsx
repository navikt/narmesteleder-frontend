import { BodyShort, GuidePanel } from "@navikt/ds-react";

export default function SykmeldtAndLederInfoPanel() {
  return (
    <GuidePanel poster={true}>
      <BodyShort spacing>
        Her kan du oppgi hvem som er nærmeste leder for en sykmeldt ansatt.
        Dette er for å sikre at riktig leder skal få tilgang til
        oppfølgingstjenestene på &quot;Dine sykmeldte&quot; for å følge opp den
        ansatte som er syk.
      </BodyShort>

      <BodyShort>
        Den ansatte må være sykmeldt for at det skal være mulig å oppgi inn hvem
        som er nærmeste leder.
      </BodyShort>
    </GuidePanel>
  );
}
