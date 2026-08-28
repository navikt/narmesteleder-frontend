import {
  LumiSurveyDock,
  type LumiSurveyTransport,
  type SurveyDocumentV1,
} from "@navikt/lumi-survey";
import { opprettSurveyFeedback } from "@/server/actions/opprettSurveyFeedback";

const transport: LumiSurveyTransport = {
  async submit(submission) {
    await opprettSurveyFeedback(submission.transportPayload);
  },
};

interface Props {
  feedbackId: string;
  survey: SurveyDocumentV1;
}

export const Lumi = ({ feedbackId, survey }: Props) => (
  <LumiSurveyDock surveyId={feedbackId} survey={survey} transport={transport} />
);
