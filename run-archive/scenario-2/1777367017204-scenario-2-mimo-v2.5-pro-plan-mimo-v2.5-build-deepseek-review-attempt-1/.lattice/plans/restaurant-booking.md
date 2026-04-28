# Restaurant Booking: Authenticated Accounts Plan

## Current State

- **Backend**: .NET 10 minimal API, in-memory `BookingStore`, `BookingRules` pure domain functions, Result-style errors, OpenAPI at `/openapi/v1.json`. No auth.
- **Frontend**: Vite React SPA, Tailwind/shadcn, TanStack Query, Orval-generated fetch client from `frontend/openapi/restaurant-booking.json`. Single-page card/form/list UI.
- **Tests**: Backend has `BookingRulesTests` (pure domain only). No HTTP-level tests. No frontend tests.
- **Auth**: None. All endpoints are public. Bookings have no user association.

## Architecture Decisions

- **Auth**: ASP.NET Core Identity with `AddIdentityCore` + cookie auth. No external providers.
- **Persistence**: In-memory for Identity (using `IdentityUser` stores in memory). Keep `BookingStore` as in-memory singleton.
- **Cookies**: `SameSite=Lax`, `HttpOnly`, `Secure=Never` (local dev). Named cookie for clarity.
- **CSRF**: ASP.NET Core antiforgery middleware. SPA fetches token from `/api/auth/csrf` and sends `X-CSRF-TOKEN` header on mutations.
- **CORS**: Allow `http://localhost:5173` (Vite dev) with `AllowCredentials()`. Specific origins only.
- **Booking model**: Add `UserId` field to `Booking`. `CreateBookingRequest` gains no userId field—server sets it from auth context.

## Implementation Slices

### Slice 1: Backend Auth Infrastructure

1. **Add Identity packages** to `RestaurantBooking.Api.csproj`:
   - `Microsoft.AspNetCore.Identity.EntityFrameworkCore` (for Identity models, even if using in-memory stores)
   - Actually, use `Microsoft.AspNetCore.Identity` directly with in-memory stores to keep it lightweight.

2. **Add `AuthUser` model and Identity setup** in `Program.cs`:
   - `builder.Services.AddIdentityCore<IdentityUser>(o => { ... })` + `.AddEntityFrameworkStores` or `.AddUserStore<InMemoryUserStore>()`.
   - Use `AddAuthentication(IdentityConstants.ApplicationScheme)` + `AddCookie()`.
   - Configure cookie: `HttpOnly = true`, `SameSite = SameSiteMode.Lax`, `SecurePolicy = CookieSecurePolicy.None` (local dev), `IsEssential = true`.
   - Configure `IdentityOptions`: require confirmed email = false, password relaxed for dev (6 chars min, no special char requirements).

3. **Add antiforgery services**:
   - `builder.Services.AddAntiforgery(o => { o.HeaderName = "X-CSRF-TOKEN"; o.Cookie.SameSite = SameSiteMode.Lax; })`.
   - `app.UseAntiforgery()` after `UseAuthentication`/`UseAuthorization`.

4. **Add CORS policy** (update existing):
   - Replace `AllowAnyOrigin` with specific origin `http://localhost:5173` + `AllowCredentials()`.

5. **Seed demo users** in `Program.cs` at startup:
   - `demo@example.com` / `Demo123!` — for automated verification.
   - Document in README.

6. **Auth endpoints** (new group `/api/auth`):
   - `POST /api/auth/register` — `{ email, password }` → create user, sign in, return 200 + user info.
   - `POST /api/auth/login` — `{ email, password }` → sign in, return 200 + user info.
   - `POST /api/auth/logout` — sign out, return 204.
   - `GET /api/auth/me` — return current user info or 401.
   - `GET /api/auth/csrf` — return antiforgery token as JSON `{ token }`.

7. **Protect booking creation**:
   - Add `[Authorize]` to `POST /api/bookings` endpoint (use `RequireAuthorization()` on that route).
   - Read `userManager.GetUserAsync(HttpContext.User)` to get current user.
   - Set `booking.UserId = user.Id` when creating.

8. **User-scoped booking history**:
   - Add `GET /api/bookings/mine` — returns only bookings where `UserId == current user.Id`. Requires auth.
   - Keep existing `GET /api/bookings` as-is (admin/debug view) or restrict it. Per spec, users must not see other users' history — so either scope it or add a dedicated `/api/bookings/mine`. The existing `/api/bookings` can remain for backward compat but we'll primarily use `/api/bookings/mine` in the frontend.

9. **Update `Booking` record** — add `string UserId` field.

10. **Update `BookingStore.TryCreate`** — accept `string userId` parameter, set on booking.

11. **Add `BookingStore.FindByUser(string userId)`** method.

### Slice 2: Backend OpenAPI + Tests

