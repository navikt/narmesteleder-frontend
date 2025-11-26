# Nærmesteleder frontend app

[![Build Status](https://github.com/navikt/narmesteleder-frontend/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/navikt/narmesteleder-frontend/actions/workflows/build-and-deploy.yaml)

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

**Important:** To get started with building and running the app, read our [wiki for Next.js apps](https://github.com/navikt/esyfo-dev-tools/wiki/nextjs-build-run).

## Purpose of the app

This app is used to register a **nærmesteleder** for a person on sick leave. It offers two main functions.

```mermaid
graph TD
    Dialogporten[Dialogporten] -->|"/arbeidsgiver/ansatte/narmesteleder/{behovid}"| App[Nærmeste leder frontend]
    MinSide[Min side - arbeidsgiver] -->|"/arbeidsgiver/ansatte/narmesteleder"| App
```

### Registration via empty form

The entry point to the empty form is the app `Min side - arbeidsgiver`. The user fills out information about both the person on sick leave and the **nærmesteleder**.

**Base path** `/arbeidsgiver/ansatte/narmesteleder`

### Registration via pre-filled form

The entry point to the pre-filled form is the platform `Dialogporten`. The user is presented with a specific person on sick leave who is missing a **nærmesteleder**, and can register or update the **nærmesteleder**.

**Base path** `/arbeidsgiver/ansatte/narmesteleder/{behovid}`

## Backend API

The frontend app communicates with [Nærmesteleder backend](https://github.com/navikt/esyfo-narmesteleder).

Used endpoints

- **GET** `/api/v1/linemanager/requirement/{id}`
- **POST** `/api/v1/linemanager`
- **PUT** `/api/v1/linemanager/requirement/{id}`
