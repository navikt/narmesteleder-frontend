import notFound from "@/app/not-found";
import { fetchLinemanagerReplacement } from "@/server/fetchData/fetchLinemanagerReplacement";
import { fetchOrganisasjoner } from "@/server/fetchData/fetchOrganisasjoner";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";
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
    return notFound();
  }

  try {
    const [initialData, organisasjonerResult] = await Promise.all([
      fetchLinemanagerReplacement(linemanagerId, undefined, returnTo),
      fetchOrganisasjoner(),
    ]);

    if (!initialData) {
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
