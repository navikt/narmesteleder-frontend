import { logger } from "@navikt/next-logger";
import { Suspense } from "react";
import { InfoLoader } from "@/app/(behov)/[behovId]/components/InfoLoader";
import { InfoSpinner } from "@/app/(behov)/[behovId]/components/InfoSpinner";
import notFound from "@/app/not-found";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import type { MockScenario } from "@/server/fetchData/fetchLederInfo";

const isValidBehovId = (behovId: string) =>
  !requirementIdSchema.safeParse(behovId).success;

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ behovId: string }>;
  // Only used in dev and demo environments
  searchParams: Promise<{ mockScenario?: MockScenario }>;
}) {
  const { behovId } = await params;
  const { mockScenario } = await searchParams;

  if (isValidBehovId(behovId)) {
    logger.warn(`Invalid behovId format: ${behovId}`);
    return notFound();
  }

  return (
    <Suspense fallback={<InfoSpinner />}>
      <InfoLoader behovId={behovId} mockScenario={mockScenario} />
    </Suspense>
  );
}
