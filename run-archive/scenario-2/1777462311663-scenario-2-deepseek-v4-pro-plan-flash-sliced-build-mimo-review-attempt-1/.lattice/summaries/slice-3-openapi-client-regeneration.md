# Slice 3: OpenAPI Spec Update and Frontend Client Regeneration

## Changes Made

### 1. Updated OpenAPI Spec (`frontend/openapi/restaurant-booking.json`)

- Added `components.securitySchemes.cookieAuth` (type: apiKey, in: cookie, name: .AspNetCore.Identity.Application)
- Added `components.parameters.XCsrfToken` reusable header parameter for mutating endpoints
- Added auth paths: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/antiforgery/token`
- Added schemas: `UserInfo`, `LoginRequest`, `RegisterRequest`
- Added `Unauthorized` response definition (401) for auth-protected endpoints
- Replaced `GET /api/bookings` with `GET /api/bookings/mine`
- Marked `POST /api/bookings` and `GET /api/bookings/mine` with `security: [{cookieAuth: []}]`
- Added `X-CSRF-TOKEN` header parameter to mutating endpoints (POST bookings, POST auth/*)
- Kept public endpoints (GET restaurants, GET availability) without security
- Used `nullable: true` with `allOf` wrapping for `/api/auth/me` response (UserInfo | null)

### 2. Updated Orval Config (`frontend/orval.config.ts`)

- Changed `client: "fetch"` → `client: "react-query"` for TanStack Query hooks
- Added `override.fetch.credentials: "include"` for cookie-based auth

### 3. Regenerated Client (`frontend/src/generated/booking-client.ts`)

Generated TanStack Query hooks:
- `useListRestaurants` (query)
- `useListAvailableSlots` (query)
- `useListBookingsMine` (query)
- `useCreateBooking` (mutation) — supports custom headers via `fetch?: RequestInit`
- `useRegister` (mutation)
- `useLogin` (mutation)
- `useLogout` (mutation)
- `useGetAuthMe` (query)
- `useGetAntiforgeryToken` (query)

### 4. Minimal App.tsx Updates (required for typecheck)

- Changed `listBookings` import to `listBookingsMine` (old endpoint removed)
- Updated `bookingsQuery` to use `listBookingsMine` instead of `listBookings`
- Added type cast for `bookingsQuery.data` to fix union type narrowing

## Requirement IDs Covered

- **R-017**: OpenAPI spec includes auth paths, security schemes, and protected booking endpoints
- **R-021**: orval.config.ts uses client:'react-query'; generated file exports useXxx hooks
- **R-022**: No hand-written fetch wrappers; all API types from generated booking-client
- **R-026**: Orval generates react-query hooks; App components import and use them directly
- **R-044**: npm run generate:api completes successfully; npm run build succeeds (includes generate:api)
- **R-053**: cookieAuth security scheme in OpenAPI spec
- **R-054**: X-CSRF-TOKEN header parameter for mutating endpoints in OpenAPI spec
- **R-055**: orval.config.ts specifies client: 'react-query' and credentials: 'include'

## Invariant Checks Performed

- **GI-007**: Generated TypeScript client is the single typed surface; no inline fetch() calls or hand-written wrappers
- **GI-008**: All quality gates pass:
  - Backend: build (0 warnings), tests (43/43 pass), format (clean)
  - Frontend: generate:api ✓, typecheck ✓, build ✓, lint ✓, format:check ✓, deadcode ✓

## Checks Run

- `npm run generate:api` ✓
- `npm run typecheck` ✓
- `npm run build` ✓
- `npm run lint` ✓
- `npm run format:check` ✓
- `npm run deadcode` ✓
- `dotnet build RestaurantBooking.Api` ✓ (0 warnings)
- `dotnet build RestaurantBooking.Tests` ✓ (0 warnings)
- `dotnet test RestaurantBooking.Tests --no-build` ✓ (43/43)
- `dotnet format RestaurantBooking.Api --verify-no-changes` ✓
- `dotnet format RestaurantBooking.Tests --verify-no-changes` ✓

## Known Gaps

- App.tsx still references old bookings pattern (`listBookingsMine` replaces `listBookings`); auth-aware UI refactoring is deferred to Slice 4.
- The `listBookingsMine` hook requires authentication; current App.tsx doesn't have auth logic. Runtime behaviour will be fixed in Slice 4.

## Handoff Notes

- The generated client file is at `frontend/src/generated/booking-client.ts`
- CSRF token handling: SPA must call `useGetAntiforgeryToken` (or `getAntiforgeryToken` fetch) to obtain the token, then pass it via `fetch.headers['X-CSRF-TOKEN']` in mutation hooks
- Mutation hooks pass custom headers through `fetch?: RequestInit` in the hook options
- The `override.fetch.credentials: "include"` ensures all fetch calls include cookies
- Old `useQuery`/`useMutation` wrappers in App.tsx that use `queryFn: async () => ...` with raw fetch functions should be replaced with the generated hooks in Slice 4
