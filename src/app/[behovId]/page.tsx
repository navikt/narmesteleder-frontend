import { Suspense } from "react";
import { logger } from "@navikt/next-logger";
import notFound from "@/app/not-found";
import { LederInfoLoader } from "@/components/LederInfoLoader";
import { LederInfoSpinner } from "@/components/LederInfoSpinner";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { MockScenario } from "@/server/fetchData/fetchLederInfo";

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
    <Suspense fallback={<LederInfoSpinner />}>
      <LederInfoLoader behovId={behovId} mockScenario={mockScenario} />
    </Suspense>
  );
}
