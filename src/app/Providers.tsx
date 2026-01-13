"use client";

import { PropsWithChildren } from "react";
import { Theme } from "@navikt/ds-react/Theme";
import { configureLogger } from "@navikt/next-logger";
import { publicEnv } from "@/env-variables/publicEnv";

configureLogger({
  basePath: publicEnv.NEXT_PUBLIC_BASE_PATH,
});

export default function Providers({ children }: PropsWithChildren) {
  return <Theme>{children}</Theme>;
}
