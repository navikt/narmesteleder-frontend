# Nærmeste leder frontend

➡️ For å komme i gang med bygg og utvikling, les vår [dokumentasjon for Next.js-apper](https://github.com/navikt/syfodok/tree/master/eSYFO/content/technology-stack/next-js).

## Appens formål

Formålet med appen er å registrere nærmeste leder for en sykmeldt person. Appen tilbyr to innganger (paths).

## Helt tomt skjema for nærmeste leder

Brukeren må fylle ut både den sykmeldte personen og nærmeste leder.
Base path: `/arbeidsgiver/ansatte/narmesteleder`.

## Forhåndsutfylt sykmeldt-panel med skjema for nærmeste leder

Brukeren får opp en spesifikk sykmeldt person som mangler nærmeste leder, sammen med skjema for å registrere eller oppdatere nærmeste leder.
Base path: `/arbeidsgiver/ansatte/narmesteleder/{behovid}`.

## Backend-API

Frontend-appen kommuniserer med [Nærmeste leder backend](https://github.com/navikt/esyfo-narmesteleder).
