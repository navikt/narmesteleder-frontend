import type { Organisasjon } from "@navikt/virksomhetsvelger";
import { fetchOrganisasjoner } from "@/server/fetchData/fetchOrganisasjoner";
import { fetchRequirementsList } from "@/server/fetchData/fetchRequirementsList";
import { OversiktViewControl } from "./OversiktViewControl/OversiktViewControl";

interface OversiktLoaderProps {
  orgnr?: string;
}

function getFirstLeafOrgnr(organisasjoner: Organisasjon[]): string {
  const [first] = organisasjoner;
  if (!first) return "";
  if (first.underenheter.length === 0) return first.orgnr;
  return getFirstLeafOrgnr(first.underenheter);
}

function isOrgnrInTree(orgnr: string, organisasjoner: Organisasjon[]): boolean {
  for (const org of organisasjoner) {
    if (org.orgnr === orgnr) return true;
    if (isOrgnrInTree(orgnr, org.underenheter)) return true;
  }
  return false;
}

export async function OversiktLoader({ orgnr }: OversiktLoaderProps) {
  const organisasjonerResult = await fetchOrganisasjoner();

  const validatedOrgnr =
    orgnr && isOrgnrInTree(orgnr, organisasjonerResult.organisasjoner)
      ? orgnr
      : undefined;

  const selectedOrgnr =
    validatedOrgnr ?? getFirstLeafOrgnr(organisasjonerResult.organisasjoner);

  const requirementsResult = await fetchRequirementsList(selectedOrgnr);

  return (
    <OversiktViewControl
      organisasjonerResult={organisasjonerResult}
      requirementsResult={requirementsResult}
      selectedOrgnr={selectedOrgnr}
    />
  );
}
