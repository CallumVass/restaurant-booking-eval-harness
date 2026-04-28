# Slice 2 Summary: Frontend Scaffold, Tailwind + shadcn/ui, Orval Typed Client, TanStack Query Setup

## Changes Made

### Files Created/Modified

| File | Purpose |
|------|---------|
| `frontend/package.json` | Scripts: dev, gen:api, build, typecheck, lint, format:check, deadcode |
| `frontend/vite.config.ts` | Vite with react + tailwind plugins, `/api` proxy to `:5000`, `@/` alias |
| `frontend/orval.config.ts` | Orval config pointing at `http://localhost:5000/swagger/v1/swagger.json` |
| `frontend/tsconfig.json` | Root config with `@/*` path alias |
| `frontend/tsconfig.app.json` | Strict TS config with path alias |
| `frontend/.prettierrc` | Prettier config (no semi, single quotes, trailing commas) |
| `frontend/eslint.config.js` | ESLint with react-hooks, react-refresh, TS, max-warnings 0 |
| `frontend/components.json` | shadcn/ui configuration (base-nova style, lucide icons) |
| `frontend/src/main.tsx` | App entry with `QueryClientProvider` + sonner `Toaster` |
| `frontend/src/App.tsx` | Minimal shell with header (placeholder for Slice 3) |
| `frontend/src/index.css` | Tailwind v4 imports, CSS variables, base styles |
| `frontend/src/lib/utils.ts` | `cn()` utility (from shadcn) |
| `frontend/src/lib/query-client.ts` | Shared `QueryClient` with staleTime/retry config |
| `frontend/src/api/mutator.ts` | Custom fetch wrapper for Orval |
| `frontend/src/api/booking-api.ts` | **Orval-generated typed client** with TanStack Query hooks |
| `frontend/src/components/ui/` | shadcn/ui: button, input, card, select, badge, table, skeleton, field, label, separator |

### Backend Changes

| File | Purpose |
|------|---------|
| `backend/Api/openapi.json` | **Static full OpenAPI 3.1 spec** with all response schemas (Restaurant, Table, Booking, CreateBookingRequest, ApiError) |
| `backend/Api/Program.cs` | Serve static openapi.json at `/swagger/v1/swagger.json`, removed auto-generated OpenAPI |
| `backend/backend.csproj` | Build target to copy openapi.json to output directory |

### Dev Notes

**OpenAPI approach:** The .NET 10 built-in `MapOpenApi()` generated a minimal spec without response schemas (only `CreateBookingRequest` had a schema). Orval needs full schemas for proper type generation. Solution: wrote a complete static `openapi.json` with all request/response types. Swagger UI and Orval both consume this.

**shadcn/ui form:** The new `base-nova` style uses `FieldGroup` + `Field` + `FieldLabel` instead of the old radix-based `Form` component. `field.tsx`, `label.tsx`, and `react-hook-form` provide the form foundation.

## Verification Results

| Command | Result |
|---------|--------|
| `npm run typecheck` | ✅ Pass (0 errors) |
| `npm run build` | ✅ Pass (gen:api + tsc + vite build) |
| `npm run lint` | ✅ Pass (0 warnings, 0 errors) |
| `npm run format:check` | ✅ Pass (all matched files use Prettier) |
| `npm run deadcode` | ✅ Pass (no-exit-code mode, expected unused files at this stage) |
| Dev server on `:5173` | ✅ Starts and responds 200 |
| Backend `dotnet build` | ✅ 0 warnings, 0 errors |
| Backend `dotnet test` | ✅ 10/10 passed |
| Backend `dotnet format --verify-no-changes` | ✅ Clean |

## Generated Client API

The Orval client (`src/api/booking-api.ts`) provides:

- **Hooks:** `useGetRestaurants`, `useGetRestaurant`, `useGetRestaurantTables`, `useGetAvailableSlots`, `useGetRestaurantBookings`, `useCreateBooking`
- **Types:** `Restaurant`, `Table`, `Booking`, `CreateBookingRequest`, `ApiError`, `GetAvailableSlotsParams`, `GetRestaurantBookingsParams`
- The custom mutator uses `fetch()` with proper error handling for non-OK responses

## Handoff Notes

- Backend must be running on `:5000` for `gen:api` (documented in README for Slice 4)
- Vite proxies `/api/*` to `http://localhost:5000` — Orval-generated client uses `/api` base URL
- `npm run build` includes `npm run gen:api` as its first step
- All shadcn components and types are ready for Slice 3 pages
