import { Suspense } from "react";
import { logger } from "@navikt/next-logger";
import notFound from "@/app/not-found";
import LederInfoError from "@/components/LederInfoError";
import { LederInfoSpinner } from "@/components/LederInfoSpinner";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { LederInfo, fetchLederInfo } from "@/server/fetchData/fetchLederInfo";
import { isFrontendError } from "@/server/narmesteLederErrorUtils";
import { LederViewControl } from "../../components/LederViewControl";

const isValidBehovId = (behovId: string) =>
  !requirementIdSchema.safeParse(behovId).success;

const LederInfoContent = async ({ behovId }: { behovId: string }) => {
  let lederInfo: LederInfo | null = null;

  try {
    lederInfo = await fetchLederInfo(behovId);
  } catch (error) {
    if (isFrontendError(error)) {
      return <LederInfoError detail={error.errorDetail} />;
    } else {
      throw error;
    }
  }

  if (!lederInfo) {
    return notFound();
  }

  return <LederViewControl lederInfo={lederInfo} behovId={behovId} />;
};

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
      <LederInfoContent behovId={behovId} />
    </Suspense>
  );
}
