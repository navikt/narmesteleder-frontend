import notFound from "@/app/not-found";
import {
  fetchLederInfo,
  type MockScenario,
} from "@/server/fetchData/fetchLederInfo";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";
import LederInfoError from "./LederInfoError";
import { LederViewControl } from "./LederViewControl";

interface LederInfoLoaderProps {
  behovId: string;
  mockScenario?: MockScenario;
}

export const LederInfoLoader = async ({
  behovId,
  mockScenario,
}: LederInfoLoaderProps) =>
  fetchLederInfo(behovId, mockScenario)
    .then((lederInfo) => {
      if (!lederInfo) {
        return notFound();
      }
      return <LederViewControl lederInfo={lederInfo} behovId={behovId} />;
    })
    .catch((error) => {
      if (isFrontendError(error)) {
        return <LederInfoError detail={error.errorDetail} />;
      }
      throw error;
    });
