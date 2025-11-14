import { logger } from "@navikt/next-logger";
import { isLocalOrDemo } from "./env-variables/envHelpers";

// doc: https://nextjs.org/docs/app/guides/instrumentation#importing-runtime-specific-code
const isLocalNodeRuntime = () =>
  isLocalOrDemo && process.env.NEXT_RUNTIME === "nodejs";

const startMswRuntime = async () => {
  if (!isLocalNodeRuntime()) return;
  const { server } = await import("./mocks/node");
  server.listen({ onUnhandledRequest: "bypass" });
  logger.info("MSW server started for local/demo environment");
};

export const register = async () => {
  await startMswRuntime();
};
