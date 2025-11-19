# Nærmeste leder frontend

[![Build Status](https://github.com/navikt/narmesteleder-frontend/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/navikt/narmesteleder-frontend/actions/workflows/build-and-deploy.yaml)

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

**Viktig:** For å komme i gang med bygg og utvikling, les vår [dokumentasjon for Next.js-apper](https://github.com/navikt/syfodok/tree/master/eSYFO/content/technology-stack/next-js).

## Appens formål

Denne appen brukes til å registrere nærmeste leder for en sykmeldt person. Den tilbyr to hovedfunksjoner.

### Registrering via tomt skjema

Brukeren fyller ut informasjon om både den sykmeldte personen og nærmeste leder.

**Base path** `/arbeidsgiver/ansatte/narmesteleder`

### Registrering via forhåndsutfylt skjema

Brukeren får opp en spesifikk sykmeldt person som mangler nærmeste leder, og kan registrere eller oppdatere nærmeste leder.

**Base path** `/arbeidsgiver/ansatte/narmesteleder/{behovid}`

## Backend-API

Frontend-appen kommuniserer med [Nærmeste leder backend](https://github.com/navikt/esyfo-narmesteleder).

Du finner API-dokumentasjon i [Swagger dev miljø](https://esyfo-narmesteleder.ekstern.dev.nav.no/swagger)

### Brukte endepunkter

- **GET** `/api/v1/linemanager/requirement/{id}`
- **POST** `/api/v1/linemanager`
- **PUT** `/api/v1/linemanager/requirement/{id}`
