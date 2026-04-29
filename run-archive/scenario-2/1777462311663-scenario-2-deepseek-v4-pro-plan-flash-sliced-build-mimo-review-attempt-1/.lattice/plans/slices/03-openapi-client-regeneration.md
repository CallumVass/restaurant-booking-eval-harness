# Slice 3: OpenAPI Spec Update and Frontend Client Regeneration

## Goal

Update the static OpenAPI spec (`frontend/openapi/restaurant-booking.json`) to include auth endpoints, security schemes, CSRF header requirements, and the new booking-mine endpoint. Then regenerate the TypeScript client with Orval configured for TanStack Query hooks (react-query client) with cookie credentials support.

## Global Invariants

| Invariant | Text |
|-----------|------|
| GI-007 | The generated TypeScript client from Orval is the single typed surface for frontend API interaction |
| GI-008 | All quality gates pass |

## Acceptance Criteria

| # | Criterion | Covers |
|---|-----------|--------|
| AC-3.1 | OpenAPI spec includes `securityDefinitions` (or `securitySchemes` in OpenAPI 3.x) with `cookieAuth` (apiKey in cookie) | R-053 |
| AC-3.2 | OpenAPI spec includes paths: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/antiforgery/token` | R-017, R-049 |
| AC-3.3 | OpenAPI spec includes schemas: `UserInfo`, `LoginRequest`, `RegisterRequest` | R-017, R-046, R-047 |
| AC-3.4 | `POST /api/bookings` marked with `security: [{cookieAuth: []}]` | R-017 |
| AC-3.5 | `GET /api/bookings/mine` path replaces old `GET /api/bookings` path, marked with `security: [{cookieAuth: []}]` | R-051, R-053 |
| AC-3.6 | Mutating endpoints (POST bookings, POST auth/login, POST auth/logout, POST auth/register) declare `X-CSRF-TOKEN` header parameter | R-054 |
| AC-3.7 | OpenAPI spec defines `401` response for auth-protected endpoints | R-017 |
| AC-3.8 | `orval.config.ts` specifies `client: "react-query"` and `credentials: "include"` for cookie-based auth | R-021, R-026, R-055 |
| AC-3.9 | `npm run generate:api` completes without errors | R-044, GI-008 |
| AC-3.10 | Generated client exports TanStack Query hooks: `useListRestaurants`, `useListAvailableSlots`, `useListBookingsMine`, `useCreateBooking`, `useRegister`, `useLogin`, `useLogout`, `useGetAuthMe` | R-021, R-026 |
| AC-3.11 | Generated client does NOT export `listBookings` (old unauthenticated endpoint removed) | R-051 |
| AC-3.12 | Generated `useCreateBooking` mutation hook supports custom headers (for X-CSRF-TOKEN) | R-011 |
| AC-3.13 | All generated types (`UserInfo`, `LoginRequest`, `RegisterRequest`) are correctly typed with required fields | R-021, GI-007 |

## Invariant Checks For This Slice

- **GI-007**: After regeneration, verify there are no hand-written type exports from `./generated/booking-client` that aren't generated. The frontend `src/` code should import all API types from this file exclusively.
- **GI-008**: After regeneration, `npm run build` and `npm run typecheck` must pass. The generated code must compile cleanly.

## Required Tests

No automated tests in this slice. Verification is through:

| Test | Type | Covers | Contract |
|------|------|--------|----------|
| `generate:api` completes without errors | Manual / Script | AC-3.9, R-044 | `npm run generate:api` exit code 0 |
| Generated hooks exist | Manual Inspection | AC-3.10, R-026 | Grep for `useCreateBooking`, `useListBookingsMine`, etc. in `src/generated/booking-client.ts` |
| Old `listBookings` removed | Manual Inspection | AC-3.11, R-051 | Grep for `listBookings` in generated file returns no matches (except `useListBookingsMine`) |
| OpenAPI spec valid JSON | Automated (build) | AC-3.1-3.7 | `npm run generate:api` (which parses the JSON) succeeds |
| Build succeeds after regeneration | Automated | AC-3.13, GI-008 | `npm run build` exit code 0 |

## Verification Commands

```bash
cd frontend
npm run generate:api     # must complete with exit code 0
npm run typecheck        # must pass
npm run build            # must pass (includes generate:api + tsc + vite build)
```

## Handoff Notes

- The static `frontend/openapi/restaurant-booking.json` is the source of truth for Orval generation. It must be updated to match the backend API surface from Slice 2.
- For OpenAPI 3.0.x: use `components.securitySchemes.cookieAuth` with `type: "apiKey"`, `in: "cookie"`, `name: ".AspNetCore.Identity.Application"` (the default cookie name for ASP.NET Core Identity).
- The `X-CSRF-TOKEN` header is declared as a parameter on each mutating operation, not as a global security requirement (since GET requests don't need it).
- Orval's `react-query` client generates hooks automatically from operationIds. Ensure operationIds in the spec use camelCase convention (e.g., `register`, `login`, `logout`, `getAuthMe`, `listBookingsMine`).
- The Orval config's `credentials: "include"` ensures fetch requests include cookies. Configure this via Orval's `override.fetch` or at the output level.
- If Orval's react-query client doesn't directly support a `credentials` option at the top level, use the `override` section to add a custom fetch function that includes `credentials: "include"` or configure a global mutator.
- The generated client file path remains `./src/generated/booking-client.ts` (unchanged from existing).
- After regeneration, run `npm run lint` and `npm run deadcode` to catch any import issues. If Orval generates unused exports, address via Orval config (`clean: true` is already set).

## Non-Goals

- This slice does NOT write any frontend component code (done in Slice 4).
- This slice does NOT implement any backend endpoint behavior (done in Slice 2).
- This slice does NOT add tests for the generated client (the Orval generation itself acts as the verification).
- This slice does NOT update README or .gitignore (done in Slice 5).
