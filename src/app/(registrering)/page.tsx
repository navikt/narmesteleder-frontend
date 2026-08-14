import { ViewControl } from "@/app/(registrering)/components/ViewControl";
import { fetchOrganisasjoner } from "@/server/fetchData/fetchOrganisasjoner";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    orgnr?: string;
    returnTo?: string;
  }>;
}) {
  const { orgnr, returnTo } = await searchParams;
  const organisasjonerResult = await fetchOrganisasjoner();

  return (
    <ViewControl
      organisasjonerResult={organisasjonerResult}
      initialOrgnr={orgnr}
      returnTo={returnTo}
    />
  );
}
