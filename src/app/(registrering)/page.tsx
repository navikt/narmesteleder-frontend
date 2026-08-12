import { ViewControl } from "@/app/(registrering)/components/ViewControl";
import { fetchOrganisasjoner } from "@/server/fetchData/fetchOrganisasjoner";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    orgnr?: string;
    editId?: string;
    returnTo?: string;
  }>;
}) {
  const { orgnr, editId, returnTo } = await searchParams;
  const organisasjonerResult = await fetchOrganisasjoner();

  return (
    <ViewControl
      organisasjonerResult={organisasjonerResult}
      initialOrgnr={orgnr}
      editId={editId}
      returnTo={returnTo}
    />
  );
}
