# Restaurant Booking Auth Plan

## Current Shape

- Backend is a .NET 10 minimal API with in-memory `BookingStore`, pure `BookingRules`, Result-style booking errors, and OpenAPI at `/openapi/v1.json`.
- Frontend is a Vite React SPA using Tailwind CSS, shadcn-style source components, TanStack Query, and an Orval fetch client generated from checked-in `frontend/openapi/restaurant-booking.json`.
- Existing automated coverage is domain-rule focused only; there are no backend HTTP/OpenAPI tests and no frontend UI/integration tests.

## Implementation Slices

1. Add backend HTTP safety coverage first. Add `WebApplicationFactory`-based tests for restaurant listing, availability, booking creation, existing error mapping, OpenAPI document availability, and atomic conflict prevention while keeping the current domain tests intact.

2. Add local cookie auth and CSRF. Use ASP.NET Core cookie auth with Identity's first-party password hashing and an in-memory user store, seeded with documented demo users. Add `/api/auth/csrf`, `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me`. Configure HttpOnly auth cookies, antiforgery header validation for register/login/logout and booking creation, and credentialed CORS for local Vite/backend origins only.

3. Make bookings user-owned. Add `UserId` ownership to stored bookings while keeping restaurant/table/availability rules in the functional core. Protect `POST /api/bookings`, attach the authenticated user id in the endpoint shell, and expose authenticated current-user booking history with restaurant scoping. Remove frontend use of any all-users booking history. Preserve Result-style errors and HTTP mappings for invalid party size, invalid dates/times, unknown restaurants, capacity failures, and overlaps; return `401` for unauthenticated protected requests.

4. Strengthen OpenAPI and generated client workflow. Update backend OpenAPI metadata and the checked-in frontend OpenAPI source with auth endpoints, cookie security, CSRF header parameters, protected booking responses, and user-history schemas. Switch Orval to `client: "react-query"` with `httpClient: "fetch"` and a tiny typed mutator that uses `credentials: "include"` and sends the cached CSRF token for state-changing calls. Regenerate the client and use generated TanStack Query hooks where emitted; keep only thin typed wrappers for CSRF bootstrap gaps.

5. Add frontend auth and protected booking flow. Add authenticated-user state from the generated `/auth/me` query, login/register/logout forms, CSRF bootstrap before mutations, and a clear login-required path before booking submission. On successful booking, show confirmation, invalidate generated availability and current-user history query keys, and render only the signed-in user's bookings for the selected restaurant. Do not use `localStorage` or `sessionStorage` for auth.

6. Improve UI polish within the current visual language. Preserve the warm neutral Tailwind tokens and shadcn-style `Card`, `Button`, `Field`, `Input`, and `Badge` composition. Rework the page into a responsive hero/account area, restaurant selection column, booking workspace, confirmation callout, and user history panel with clearer loading, empty, error, and disabled states.

7. Add focused frontend tests. Add Vitest and Testing Library coverage for login/register, login-required booking submission, successful booking confirmation/history display, logout state, and API error display. Prefer mocking generated operations or MSW over hand-written fetch wrappers so tests exercise the same typed client path as the UI.

8. Document and verify. Update README with run instructions, seeded users, cookie/CSRF behavior, local CORS origins, generated-client workflow, and test scripts. Run backend `dotnet build RestaurantBooking.slnx`, `dotnet test RestaurantBooking.slnx --no-build`, and `dotnet format RestaurantBooking.slnx --verify-no-changes`; then run frontend `npm install`, `npm run generate:api`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run deadcode`, and frontend tests.
