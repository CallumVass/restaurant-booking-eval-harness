# Restaurant Booking — Authenticated Booking Accounts Plan

## Summary

Add local cookie-based auth, user-scoped bookings, CSRF protection, backend HTTP tests, frontend integration tests, generated TanStack Query hooks, and UI polish. Deliver in 5 vertical slices.

---

## Slice 1: Backend Auth Foundation + User-Scoped Bookings

### Goal
Add cookie authentication, user model, registration/login/logout endpoints, associate bookings with users, enforce auth on booking creation, and add user-scoped booking history.

### Backend changes

1. **Add auth packages to `RestaurantBooking.Api.csproj`:**
   - `Microsoft.AspNetCore.Authentication.Cookies` (built-in, no extra NuGet needed)
   - Add `Microsoft.Extensions.Identity.Core` for `IPasswordHasher<TUser>` (non-EF, lightweight)

2. **Add user model and in-memory store (`AuthStore.cs`):**
   - `AppUser` record: `Id`, `Email`, `PasswordHash`, `DisplayName`
   - `RegisterRequest` record: `Email`, `Password`, `DisplayName`
   - `LoginRequest` record: `Email`, `Password`
   - `AuthStore` class: lock-protected `ConcurrentDictionary<string, AppUser>`, seeded with 2 demo users
   - Seed users: `alice@example.com` / `Demo1234!` and `bob@example.com` / `Demo1234!`

3. **Extend `Booking` record in `Domain.cs`:**
   - Add `UserId` field (nullable for backward compat, set at creation time)

4. **Add auth error types to `Domain.cs`:**
   - `AuthError` enum: `InvalidCredentials`, `EmailAlreadyRegistered`, `Unauthenticated`
   - `AuthResult<T>` (similar to `BookingResult<T>`)

5. **Add auth endpoints in `Program.cs`:**
   - `POST /api/auth/register` — create user, sign in via cookie
   - `POST /api/auth/login` — validate credentials, sign in via cookie
   - `POST /api/auth/logout` — sign out
   - `GET /api/auth/me` — return current user info (or null if unauthenticated)

6. **Configure cookie auth in `Program.cs`:**
   - `builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(...)`
   - Cookie options: `HttpOnly = true`, `SameSite = SameSiteMode.Strict`, `SecurePolicy = None` (local dev)
   - `builder.Services.AddAuthorization()`
   - `app.UseAuthentication()` + `app.UseAuthorization()` (before `MapOpenApi`)

7. **Protect endpoints:**
   - `POST /api/bookings` → `RequireAuthorization()` — unauthenticated returns 401
   - On create, extract `UserId` from `HttpContext.User` and pass to `BookingStore.TryCreate`
   - `GET /api/bookings/mine` → new endpoint, `RequireAuthorization()`, returns current user's bookings only
   - Existing `GET /api/bookings` remains public (for demo, shows all; documented in README)
   - `GET /api/restaurants` and `GET /api/restaurants/{id}/availability` remain public

8. **Update `BookingStore.cs`:**
   - `TryCreate` accepts optional `userId` parameter
   - `GetUserBookings(string userId)` method
   - Existing `Bookings` property remains for compatibility

9. **Update CORS in `Program.cs`:**
   - Replace `AllowAnyOrigin` with specific origin `http://localhost:5173` (Vite default)
   - Add `AllowCredentials()`

### OpenAPI spec update

10. **Update `frontend/openapi/restaurant-booking.json`:**
    - Add `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` paths
    - Add `GET /api/bookings/mine` path (auth-protected)
    - Add schemas: `RegisterRequest`, `LoginRequest`, `AppUser`, `AuthError`
    - Add `security` scheme for cookie auth on protected routes
    - Add `401` response to `POST /api/bookings`

11. **Regenerate client:**
    - Run `npm run generate:api` after spec update

### Tests (backend)

12. **Add `Microsoft.AspNetCore.Mvc.Testing` to test project**
13. **Create `AuthEndpointsTests.cs`:**
    - Register new user → 200 OK, cookie set
    - Register duplicate email → 409 Conflict
    - Login with valid credentials → 200 OK, cookie set
    - Login with wrong password → 401 Unauthorized
    - Login with unknown email → 401 Unauthorized
    - GET /api/auth/me authenticated → 200 with user info
    - GET /api/auth/me unauthenticated → 401
    - Logout → clears cookie

14. **Create `BookingEndpointsTests.cs`:**
    - Create booking authenticated → 201 Created, booking has UserId
    - Create booking unauthenticated → 401 Unauthorized
    - GET /api/bookings/mine authenticated → 200, only own bookings
    - GET /api/bookings/mine unauthenticated → 401
    - User A cannot see User B's bookings via /mine
    - Existing validation errors still work (invalid party size → 400, unknown restaurant → 404, conflict → 409)
    - Available slots still work (public endpoint)
    - Restaurant list still works (public endpoint)

