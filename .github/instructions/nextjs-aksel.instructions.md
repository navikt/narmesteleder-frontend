---
applyTo: "src/**/*.{tsx,ts}"
---

# Next.js and Aksel conventions

`src/app/` uses App Router with flow-local components under `(registrering)`,
`(behov)` and `(oversikt)`. Keep shared validation in `src/schemas/`, environment
access in `src/env-variables/` and backend authentication/data access in
`src/server/`. Follow these real helpers instead of invented `@/lib` imports.

- Use Aksel components and `space-*` tokens for spacing. Do not introduce
  Tailwind padding/margin utilities or unqualified numeric spacing values.
- Preserve responsive behavior and accessible heading, label and focus
  semantics. Consult the installed Aksel version before choosing tokens/props.
- Format numbers with an explicit Norwegian locale through existing helpers.
- Keep server components as the default and add client boundaries for actual
  state or interaction. Use existing server actions and `tokenXFetch` helpers
  for backend calls; preserve input/response validation and error handling.
- Use the existing Vitest and Playwright setups. Keep E2E selectors in
  `src/utils/uiSelectors.ts`; cover changed user behavior and failure states.
- Resolve changes to authentication, data aggregation, custom Tailwind usage
  or departures from Aksel patterns before implementation.
- Preserve the repository's convention of adding code comments only when
  explicitly requested.
