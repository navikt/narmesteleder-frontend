import type { Metadata } from "next";
import Script from "next/script";
import { Page, PageBlock } from "@navikt/ds-react/Page";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Providers from "@/app/Providers";
import "@/app/globals.css";
import { publicEnv } from "@/env-variables/publicEnv";

export const metadata: Metadata = {
  title: "Oppgi nærmeste leder",
  description: "En tjeneste for å oppgi hvem som er din nærmeste leder",
};

const getDecoratorEnv = (): "dev" | "prod" => {
  switch (publicEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT) {
    case "local":
    case "test":
    case "dev":
      return "dev";
    default:
      return "prod";
  }
};

const breadcrumbs = [
  {
    title: "Min side arbeidsgiver",
    url: publicEnv.NEXT_PUBLIC_MIN_SIDE_ARBEIDSGIVER_URL,
  },
  {
    title: "Oppgi nærmeste leder",
    analyticsTitle: "Oppgi nærmeste leder",
    url: "https://www.nav.no/arbeidsgiver/ansatte/narmesteleder",
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Decorator = await fetchDecoratorReact({
    env: getDecoratorEnv(),
    params: {
      breadcrumbs: breadcrumbs,
      language: "nb",
      context: "arbeidsgiver",
      logoutWarning: true,
      redirectToApp: true,
    },
  });

  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
        <title>Oppgi nærmeste leder</title>
      </head>
      <body>
        <Providers>
          <Page footer={<Decorator.Footer />}>
            <Decorator.Header />
            <PageBlock as="main" width="lg" className="max-w-3xl" gutters>
              {children}
            </PageBlock>
            <Decorator.Scripts loader={Script} />
          </Page>
        </Providers>
      </body>
    </html>
  );
}