1. **Update OpenAPI spec** (`frontend/openapi/restaurant-booking.json`) to include:
   - Auth endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/csrf`).
   - `401` responses on protected endpoints.
   - Updated `Booking` schema with `userId`.
   - New `GET /api/bookings/mine` endpoint.
   - `RegisterRequest`, `LoginRequest`, `UserInfo`, `CsrfToken` schemas.

2. **Add HTTP-level backend tests** (`EndpointTests.cs`):
   - Use `WebApplicationFactory<Program>` for integration tests.
   - Test: `GET /api/restaurants` returns 200 with restaurant list.
   - Test: `GET /api/restaurants/{id}/availability` returns slots, returns 400/404 for invalid input.
   - Test: `POST /api/bookings` without auth → 401.
   - Test: `POST /api/bookings` with auth → 201.
   - Test: `POST /api/bookings` with invalid input → 400/404/409.
   - Test: `GET /api/bookings/mine` without auth → 401.
   - Test: `GET /api/bookings/mine` with auth → returns only user's bookings.
   - Test: `POST /api/auth/register` → 200.
   - Test: `POST /api/auth/login` with valid creds → 200.
   - Test: `POST /api/auth/login` with invalid creds → 401.
   - Test: `POST /api/auth/logout` → 204.
   - Test: `GET /api/auth/me` with/without auth.
   - Test: `GET /api/auth/csrf` returns token.
   - Test: Overlapping reservation still returns 409.
   - Test: Invalid party size/date/time still returns proper errors.

3. **Keep existing `BookingRulesTests` unchanged** — pure domain tests remain as-is.

### Slice 3: Frontend Auth UI

1. **Update generated OpenAPI client** — regenerate `booking-client.ts` from updated spec.

2. **Add auth hooks/context** (`src/hooks/useAuth.ts` or `src/lib/auth.ts`):
   - `useAuth()` hook: fetches `/api/auth/me`, provides `{ user, isLoading, isAuthenticated }`.
   - `useLogin()` mutation: posts to `/api/auth/login`, invalidates auth query.
   - `useRegister()` mutation: posts to `/api/auth/register`, invalidates auth query.
   - `useLogout()` mutation: posts to `/api/auth/logout`, invalidates auth query.
   - CSRF token management: fetch from `/api/auth/csrf` on app load, store in memory, include in mutation headers.

3. **Add auth-aware fetch wrapper** — thin wrapper that adds `credentials: 'include'` and `X-CSRF-TOKEN` header to all generated fetch calls. Modify the generated client's `options` or add a default `RequestInit` provider.

4. **Add login/register page** (`src/components/AuthPage.tsx`):
   - Tabbed or toggled login/register form using existing shadcn components.
   - Email + password fields.
   - Error display for invalid credentials.
   - Redirect to main app on success.

5. **Add user header/nav** (`src/components/UserNav.tsx`):
   - Show logged-in user email + logout button.
   - Visible in main app header.

6. **Update `App.tsx`**:
   - Wrap with auth check — if not authenticated, show `AuthPage`.
   - If authenticated, show main booking UI with user nav.
   - Update `ExistingBookings` to use `GET /api/bookings/mine` (user-scoped).
   - Remove guest name/email from booking form (use auth user's info instead), or keep them as optional overrides.
   - Actually, keep guest name/email fields but pre-fill from auth context — the booking still records guest info but is associated with the authenticated user.

7. **Update booking mutation** — send CSRF header, use `credentials: 'include'`.

8. **Add booking history section** — show user's bookings across all restaurants, not just selected one.

### Slice 4: Frontend Tests

1. **Add Vitest + React Testing Library**:
   - Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` to devDependencies.
   - Add `vitest.config.ts` or configure in `vite.config.ts`.
   - Add `test` script to `package.json`.

2. **Add test files**:
   - `src/__tests__/AuthPage.test.tsx` — renders login form, handles submission, shows errors.
   - `src/__tests__/App.test.tsx` — shows auth page when unauthenticated, shows booking UI when authenticated.
   - `src/__tests__/BookingForm.test.tsx` — form validation, submission, error display, confirmation.
   - `src/__tests__/BookingHistory.test.tsx` — displays user bookings.

3. **Mock generated client** in tests — mock the fetch functions.

### Slice 5: Polish + README

1. **UI polish**:
   - Add subtle loading states for auth operations.
   - Add proper form validation feedback.
   - Ensure responsive layout for auth page.
   - Add transition/animation for auth → app transition.

2. **Update README**:
   - Document auth setup, seeded users (`demo@example.com` / `Demo123!`).
   - Document CSRF behavior.
   - Update run instructions.
   - Update check commands (add `npm run test`).

3. **Update frontend OpenAPI spec** and regenerate client.

4. **Final verification**:
   - Backend: `dotnet build`, `dotnet test`, `dotnet format --verify-no-changes`.
   - Frontend: `npm run generate:api`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run deadcode`, `npm run test`.

## File Changes Summary

| File | Action |
|------|--------|
| `backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj` | Add Identity package |
| `backend/RestaurantBooking.Api/Domain.cs` | Add `UserId` to `Booking` |
| `backend/RestaurantBooking.Api/BookingStore.cs` | Add `userId` param to `TryCreate`, add `FindByUser` |
| `backend/RestaurantBooking.Api/Program.cs` | Add Identity, CORS, antiforgery, auth endpoints, protect bookings |
| `backend/RestaurantBooking.Tests/EndpointTests.cs` | New — HTTP-level integration tests |
| `frontend/openapi/restaurant-booking.json` | Update with auth endpoints |
| `frontend/src/generated/booking-client.ts` | Regenerate |
| `frontend/src/lib/auth.ts` | New — auth hooks, CSRF management |
| `frontend/src/lib/api.ts` | New — credentialed fetch wrapper with CSRF |
| `frontend/src/components/AuthPage.tsx` | New — login/register UI |
| `frontend/src/components/UserNav.tsx` | New — user nav with logout |
| `frontend/src/App.tsx` | Add auth gate, user-scoped bookings |
| `frontend/vite.config.ts` | Possibly add test config |
| `frontend/package.json` | Add test deps and scripts |
| `frontend/src/__tests__/*.test.tsx` | New — frontend tests |
| `README.md` | Update with auth docs |

## Order of Execution

1. Backend auth infrastructure (Identity, cookies, CORS, antiforgery, endpoints)
2. Backend domain/store updates (UserId on Booking)
3. Backend integration tests
4. Update OpenAPI spec
5. Regenerate frontend client
6. Frontend auth hooks/CSRF management
7. Frontend auth UI (login/register/logout)
8. Update App.tsx with auth gate and user-scoped bookings
9. Frontend tests
10. Polish + README + final verification
