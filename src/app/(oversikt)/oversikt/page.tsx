import { Suspense } from "react";
import { OversiktLoader } from "@/app/(oversikt)/components/OversiktLoader";
import { OversiktSpinner } from "@/app/(oversikt)/components/OversiktSpinner";

export const dynamic = "force-dynamic";

export default async function OversiktPage({
  searchParams,
}: {
  searchParams: Promise<{ orgnr?: string }>;
}) {
  const { orgnr } = await searchParams;

  return (
    <Suspense fallback={<OversiktSpinner />}>
      <OversiktLoader orgnr={orgnr} />
    </Suspense>
  );
}
