import { logger } from "@navikt/next-logger";
import notFound from "@/app/not-found";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { fetchLederInfo } from "@/server/fetchData/fetchLederInfo";
import { LederOnlyFlowControl } from "../../components/LederOnlyFlowControl";

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
  const lederInfo = await fetchLederInfo(behovId);

  return <LederOnlyFlowControl lederInfo={lederInfo} behovId={behovId} />;
}
