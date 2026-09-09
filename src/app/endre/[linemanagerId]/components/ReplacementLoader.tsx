import InfoError from "@/app/(behov)/[behovId]/components/InfoError";
import { fetchLinemanagerReplacement } from "@/server/fetchData/fetchLinemanagerReplacement";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";
import { ReplacementUnavailable } from "./ReplacementUnavailable";
import { ViewControl } from "./ViewControl";

export async function ReplacementLoader({
  linemanagerId,
  returnTo,
  unavailable = false,
}: {
  linemanagerId?: string;
  returnTo?: string;
  unavailable?: boolean;
}) {
  if (unavailable || !linemanagerId) {
    return <ReplacementUnavailable />;
  }

  try {
    const initialData = await fetchLinemanagerReplacement(linemanagerId);
    if (!initialData) {
      return <ReplacementUnavailable />;
    }

    return <ViewControl initialData={initialData} returnTo={returnTo} />;
  } catch (error) {
    if (isFrontendError(error)) {
      return <InfoError detail={error.errorDetail} />;
    }
    throw error;
  }
}