### Verification
- `dotnet build RestaurantBooking.slnx` passes with TreatWarningsAsErrors
- `dotnet test RestaurantBooking.slnx --no-build` passes
- `dotnet format RestaurantBooking.slnx --verify-no-changes` passes

---

## Slice 2: CSRF Protection + Frontend Auth UI + Client Regeneration

### Goal
Add CSRF protection for cookie auth, build login/registration/logout UI, regenerate the typed client with TanStack Query hooks, and guard the booking flow behind auth.

### Backend changes

1. **Add antiforgery in `Program.cs`:**
   - `builder.Services.AddAntiforgery(options => { options.HeaderName = "X-CSRF-TOKEN"; })`
   - Add `GET /api/auth/csrf-token` endpoint — returns CSRF token cookie + token value in response body

2. **Add `ValidateAntiForgeryToken` filter to mutation endpoints:**
   - Apply to `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/bookings`

### Frontend changes

3. **Update `orval.config.ts`:**
   - Change `client: "fetch"` to `client: "react-query"` (orval generates TanStack Query hooks)
   - Generate query hooks for GET endpoints, mutation hooks for POST endpoints

4. **Regenerate client:**
   - `npm run generate:api`

5. **Create auth hook/context (`src/hooks/useAuth.ts`):**
   - `useCurrentUser()` — TanStack Query hook using generated `useGetAuthMe`
   - `useLogin()` — TanStack mutation using generated `usePostAuthLogin`
   - `useRegister()` — TanStack mutation using generated `usePostAuthRegister`
   - `useLogout()` — TanStack mutation using generated `usePostAuthLogout`

6. **Create auth components (`src/components/AuthDialog.tsx`):**
   - Login form: email + password + submit, error display
   - Register form: email + password + display name + submit, error display
   - Toggle between login/register
   - Styled with existing Card/Button/Input/Field components

7. **Create `src/components/NavHeader.tsx`:**
   - App title/branding
   - Auth section: "Sign in" button (unauthenticated) or user display name + "Sign out" (authenticated)
   - Tab navigation: "Restaurants" / "My Bookings"

8. **Create `src/components/MyBookings.tsx`:**
   - Uses generated `useGetBookingsMine` query hook
   - Shows current user's booking history in a card list
   - Empty state when no bookings

9. **Update `App.tsx`:**
   - Add `NavHeader` at top
   - Add tab state for "Restaurants" / "My Bookings"
   - Guard booking form: if not authenticated, show auth prompt instead of form
   - Replace manual `listBookings` call with generated TanStack Query hook
   - Replace manual `createBooking` call with generated mutation hook
   - Use generated hooks for `listRestaurants` and `listAvailableSlots`

10. **CSRF token fetching:**
    - Fetch CSRF token on app load (before any mutations)
    - Attach `X-CSRF-TOKEN` header to all POST mutation calls
    - Configure fetch/axios via orval's mutator or request interceptors

### Verification
- `cd frontend && npm run generate:api` succeeds
- `npm run build` passes
- `npm run typecheck` passes
- `npm run lint` passes
- `npm run format:check` passes
- `npm run deadcode` passes (update knip.json entries if needed)

---

## Slice 3: UI Polish + Backend HTTP Tests + Frontend Tests

### Goal
Improve visual layout, add frontend integration tests, and add remaining backend HTTP-level tests.

### Backend changes

1. **Add HTTP integration tests (`BookingHttpTests.cs`):**
   - Use `WebApplicationFactory<Program>` to test the full HTTP pipeline
   - Test that OpenAPI endpoint is reachable at `/openapi/v1.json`
   - Test error mapping: 400 for invalid party size, 404 for unknown restaurant, 409 for conflicts
   - Test date/time validation via HTTP
   - Test adjacent non-overlapping bookings via HTTP
   - Test capacity limits via HTTP
   - These complement the existing pure domain `BookingRulesTests`

### Frontend changes

2. **UI layout improvements in `App.tsx`:**
   - Replace single-column layout with proper tabbed navigation
   - "Restaurants" tab: existing restaurant selection + booking form
   - "My Bookings" tab: user's booking history (auth-gated)
   - Better responsive grid at all breakpoints
   - Smooth transition between tabs

3. **Add `src/components/PageShell.tsx`:**
   - Max-width container, padding, consistent section spacing
   - Extracted from inline layout in App.tsx

4. **Polish booking confirmation:**
   - Animated checkmark or transition on confirmation card
   - Clearer success state messaging with booking details

5. **Polish empty/error states:**
   - Consistent empty state illustrations or icons
   - Better error card styling

### Frontend tests

6. **Add test dependencies to frontend:**
   - `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw`
   - `jsdom` for DOM environment

7. **Create test setup (`src/test/setup.ts`):**
   - MSW server with handlers for auth + booking endpoints
   - Mock service worker configuration

8. **Create `src/App.test.tsx`:**
   - Renders restaurant list
   - Renders header with sign-in button when unauthenticated
   - Shows auth dialog when clicking sign in

