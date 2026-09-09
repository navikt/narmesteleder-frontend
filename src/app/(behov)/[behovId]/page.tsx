import { defineEvent } from "@navikt/esyfo-logger";
import { Suspense } from "react";
import { z } from "zod";
import { InfoLoader } from "@/app/(behov)/[behovId]/components/InfoLoader";
import notFound from "@/app/not-found";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import type { MockScenario } from "@/server/fetchData/fetchLederInfo";
import { log } from "@/server/observability/logger";
import { InfoSpinner } from "@/shared/components/InfoSpinner";

const invalidBehovId = defineEvent<{
  error_code: "INVALID_INPUT";
  validationIssues: string;
}>({
  name: "behov_route_invalid_parameter",
  operation: "vis_behov",
  level: "warn",
  message: "[Route] invalid behovId parameter in URL",
});

const isValidBehovId = (behovId: string) => {
  const parseResult = requirementIdSchema.safeParse(behovId);
  if (parseResult.success) {
    return true;
  }

  log.event(invalidBehovId, {
    error_code: "INVALID_INPUT",
    validationIssues: z.prettifyError(parseResult.error),
  });

  return false;
};

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ behovId: string }>;
  searchParams: Promise<{ mockScenario?: MockScenario; returnTo?: string }>;
}) {
  const { behovId } = await params;
  const { mockScenario, returnTo } = await searchParams;

  if (!isValidBehovId(behovId)) {
    return notFound();
  }

  return (
    <Suspense fallback={<InfoSpinner />}>
      <InfoLoader
        behovId={behovId}
        mockScenario={mockScenario}
        returnTo={returnTo}
      />
    </Suspense>
  );
}
