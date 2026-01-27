import "@navikt/ds-css";
import "@navikt/lumi-survey/styles.css";

import {
  type LumiSurveyConfig,
  LumiSurveyDock,
  type LumiSurveyTransport,
} from "@navikt/lumi-survey";

const transport: LumiSurveyTransport = {
  async submit(submission) {
    // TODO replace with server side action
    await fetch("/api/lumi/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(submission.transportPayload),
    });
  },
};

interface Props {
  feedbackId: string;
  survey: LumiSurveyConfig;
}

export const Lumi = ({ feedbackId, survey }: Props) => (
  <LumiSurveyDock surveyId={feedbackId} survey={survey} transport={transport} />
);
