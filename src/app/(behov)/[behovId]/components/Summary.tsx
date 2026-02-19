import { FormSummary, VStack } from "@navikt/ds-react";
import { useLederContextState } from "@/context/lederContextState";
import { formatFnr } from "@/utils/formatting";
import { TestId } from "@/utils/testIds";

export function Summary() {
  const { submittedData, handleEdit, lederInfo } = useLederContextState();

  return (
    <FormSummary data-testid={TestId.LederSummary}>
      <FormSummary.Header>
        <VStack gap="space-8">
          <p>Nærmeste leder for</p>
          <FormSummary.Heading level="3">
            {`${lederInfo.sykmeldt.fullnavn} (${formatFnr(lederInfo.sykmeldtFnr)})`}
          </FormSummary.Heading>
        </VStack>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            Fødselsnummer til nærmeste leder
          </FormSummary.Label>
          <FormSummary.Value>
            {formatFnr(submittedData.leder.fodselsnummer)}
          </FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>Etternavn</FormSummary.Label>
          <FormSummary.Value>{submittedData.leder.etternavn}</FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>E-post</FormSummary.Label>
          <FormSummary.Value>{submittedData.leder.epost}</FormSummary.Value>
        </FormSummary.Answer>
        <FormSummary.Answer>
          <FormSummary.Label>Mobilnummer</FormSummary.Label>
          <FormSummary.Value>
            {submittedData.leder.mobilnummer}
          </FormSummary.Value>
        </FormSummary.Answer>
      </FormSummary.Answers>
      <FormSummary.Footer>
        <FormSummary.EditLink onClick={handleEdit} className="cursor-pointer" />
      </FormSummary.Footer>
    </FormSummary>
  );
}
