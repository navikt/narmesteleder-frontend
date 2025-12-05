import { Suspense } from "react";
import { logger } from "@navikt/next-logger";
import notFound from "@/app/not-found";
import ErrorAlert from "@/components/ErrorAlert";
import { LederInfoSpinner } from "@/components/LederInfoSpinner";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { LederInfo, fetchLederInfo } from "@/server/fetchData/fetchLederInfo";
import type { ErrorDetail } from "@/server/narmesteLederErrors";
import { LederViewControl } from "../../components/LederViewControl";

const isValidBehovId = (behovId: string) =>
  !requirementIdSchema.safeParse(behovId).success;

const LederInfoContent = async ({ behovId }: { behovId: string }) => {
  let lederInfo: LederInfo | null = null;
  let errorDetail: ErrorDetail | undefined;

  try {
    logger.info(`Fetching lederInfo for behovId=${behovId}`);
    lederInfo = await fetchLederInfo(behovId);
  } catch (error) {
    logger.error(`Error fetching lederInfo for behovId=${behovId}: ${error}`);
    // if (isFrontendError(error)) {
    //   logger.info(`FrontendError while fetching leder info for behovId=${behovId}: ${error.message}`);
    //   errorDetail = error.errorDetail;
    // } else {
    errorDetail = {
      title: "Noe gikk galt",
      message:
        "Det oppstod en uventet feil ved henting av informasjon om nærmeste leder. Vennligst prøv igjen senere.",
      // };
    };
    logger.error(
      `ErrorDetail for behovId=${behovId}: ${errorDetail.title} - ${errorDetail.message}`,
    );
  }

  logger.info("here i am");
  if (errorDetail) {
    logger.error(
      `Error fetching lederInfo for behovId=${behovId}: ${errorDetail.title} - ${errorDetail.message}`,
    );

    return <ErrorAlert detail={errorDetail} />;
  }

  if (!lederInfo) {
    logger.error(`No lederInfo found for behovId=${behovId}`);

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
