import { FormSummary, Heading, VStack } from "@navikt/ds-react";
import { LederOnly } from "@/schemas/nærmestelederFormSchema";
import { LederInfo } from "@/server/fetchData/fetchLederInfo";

type LederOnlySummaryProps = {
  lederFormData: LederOnly;
  lederInfo: LederInfo;
  onEdit: () => void;
};

export function LederOnlySummary({
  lederFormData,
  lederInfo,
  onEdit,
}: LederOnlySummaryProps) {
  return (
    <FormSummary>
      <FormSummary.Header>
        <VStack gap="2">
          <FormSummary.Heading level="3">
            Nærmeste leder for
          </FormSummary.Heading>
          <Heading level="6" size="small">
            {`${lederInfo.sykmeldt.fullnavn} (fødselsnummer ${lederInfo.sykmeldtFnr})`}
          </Heading>
        </VStack>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            Fødselsnummer til nærmeste leder
          </FormSummary.Label>
          <FormSummary.Value>
            {lederFormData.leder.fodselsnummer}
          </FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>Epost</FormSummary.Label>
          <FormSummary.Value>{lederFormData.leder.epost}</FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>Mobilnummer</FormSummary.Label>
          <FormSummary.Value>
            {lederFormData.leder.mobilnummer}
          </FormSummary.Value>
        </FormSummary.Answer>
      </FormSummary.Answers>
      <FormSummary.Footer>
        <FormSummary.EditLink onClick={onEdit} />
      </FormSummary.Footer>
    </FormSummary>
  );
}
