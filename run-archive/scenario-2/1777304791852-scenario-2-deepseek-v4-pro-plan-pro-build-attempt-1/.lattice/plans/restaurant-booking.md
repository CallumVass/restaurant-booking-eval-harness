# Restaurant Booking — Authenticated Booking Accounts Plan

## Summary

Add local email/password auth (ASP.NET Core Identity, in-memory), HTTP-only cookie sessions, CSRF protection, user-scoped bookings, and auth-aware frontend. Preserve existing architecture, OpenAPI client generation, and TanStack Query patterns.

## Vertical Slices (implementation order)

### Slice 1: Backend Auth Infrastructure

**Goal**: Add Identity with in-memory store, auth endpoints, cookie auth, CSRF, CORS, and user-associated bookings. All existing endpoints continue working.

**Files to change/create**:
- `backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj` — add package references: `Microsoft.AspNetCore.Identity.EntityFrameworkCore` (or just `Microsoft.Extensions.Identity.Core` for in-memory), `Microsoft.AspNetCore.Authentication.Cookies`
- `backend/RestaurantBooking.Api/Domain.cs` — add `UserId` (`string?`) to `Booking` record; add `LoginRequest`, `RegisterRequest`, `UserInfo` records
- `backend/RestaurantBooking.Api/BookingStore.cs` — thread-safe `ConcurrentDictionary<string, Booking>` keyed by booking ID; add `UserBookings(userId)` method; `TryCreate` accepts `userId` and stores it
- `backend/RestaurantBooking.Api/Program.cs` — imperative shell changes:
  - Register Identity services with in-memory stores (custom `IUserStore<User>`, `IRoleStore<IdentityRole>` using `ConcurrentDictionary`)
  - Add `AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(...)` with `LoginPath = null`, `Cookie.HttpOnly = true`, `Cookie.SameSite = SameSiteMode.Strict`
  - Add `AddAuthorization()`
  - Add `AddAntiforgery()` with cookie-based token
  - Change CORS to specific origins (`http://localhost:5173`) with `AllowCredentials()`
  - Add middleware: `UseAuthentication()`, `UseAuthorization()`, `UseAntiforgery()` (after routing, before endpoints)
  - New endpoints on `/api` group:
    - `POST /api/auth/register` — `SignInManager` create + sign in; requires antiforgery
    - `POST /api/auth/login` — `SignInManager.PasswordSignInAsync`; requires antiforgery
    - `POST /api/auth/logout` — `SignInManager.SignOutAsync`; requires antiforgery
    - `GET /api/auth/me` — returns current user info or 401
    - `GET /api/auth/csrf` — returns antiforgery token in custom header
  - Change existing endpoints:
    - `POST /api/bookings` — `[Authorize]` attribute; use `HttpContext.User` to get `userId`; accept CSRF
    - `GET /api/bookings` — `[Authorize]` attribute; return only current user's bookings
    - `GET /api/restaurants` — unchanged (public)
    - `GET /api/restaurants/{restaurantId}/availability` — unchanged (public)
  - Seed a demo user: `demo@example.com` / `Demo123!` in `Program.cs` startup
  - Update `ToHttpResult` to handle 401 for unauthenticated

**Key dependencies**: `Microsoft.AspNetCore.Identity`, `Microsoft.AspNetCore.Authentication.Cookies`

**Verification**: `dotnet build`, `dotnet test` (existing domain tests pass); HTTP file smoke test of new auth endpoints.

---

### Slice 2: Backend Integration Tests

**Goal**: Add HTTP-level integration tests covering auth boundaries, booking protection, CSRF, error mapping, and existing endpoint behavior.

**Files to create/change**:
- `backend/RestaurantBooking.Tests/RestaurantBooking.Tests.csproj` — add `Microsoft.AspNetCore.Mvc.Testing` package reference, `System.Net.Http.Json` implicit import
- `backend/RestaurantBooking.Tests/ApiIntegrationTests.cs` — test class using `WebApplicationFactory<Program>`:
  - `Public_endpoints_are_accessible_unauthenticated()` — GET restaurants, GET availability (200), no auth
  - `Booking_creation_requires_authentication()` — POST /api/bookings without cookie returns 401
  - `Authenticated_user_can_create_booking()` — login, create booking, verify 201 + booking has userId
  - `User_sees_only_own_bookings()` — two users, each creates a booking, each GETs only their own
  - `Invalid_party_size_returns_400()` — authenticated POST with partySize=0
  - `Invalid_time_returns_400()` — authenticated POST with non-seating time
  - `Overlapping_reservation_returns_409()` — two bookings at same table/time
  - `Unknown_restaurant_returns_404()` — POST with invalid restaurantId
  - `CSRF_protection_on_post()` — POST without antiforgery token returns 400
  - `Login_with_wrong_password_returns_401()` — invalid credentials
  - `Register_then_login_flow()` — register, login, verify `me` endpoint
  - `OpenAPI_document_is_accessible()` — GET /openapi/v1.json returns 200 with auth endpoints
