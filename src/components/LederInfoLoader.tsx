import notFound from "@/app/not-found";
import LederInfoError from "@/components/LederInfoError";
import { LederViewControl } from "@/components/LederViewControl";
import { fetchLederInfo } from "@/server/fetchData/fetchLederInfo";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";

interface LederInfoLoaderProps {
  behovId: string;
}

export const LederInfoLoader = async ({ behovId }: LederInfoLoaderProps) =>
  fetchLederInfo(behovId)
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
