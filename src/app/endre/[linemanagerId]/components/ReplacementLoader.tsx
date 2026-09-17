import notFound from "@/app/not-found";
import { fetchLinemanagerReplacement } from "@/server/fetchData/fetchLinemanagerReplacement";
import { fetchOrganisasjoner } from "@/server/fetchData/fetchOrganisasjoner";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";
import { log } from "@/server/observability/logger";
import { LederInfoError } from "@/shared/components/LederInfoError";
import { findOrganisasjonNavn } from "@/utils/findOrganisasjonNavn";
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
    log.info("No linemanager id or unavailable");
    return notFound();
  }

  try {
    const [initialData, organisasjonerResult] = await Promise.all([
      fetchLinemanagerReplacement(linemanagerId, undefined, returnTo),
      fetchOrganisasjoner(),
    ]);

    if (!initialData) {
      log.info("No initial data");
      return notFound();
    }

    const orgnavn = findOrganisasjonNavn(
      initialData.sykmeldt.orgnummer,
      organisasjonerResult.organisasjoner,
    );

    return (
      <ViewControl
        initialData={initialData}
        initialOrgnavn={orgnavn}
        returnTo={returnTo}
      />
    );
  } catch (error) {
    if (isFrontendError(error)) {
      return <LederInfoError detail={error.errorDetail} />;
    }
    throw error;
  }
}