- `backend/RestaurantBooking.Tests/AuthDomainTests.cs` — pure domain tests for user-related rules:
  - `Booking_has_user_id_when_created_with_user()`
  - `User_bookings_filter_correctly()`

**Key dependencies**: `Microsoft.AspNetCore.Mvc.Testing`, `xunit`

**Verification**: `dotnet test` — all new tests pass alongside existing ones.

---

### Slice 3: OpenAPI Update & Client Regeneration

**Goal**: Update OpenAPI schema to include auth endpoints and user-scoped bookings, regenerate typed client with TanStack Query hooks.

**Files to change**:
- `frontend/openapi/restaurant-booking.json` — add:
  - `/api/auth/register` (POST, request body `RegisterRequest`, responses 201/400)
  - `/api/auth/login` (POST, request body `LoginRequest`, responses 200/401)
  - `/api/auth/logout` (POST, responses 200)
  - `/api/auth/me` (GET, responses 200/401)
  - `/api/auth/csrf` (GET, returns token)
  - Update `GET /api/bookings` to return user-scoped bookings (add `security: [{cookieAuth: []}]`)
  - Add `securitySchemes: { cookieAuth: { type: apiKey, in: cookie, name: .AspNetCore.Cookies } }` or equivalent marker
  - Add `UserInfo` and `LoginRequest`/`RegisterRequest` schemas
  - Add 401 responses where auth is required
- `frontend/orval.config.ts` — change client from `"fetch"` to `"react-query"` to generate TanStack Query hooks:
  ```ts
  output: {
    target: "./src/generated/booking-client.ts",
    client: "react-query",
    clean: true,
    prettier: true,
    override: {
      query: {
        useQuery: true,
        useSuspenseQuery: false,
      },
      mutation: {
        useMutation: true,
      },
    },
  },
  ```
- `frontend/src/generated/booking-client.ts` — regenerated by `npm run generate:api`

**Verification**: `npm run generate:api` succeeds; generated file has `useListRestaurants`, `useCreateBooking`, etc. hooks; `npm run build` passes with new imports.

---

### Slice 4: Frontend Auth UI

**Goal**: Add login, registration, logout, and auth state management. Refactor booking to require auth and show user history.

**Files to change/create**:
- `frontend/src/lib/api.ts` — shared fetch wrapper that includes `credentials: "include"` and CSRF header from `/api/auth/csrf` for mutations
- `frontend/src/hooks/use-auth.ts` — TanStack Query hook wrapping generated `useAuthMe`, `useAuthLogin`, `useAuthRegister`, `useAuthLogout`; exposes `user`, `isAuthenticated`, `isLoading`, `login`, `register`, `logout`
- `frontend/src/components/auth/AuthDialog.tsx` — login/register tabbed dialog using shadcn Card, Field, Input, Button patterns:
  - Email + password fields
  - Toggle between Login/Register
  - Error display for 401/validation
  - Loading state with spinner
  - Calls auth hooks on submit
- `frontend/src/components/auth/UserMenu.tsx` — dropdown/button showing current user email and logout action
- `frontend/src/components/booking/BookingForm.tsx` — extracted from `App.tsx`:
  - Date, party size, time slot picker, confirmation message
  - Uses generated `useListAvailableSlots` and `useCreateBooking` hooks
  - Shows "Login to book" prompt when unauthenticated
  - CSRF token automatically included via shared fetch wrapper
- `frontend/src/components/booking/BookingHistory.tsx` — extracted existing bookings display:
  - Uses generated `useListBookings` hook (now user-scoped)
  - Shows restaurant name, date, time, party size
  - Empty state: "No bookings yet"
  - Loading skeleton
- `frontend/src/App.tsx` — refactored / imperatively restructured:
  - Add `AuthProvider` (React context) around app
  - Top nav bar: logo/brand, auth status (login button or user menu)
  - Restaurant selection remains (public)
  - Booking section: conditionally renders BookingForm (if auth) or login prompt
  - BookingHistory always visible below
  - Remove hand-rolled fetch wrappers where generated hooks exist
  - Keep existing visual language (cards, badges, shadcn components)
