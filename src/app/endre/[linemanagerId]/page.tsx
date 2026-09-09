import { Suspense } from "react";
import { requirementIdSchema } from "@/schemas/requirementSchema";
import { InfoSpinner } from "@/shared/components/InfoSpinner";
import { ReplacementLoader } from "./components/ReplacementLoader";

const linemanagerIdSchema = requirementIdSchema;

export const dynamic = "force-dynamic";

export default async function ReplacementPage({
  params,
  searchParams,
}: {
  params: Promise<{ linemanagerId: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { linemanagerId } = await params;
  const { returnTo } = await searchParams;

  if (!linemanagerIdSchema.safeParse(linemanagerId).success) {
    return <ReplacementLoader unavailable />;
  }

  return (
    <Suspense fallback={<InfoSpinner />}>
      <ReplacementLoader linemanagerId={linemanagerId} returnTo={returnTo} />
    </Suspense>
  );
}
