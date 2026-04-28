# Slice 2: OpenAPI Spec Update & Client Regeneration

## Goal

Update the checked-in OpenAPI spec with auth endpoints and security definitions, switch the Orval client generation from `client: "fetch"` to `client: "react-query"`, and regenerate the typed frontend client so it produces TanStack Query hooks.

## Global Invariants

All invariants from `manifest.json` apply. Key invariants for this slice:
- Preserve existing Orval-generated typed client workflow (deterministic, reproducible from `frontend/openapi/restaurant-booking.json`)
- OpenAPI/client generation reproducible: `npm run generate:api` succeeds
- Frontend quality scripts pass: build, typecheck, lint, format:check, deadcode
- Preserve existing behavior: all existing endpoint types and response types remain in the generated client
- No external services or secrets

## Acceptance Criteria

1. `frontend/openapi/restaurant-booking.json` includes:
   - Auth paths: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/csrf`
   - `GET /api/bookings/mine` path
   - Security scheme: `cookieAuth` (type: apiKey, in: cookie, name: `.RestaurantBooking.Auth`)
   - Security requirement on `POST /api/bookings` and `GET /api/bookings/mine`
   - 401 responses on protected endpoints
   - Schemas: `LoginRequest`, `RegisterRequest`, `UserResponse`
2. `orval.config.ts` updated to produce TanStack Query hooks (`client: "react-query"`) with a custom fetch mutator that sends `credentials: "include"`
3. `npm run generate:api` succeeds and regenerates `src/generated/booking-client.ts`
4. Generated client exports typed hooks: `useListRestaurants`, `useListBookings`, `useListAvailableSlots`, `useCreateBooking`, `useListMyBookings`, `useAuthRegister`, `useAuthLogin`, `useAuthLogout`, `useAuthMe`, `useAuthCsrf`
5. Generated client includes custom fetch instance with `credentials: "include"` for cookie auth and CSRF header injection
6. `npm run build` passes (tsc -b && vite build — current App.tsx may have type errors until Slice 3 updates it to use new hooks)
7. `npm run typecheck` passes (same caveat as above — this slice produces a new client; Slice 3 will update consumers)

## Invariant Checks For This Slice

- Verify the checked-in OpenAPI spec matches the live backend spec at `/openapi/v1.json` (backend must be running from Slice 1 result)
- Verify generated client exports all previously-available types (`Restaurant`, `Booking`, `CreateBookingRequest`, `AvailabilitySlot`, `ErrorResponse`, etc.)
- Verify generated `useCreateBooking` hook includes the correct request body type matching the backend's expected shape
- Verify Orval output does not introduce unused imports or dead code (must pass `knip` in Slice 5)
- Verify the custom fetch mutator attaches CSRF token from a source the SPA can provide (document or header)
- Verify no hand-written, stringly-typed fetch wrappers are introduced; the generated client is the source of truth

## Required Tests

No dedicated tests for this slice. Verification is through:
- `npm run generate:api` exits zero
- `npm run typecheck` passes (with updated consumer code in Slice 3, or temporarily ignoring new hooks)
- Manual inspection of generated `booking-client.ts` to confirm hooks are present

## Verification Commands

```bash
cd frontend
npm run generate:api
npm run typecheck   # may warn about unused hooks until Slice 3; ensure no structural errors
npm run build       # may fail if App.tsx imports changed hook signatures; Slice 3 addresses this
```

## Handoff Notes

- If switching to `client: "react-query"` causes too many breaking changes in `App.tsx`, fall back to keeping `client: "fetch"` and adding `override.query` blocks per-operation to generate hooks alongside fetch functions
- The generated hooks replace the manual `useQuery`/`useMutation` wrappers currently in `App.tsx`
- Slice 3 (frontend auth UI) depends on this slice — it will import and use the generated React Query hooks
- A custom mutator file at `src/lib/api.ts` may be needed to configure `credentials: "include"` and CSRF header injection for the Orval-generated client

## Non-Goals

- No backend code changes (done in Slice 1)
- No frontend UI code changes (done in Slice 3)
- No test file creation
