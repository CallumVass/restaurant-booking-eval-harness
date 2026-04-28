# Slice 2: Frontend Scaffold, Tailwind + shadcn/ui, Orval Typed Client, TanStack Query Setup

**Estimated time:** ≈15 minutes

## Goal

Scaffold the React SPA with Vite + TypeScript, configure Tailwind CSS v4 and shadcn/ui components, generate a fully typed API client from the backend OpenAPI document using Orval, and set up TanStack Query.

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| B1 | `npm create vite@latest` scaffold with `react-ts` template exists in `frontend/` |
| B2 | Tailwind CSS v4 is configured with the `@tailwindcss/vite` plugin and works |
| B3 | shadcn/ui is initialized (`components.json`) and core components are available: `button`, `input`, `card`, `select`, `form`, `badge`, `table`, `skeleton`, `toast` (sonner) |
| B4 | `npm run gen:api` runs Orval against `http://localhost:5000/swagger/v1/swagger.json` and generates `frontend/src/api/booking-api.ts` with typed hooks |
| B5 | TanStack Query `QueryClientProvider` wraps the app in `main.tsx` |
| B6 | The frontend dev server starts without errors on `http://localhost:5173` |

## Required Tests

No automated tests in this slice — foundation is verified by the build/dev scripts running cleanly.

## Files to Create

```
frontend/
  package.json                            — scripts: dev, gen:api, build, typecheck, lint, format:check, deadcode
  tsconfig.json                           — strict TypeScript config
  vite.config.ts                          — Vite with react plugin, tailwind plugin, /api proxy to :5000
  orval.config.ts                         — Orval config pointing at backend swagger.json
  src/
    api/                                  — (empty, populated by gen:api)
      booking-api.ts                      — Orval-generated typed client
    lib/
      query-client.ts                     — TanStack Query client + QueryClientProvider wrapper
    main.tsx                              — App entry with QueryClientProvider
    App.tsx                               — Minimal shell (placeholder for Slice 3)
    index.css                             — Tailwind directives
  components/
    ui/                                   — shadcn/ui components (via npx shadcn add)
```

## Verification Commands

```bash
cd frontend && npm install && npm run gen:api && npm run dev
```

The `gen:api` script requires the backend to be running on port 5000 during generation. Document this dependency.

## Handoff Notes

- Orval uses `useQuery` / `useMutation` from `@tanstack/react-query` by default — the generated hooks are TanStack Query hooks.
- The Vite dev server must proxy `/api` requests to the backend at `http://localhost:5000`.
- `npm run gen:api` must run before `npm run build` and is part of the CI/verify pipeline.
- shadcn/ui components are installed into `frontend/src/components/ui/` via `npx shadcn@latest add`.
- Tailwind v4 uses CSS-based config via `@import "tailwindcss"` in the CSS file, not a `tailwind.config.js` file.

## Non-Goals

- Building any page components (Slice 3)
- Setting up routers (Slice 3)
- Final script verification (Slice 4)
- README (Slice 4)
