import "@navikt/ds-css";
import "@navikt/lumi-survey/styles.css";

import {
  type LumiSurveyConfig,
  LumiSurveyDock,
  type LumiSurveyTransport,
} from "@navikt/lumi-survey";
import { opprettSurveyFeedback } from "@/server/actions/opprettSurveyFeedback";

const transport: LumiSurveyTransport = {
  async submit(submission) {
    await opprettSurveyFeedback(submission.transportPayload);
  },
};

interface Props {
  feedbackId: string;
  survey: LumiSurveyConfig;
}

export const Lumi = ({ feedbackId, survey }: Props) => (
  <LumiSurveyDock surveyId={feedbackId} survey={survey} transport={transport} />
);