- `frontend/src/main.tsx` — wrap with `AuthProvider`

**UI Polish Improvements**:
- Add top navigation bar with brand and auth controls (separates concerns from booking form)
- Add tab-like sections for "Book a Table" and "My Bookings" (vertical navigation)
- Loading skeletons for restaurant cards and booking history
- Better empty/error states with icons (use existing lucide-react icons)
- Responsive: mobile-first with hamburger menu for nav

**Verification**: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run deadcode` all pass.

---

### Slice 5: Frontend Tests

**Goal**: Add Vitest + React Testing Library tests for auth and booking flows.

**Files to create/change**:
- `frontend/package.json` — add dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, `msw`
- `frontend/vitest.config.ts` — Vitest config with jsdom environment
- `frontend/src/test/setup.ts` — testing-library setup, MSW server setup
- `frontend/src/test/handlers.ts` — MSW handlers for auth and booking endpoints
- `frontend/src/test/test-utils.tsx` — render wrapper with QueryClientProvider, AuthProvider, MSW
- `frontend/src/__tests__/auth.test.tsx` — tests:
  - `renders_login_button_when_unauthenticated`
  - `login_dialog_shows_email_and_password_fields`
  - `login_submits_and_shows_user_menu_on_success`
  - `login_shows_error_on_invalid_credentials`
  - `register_then_login_works`
  - `logout_clears_user_state`
- `frontend/src/__tests__/booking.test.tsx` — tests:
  - `unauthenticated_user_sees_login_prompt_instead_of_booking_form`
  - `authenticated_user_can_select_restaurant_and_view_availability`
  - `authenticated_user_can_create_booking_and_see_confirmation`
  - `error_message_displayed_on_booking_conflict`
  - `booking_history_shows_user_bookings`

**Key dependencies**: `vitest`, `@testing-library/react`, `msw`

**Verification**: `npx vitest run` passes.

---

### Slice 6: README & Polish

**Goal**: Update README with auth instructions, demo credentials, CSRF behavior notes.

**Files to change**:
- `README.md` — add sections:
  - **Authentication**: local email/password via ASP.NET Core Identity (in-memory)
  - **Demo user**: `demo@example.com` / `Demo123!`
  - **CSRF**: SPA fetches token from `/api/auth/csrf`, sends via `X-CSRF-TOKEN` header on mutations; antiforgery validates server-side
  - **CORS**: configured for `http://localhost:5173` with credentials
  - **Cookie auth**: HTTP-only `.AspNetCore.Cookies`; no localStorage tokens
  - Update run commands to reference auth flow
  - Update `Behavior Covered` to list auth and user-scoping

---

## Order of Execution

1. **Slice 1**: Backend auth infrastructure (Identity, cookies, CSRF, user-scoped bookings)
2. **Slice 2**: Backend integration tests (verifies Slice 1)
3. **Slice 3**: OpenAPI update + client regeneration (enables TanStack Query hooks)
4. **Slice 4**: Frontend auth UI (login, registration, protected booking, history)
5. **Slice 5**: Frontend tests (verifies Slice 4)
6. **Slice 6**: README update

Each slice is independently testable. Backend slices 1-2 should be complete and passing before frontend work begins.

## Key Design Decisions

- **Identity store**: Custom in-memory `IUserStore<IdentityUser>` + `IRoleStore<IdentityRole>` using `ConcurrentDictionary` — no EF Core, no real database. Keeps existing in-memory persistence pattern.
- **Booking-user association**: Add `UserId` field to `Booking` domain record. Store verifies ownership on `GET /api/bookings`.
- **CSRF flow**: Browser gets token via `GET /api/auth/csrf` (reads antiforgery cookie set by server). SPA includes token in `X-CSRF-TOKEN` header on POST/PUT/DELETE. Server validates via `[ValidateAntiForgeryToken]` attribute.
- **TanStack Query migration**: Orval `react-query` client generates `useQuery`/`useMutation` hooks. Replace hand-rolled `useQuery` + generated fetch calls with direct hook usage where supported. Thin mutation wrappers for error handling.
- **No external services**: Everything in-memory, self-contained. No OAuth, no external providers, no secrets.
- **Domain purity preserved**: `BookingRules` remains pure — auth checks happen in the imperative shell (Program.cs endpoints, BookingStore), not in domain logic.
