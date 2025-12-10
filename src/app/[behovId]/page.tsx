import { Suspense } from "react";
import { logger } from "@navikt/next-logger";
import notFound from "@/app/not-found";
import { LederInfoLoader } from "@/components/LederInfoLoader";
import { LederInfoSpinner } from "@/components/LederInfoSpinner";
import { requirementIdSchema } from "@/schemas/requirementSchema";

const isValidBehovId = (behovId: string) =>
  !requirementIdSchema.safeParse(behovId).success;

export default async function Home({
  params,
}: {
  params: Promise<{ behovId: string }>;
}) {
  const { behovId } = await params;
  if (isValidBehovId(behovId)) {
    logger.warn(`Invalid behovId format: ${behovId}`);
    return notFound();
  }

  return (
    <Suspense fallback={<LederInfoSpinner />}>
      <LederInfoLoader behovId={behovId} />
    </Suspense>
  );
}
