import notFound from "@/app/not-found";
import { fetchLinemanagerReplacement } from "@/server/fetchData/fetchLinemanagerReplacement";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";
import { LederInfoError } from "@/shared/components/LederInfoError";
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
    return notFound();
  }

  try {
    const initialData = await fetchLinemanagerReplacement(
      linemanagerId,
      undefined,
      returnTo,
    );
    if (!initialData) {
      return notFound();
    }

    return <ViewControl initialData={initialData} returnTo={returnTo} />;
  } catch (error) {
    if (isFrontendError(error)) {
      return <LederInfoError detail={error.errorDetail} />;
    }
    throw error;
  }
}