9. **Create `src/components/AuthDialog.test.tsx`:**
   - Login form submission with valid credentials
   - Login error display on invalid credentials
   - Toggle between login and register forms

10. **Create `src/components/BookingForm.test.tsx`:**
    - Date/party size/time selection
    - Guest name/email input
    - Form submission with valid data
    - Error message display on API errors (conflict, validation)
    - Confirmation message after successful booking

11. **Create `src/components/MyBookings.test.tsx`:**
    - Shows booking history when authenticated
    - Shows empty state when no bookings
    - Shows loading state

### Verification
- All frontend quality scripts pass
- `cd frontend && npx vitest run` passes

---

## Slice 4: End-to-End Integration Verification

### Goal
Ensure the full stack works together: auth flow, booking creation with user association, CSRF tokens, booking history scoping.

### Tasks

1. **Manual smoke test script or checklist in README:**
   - Start backend, start frontend
   - Register a user
   - Log out, log in
   - Create a booking at a restaurant
   - View own booking history
   - Confirm another user cannot see the first user's bookings
   - Try creating a booking while logged out (should see auth prompt)
   - Verify CSRF tokens are sent on mutations

2. **README updates:**
   - Document seeded demo users (alice@example.com / Demo1234!, bob@example.com / Demo1234!)
   - Document auth flow, CSRF behavior
   - Document new endpoints
   - Update run instructions

3. **Final quality gate:**
   - `dotnet build RestaurantBooking.slnx` — clean
   - `dotnet test RestaurantBooking.slnx --no-build` — all pass
   - `dotnet format RestaurantBooking.slnx --verify-no-changes` — clean
   - `cd frontend && npm run build` — clean
   - `cd frontend && npm run typecheck` — clean
   - `cd frontend && npm run lint` — clean
   - `cd frontend && npm run format:check` — clean
   - `cd frontend && npm run deadcode` — clean

---

## Architecture Principles

- **Functional Core / Imperative Shell**: `BookingRules` remains pure domain logic. `BookingStore`, `AuthStore`, and HTTP endpoints are imperative shells.
- **Result-style errors**: `BookingResult<T>` for business errors, `AuthResult<T>` for auth errors. Mapped to HTTP status codes in the shell.
- **Clean Architecture boundaries**: Domain types in `Domain.cs`, stores in separate files, endpoints in `Program.cs` (minimal API pattern preserved).
- **No external services**: All in-memory persistence, no hosted databases, no OAuth, no secrets.
- **Preserve existing behavior**: All existing endpoints, validation rules, and error mappings remain intact.

---

## File Manifest

### New backend files
- `backend/RestaurantBooking.Api/AuthStore.cs` — User model + in-memory store
- `backend/RestaurantBooking.Api/AuthDomain.cs` — Auth request/response/result types

### Modified backend files
- `backend/RestaurantBooking.Api/Program.cs` — Add auth config, auth endpoints, antiforgery, CORS update
- `backend/RestaurantBooking.Api/Domain.cs` — Add `UserId` to Booking, optional auth error types
- `backend/RestaurantBooking.Api/BookingStore.cs` — Add `UserId` support, `GetUserBookings`
- `backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj` — Add Identity packages

### New test files
- `backend/RestaurantBooking.Tests/AuthEndpointsTests.cs` — Auth HTTP integration tests
- `backend/RestaurantBooking.Tests/BookingEndpointsTests.cs` — Booking HTTP integration tests

### Modified test files
- `backend/RestaurantBooking.Tests/RestaurantBooking.Tests.csproj` — Add WebApplicationFactory package

### New frontend files
- `frontend/src/components/AuthDialog.tsx` — Login/register modal
- `frontend/src/components/NavHeader.tsx` — App header with auth state + tab nav
- `frontend/src/components/MyBookings.tsx` — User's booking history
- `frontend/src/components/PageShell.tsx` — Layout wrapper
- `frontend/src/hooks/useAuth.ts` — Auth context/hooks
- `frontend/src/hooks/useCsrf.ts` — CSRF token management
- `frontend/src/test/setup.ts` — Test setup with MSW
- `frontend/src/App.test.tsx` — App-level integration tests
- `frontend/src/components/AuthDialog.test.tsx`
- `frontend/src/components/BookingForm.test.tsx`
- `frontend/src/components/MyBookings.test.tsx`

### Modified frontend files
- `frontend/orval.config.ts` — Switch to `client: "react-query"`
- `frontend/openapi/restaurant-booking.json` — Add auth endpoints and schemas
- `frontend/src/App.tsx` — Add auth gating, use generated hooks, tab layout
- `frontend/src/main.tsx` — Add auth provider/context if needed
- `frontend/package.json` — Add vitest, testing-library, msw, jsdom
- `frontend/vite.config.ts` — Add test config
- `frontend/knip.json` — Update entries for new files
- `frontend/tsconfig.app.json` — Add vitest/globals types if needed

### Modified root files
- `README.md` — Auth docs, seeded users, CSRF, updated run instructions
