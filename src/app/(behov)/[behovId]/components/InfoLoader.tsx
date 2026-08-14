import notFound from "@/app/not-found";
import {
  fetchLederInfo,
  type MockScenario,
} from "@/server/fetchData/fetchLederInfo";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";
import InfoError from "./InfoError";
import { ViewControl } from "./ViewControl";

interface InfoLoaderProps {
  behovId: string;
  mockScenario?: MockScenario;
  returnTo?: string;
}

export const InfoLoader = async ({
  behovId,
  mockScenario,
  returnTo,
}: InfoLoaderProps) =>
  fetchLederInfo(behovId, mockScenario)
    .then((lederInfo) => {
      if (!lederInfo) {
        return notFound();
      }
      return (
        <ViewControl
          lederInfo={lederInfo}
          behovId={behovId}
          returnTo={returnTo}
        />
      );
    })
    .catch((error) => {
      if (isFrontendError(error)) {
        return <InfoError detail={error.errorDetail} />;
      }
      throw error;
    });
