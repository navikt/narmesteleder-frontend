import { z } from "zod";
import { throwEnvSchemaParsingError } from "@/env-variables/envHelpers";
import {
  type PublicEnv,
  publicEnvSchema,
  rawPublicEnv,
} from "@/env-variables/publicEnv";

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({
  // Provided by nais-*.yaml
  NARMESTELEDER_BACKEND_HOST: z.string(),
  NARMESTELEDER_BACKEND_CLIENT_ID: z.string(),
  // Provided by nais
  TOKEN_X_WELL_KNOWN_URL: z.string(),
  TOKEN_X_CLIENT_ID: z.string(),
  TOKEN_X_PRIVATE_JWK: z.string(),
  IDPORTEN_WELL_KNOWN_URL: z.string(),
  IDPORTEN_CLIENT_ID: z.string(),
  NAIS_CLUSTER_NAME: z.string(),
});

const rawServerEnv = {
  // Provided by nais-*.yml
  NARMESTELEDER_BACKEND_HOST: process.env.NARMESTELEDER_BACKEND_HOST,
  NARMESTELEDER_BACKEND_CLIENT_ID: process.env.NARMESTELEDER_BACKEND_CLIENT_ID,

  // Provided by nais
  TOKEN_X_WELL_KNOWN_URL: process.env.TOKEN_X_WELL_KNOWN_URL,
  TOKEN_X_CLIENT_ID: process.env.TOKEN_X_CLIENT_ID,
  TOKEN_X_PRIVATE_JWK: process.env.TOKEN_X_PRIVATE_JWK,
  IDPORTEN_WELL_KNOWN_URL: process.env.IDPORTEN_WELL_KNOWN_URL,
  IDPORTEN_CLIENT_ID: process.env.IDPORTEN_CLIENT_ID,
  NAIS_CLUSTER_NAME: process.env.NAIS_CLUSTER_NAME,
} satisfies Record<keyof ServerEnv, string | undefined>;

let cachedServerEnv: Readonly<ServerEnv & PublicEnv> | undefined;

export function getServerEnv(): Readonly<ServerEnv & PublicEnv> {
  if (!cachedServerEnv) {
    try {
      cachedServerEnv = Object.freeze({
        ...serverEnvSchema.parse(rawServerEnv),
        ...publicEnvSchema.parse(rawPublicEnv),
      });
    } catch (e) {
      throwEnvSchemaParsingError(e);
    }
  }
  return cachedServerEnv;
}
