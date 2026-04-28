# Slice 2 Summary: CSRF Protection + Frontend Auth UI + Client Regeneration

## Changes Made

### Backend (Program.cs)
- Added `builder.Services.AddAntiforgery()` with `HeaderName = "X-CSRF-TOKEN"` and cookie config (SameSite=Lax, Secure=None for local dev)
- Added `app.UseAntiforgery()` middleware after `UseAuthorization()` — validates CSRF tokens for all non-idempotent requests (POST, PUT, DELETE) automatically
- Added `GET /api/auth/csrf-token` endpoint that calls `IAntiforgery.GetAndStoreTokens()` and returns `{ token }` in response body while setting the antiforgery cookie

### Backend Tests
- Updated `AuthEndpointsTests.cs` — all mutation-endpoint tests now fetch a CSRF token before making POST requests; added `GetCsrfToken_ReturnsTokenAndSetsCookie` test (new, totals 11 auth tests)
- Updated `BookingEndpointsTests.cs` — tests fetch CSRF tokens before register/login; the `RegisterAndLogin` helper now returns `(HttpClient, csrfToken, UserInfo)` with proper CSRF cookie + header + auth cookie composition
- Helper methods `CreateClientWithCsrf()` and `RegisterAndLogin()` manage CSRF/Auth cookie tracking

### OpenAPI Spec (`frontend/openapi/restaurant-booking.json`)
- Added auth paths: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/auth/csrf-token`
- Added `GET /api/bookings/mine` with 401 response
- Added 401 responses to protected booking endpoints
- Added schemas: `RegisterRequest`, `LoginRequest`, `UserInfo`
- Added `Unauthorized` response component

### Orval Config
- Changed from `client: "fetch"` to `client: "react-query"` — generator now produces TanStack Query hooks including `useListRestaurants`, `useListAvailableSlots`, `useListBookings`, `useCreateBooking`, `useGetBookingsMine`, `useLogin`, `useRegister`, `useLogout`, `useMe`, `useGetCsrfToken`

### Frontend Files Created
- `src/hooks/useAuth.tsx` — AuthProvider (context), useAuth hook, useCsrfHeaders hook
  - Fetches CSRF token on mount via `GET /api/auth/csrf-token`
  - Checks auth state via `GET /api/auth/me`
  - Provides `login()`, `register()`, `logout()` functions that use the generated typed client with CSRF headers
  - CSRF token stored in React state (never localStorage/sessionStorage)
- `src/components/AuthDialog.tsx` — Modal dialog with login/register forms (toggleable), error display, form validation
- `src/components/NavHeader.tsx` — Sticky header with TableForge branding, tab navigation (Restaurants / My Bookings), auth state badge + sign out button / sign in button
- `src/components/MyBookings.tsx` — Uses `useGetBookingsMine` hook to display authenticated user's booking history with restaurant name, date, time, party size badges

### Frontend Files Modified
- `src/App.tsx` — Replaced manual TanStack Query wrappers with generated hooks (`useListRestaurants`, `useListAvailableSlots`, `useListBookings`, `useCreateBooking`); added auth gating (unauthenticated users see sign-in prompt instead of booking form); integrated NavHeader, AuthDialog, MyBookings; wired up `useCsrfHeaders` for mutation CSRF protection
- `src/main.tsx` — Wrapped app with `AuthProvider` inside `QueryClientProvider`
- `frontend/orval.config.ts` — Changed `client: "fetch"` to `client: "react-query"`
- `frontend/openapi/restaurant-booking.json` — Added auth/bookings-mine endpoints and schemas

### Key Design Decisions
- **CSRF via middleware**: Used `app.UseAntiforgery()` middleware (introduced in .NET 8+) which automatically validates POST/PUT/DELETE endpoints. This is simpler than manual validation in each endpoint handler.
- **No CSRF on OPTIONS**: CORS preflight requests bypass antiforgery middleware naturally.
- **CSRF fetching**: Token is fetched on mount via a `GET` (unprotected). The returned cookie + token value are used for subsequent mutations. The token is stored in React state — never in localStorage.
- **Auth checking**: `AuthProvider` calls `/api/auth/me` on mount. No polling or interval — auth state is updated on login/register/logout actions.
- **Auth gating**: Booking form is conditionally rendered — when unauthenticated, a Card with "Sign in to book a table" prompt is shown instead.

## Verification Results

### Backend
- `dotnet build RestaurantBooking.slnx` — passes (0 warnings, 0 errors)
- `dotnet test RestaurantBooking.slnx --no-build` — 27/27 pass (11 auth + 10 booking + 1 new CSRF + 5 existing domain tests)
- `dotnet format RestaurantBooking.slnx --verify-no-changes` — passes

### Frontend
- `npm run generate:api` — orval v8.8.1 generates react-query hooks successfully
- `npm run typecheck` — passes (0 errors)
- `npm run lint` — passes (0 errors, 0 warnings)
- `npm run format:check` — passes (all files Prettier-compliant)
- `npm run deadcode` — passes (knip finds no issues)
- `npm run build` — passes (generate:api → tsc → vite build, 0 errors)

## Known Gaps
- No frontend tests (deferred to Slice 3 as planned)
- No README updates (deferred to Slice 4)
- No UI layout overhaul (deferred to Slice 3)
- CSRF token is not refetched on 400 "antiforgery" errors — the current session's token should remain valid; if it expires, the user can refresh the page

## Handoff Notes
- Backend tests now require CSRF token handling in `RegisterAndLogin` and `CreateClientWithCsrf` helpers — all mutation POST requests must include both the CSRF cookie and `X-CSRF-TOKEN` header
- The `UseAntiforgery()` middleware applies to ALL non-GET endpoints. The CSRF token endpoint (`GET /api/auth/csrf-token`) is exempt since it's a GET
- Frontend uses generated hooks with path-based query keys (e.g., `["/api/bookings"]`, `["/api/bookings/mine"]`, `["/api/restaurants/${id}/availability", params]`)
- Mutation CSRF: `useCreateBooking` receives `fetch: { headers: csrfHeaders }` where `csrfHeaders` comes from `useCsrfHeaders()` hook
- Auth Dialog mode toggles between login/register. The `AuthProvider` tracks both CSRF token and auth state; no tokens are persisted to storage
