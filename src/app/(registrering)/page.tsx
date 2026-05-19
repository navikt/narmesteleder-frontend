import { ViewControl } from "@/app/(registrering)/components/ViewControl";
import { fetchOrganisasjoner } from "@/server/fetchData/fetchOrganisasjoner";

export default async function Home() {
  const organisasjonerResult = await fetchOrganisasjoner();

  return <ViewControl organisasjonerResult={organisasjonerResult} />;
}
