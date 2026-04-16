"use client";

import { Theme } from "@navikt/ds-react/Theme";
import { configureLogger } from "@navikt/next-logger";
import type { PropsWithChildren } from "react";
import { publicEnv } from "@/env-variables/publicEnv";
import { VirksomhetProvider } from "@/shared/state/virksomhetContext";

configureLogger({
  basePath: publicEnv.NEXT_PUBLIC_BASE_PATH,
});

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Theme>
      <VirksomhetProvider>{children}</VirksomhetProvider>
    </Theme>
  );
}
