import "server-only";
import { createLogger } from "@navikt/esyfo-logger";
import { logger } from "@navikt/next-logger";

export const log = createLogger(logger);
