# Restaurant Booking — Authenticated Accounts Implementation Plan

## Existing Architecture (Baseline)

- **Backend**: .NET 10 minimal Web API, in-memory `BookingStore` singleton, functional-core (`BookingRules` in `Domain.cs`) + imperative-shell (`Program.cs`). 4 endpoints: `GET /api/restaurants`, `GET /api/bookings`, `GET /api/restaurants/{restaurantId}/availability`, `POST /api/bookings`. Result-style errors (`BookingResult<T>`) mapped to 400/404/409. Seeded 3 restaurants with tables.
- **Frontend**: Vite React 19 SPA. Tailwind CSS 4 + shadcn/ui-style components. TanStack Query 5 wrapping Orval-generated fetch client (`client: "fetch"`). Vite proxies `/api` to backend. All logic in single `App.tsx`.
- **OpenAPI**: Hand-written spec in `frontend/openapi/restaurant-booking.json` mirrors backend. Orval generates typed fetch functions. Backend also exposes live `/openapi/v1.json`.
- **Tests**: `BookingRulesTests.cs` — 8 domain-only tests. No HTTP/API integration tests. No frontend tests.
- **Build checks**: `TreatWarningsAsErrors` on both projects. Frontend: `tsc -b`, eslint, prettier --check, knip deadcode.

## Vertical Slices (Implementation Order)

Each slice delivers a complete vertical capability (backend + OpenAPI + frontend + tests) before moving to the next.

### Slice 1: Backend Auth Infrastructure + Seeded Users

**Goal**: Add ASP.NET Core Identity with cookie auth, CSRF protection, and seeded demo users. Preserve all existing behavior for unauthenticated reads.

**Backend changes:**
- Add NuGet packages to `RestaurantBooking.Api.csproj`: `Microsoft.AspNetCore.Identity`, `Microsoft.AspNetCore.Identity.EntityFrameworkCore` (or just the Identity package — use in-memory store, no EF Core).
- Add `User` class extending `IdentityUser` with minimal fields. Use `IdentityUser` directly for simplicity.
- Register Identity services in `Program.cs` with cookie authentication:
  - `AddIdentity<IdentityUser, IdentityRole>()` or `AddIdentityCore<IdentityUser>()` + `AddSignInManager` + `AddCookie`
  - Configure cookie: `LoginPath = "/api/auth/login"` (or empty for API), `HttpOnly = true`, `SameSite = Strict`, `SecurePolicy = None` for local HTTP dev.
  - Use in-memory EF Core store or a simple `IUserStore` implementation. Prefer minimal EF Core in-memory DB for Identity stores since Identity requires `UserStore`/`RoleStore`.
- Add anti-forgery (`AddAntiforgery()`). Configure header name as `X-CSRF-TOKEN`.
- Seed 2 demo users on startup in program init:
  - `demo@example.com` / `Demo1234!`
  - `guest@example.com` / `Guest1234!`
- Protect `POST /api/bookings` with `[Authorize]` equivalent (for minimal APIs, use `.RequireAuthorization()`).
- Update `BookingStore.TryCreate` to accept `userId` and store it on `Booking` record.
- Add `userId` field to `Booking` domain record and `CreateBookingRequest`.
- Add `GET /api/bookings/mine` endpoint returning bookings scoped to the authenticated user.
- Add `POST /api/auth/register` endpoint: accepts `{ email, password }`, creates user, signs in, returns 201.
- Add `POST /api/auth/login` endpoint: accepts `{ email, password }`, signs in with cookie, returns 200 with user info.
- Add `POST /api/auth/logout` endpoint: signs out, clears cookie, returns 200.
- Add `GET /api/auth/me` endpoint: returns current user info or 401.
- Add `GET /api/antiforgery/token` endpoint: returns a CSRF token (for SPA to fetch).
- Configure CORS: replace `AllowAnyOrigin()` with explicit origin (`http://localhost:5173`), `AllowCredentials()`, `AllowAnyMethod()`, `AllowAnyHeader()`.
- Add `app.UseAuthentication()` and `app.UseAuthorization()` (before route mapping).
- Add `app.UseAntiforgeryValidation()` (or validate manually on POST endpoints that need CSRF).
- Map error responses for auth failures: 401 for unauthenticated, 403 for forbidden.
- Keep existing restaurant/availability endpoints working.

**Domain changes (`Domain.cs`):**
- Add `string? UserId` to `Booking` record.
- Add `string? UserId` to `CreateBookingRequest` (set by shell from authenticated user).
- Keep pure functions unchanged; `BookingRules` only uses `UserId` for identity, not business logic.

**OpenAPI changes (`frontend/openapi/restaurant-booking.json`):**
- Add auth paths: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`.
- Add antiforgery token path: `/api/antiforgery/token`.
- Add `GET /api/bookings/mine` path.
- Add `401` and `403` responses to `POST /api/bookings`.
- Add security scheme: `cookieAuth` with `type: apiKey`, `in: cookie`, `name: .AspNetCore.Identity.Application`.
- Add security requirement `[{ "cookieAuth": [] }]` to booking creation and mine endpoints.
- Add `userId` to `Booking` schema (nullable for backward compat).

**Test changes:**
- Add `RestaurantBooking.Tests/AuthTests.cs`:
  - Unit tests for auth-related domain logic (if any).
- Add `RestaurantBooking.Tests/ApiIntegrationTests.cs`:
  - Use `Microsoft.AspNetCore.Mvc.Testing` (WebApplicationFactory) with in-memory test server.
  - Test: unauthenticated `POST /api/bookings` returns 401.
  - Test: authenticated `POST /api/bookings` creates booking with userId.
  - Test: `GET /api/bookings/mine` returns only current user's bookings.
  - Test: `GET /api/bookings/mine` for user with no bookings returns empty.
  - Test: user A cannot see user B's bookings.
  - Test: login with valid credentials returns 200 + sets cookie.
  - Test: login with invalid password returns 401.
  - Test: register creates user and returns 201.
  - Test: invalid party size still returns 400 (preserved behavior).
  - Test: overlapping reservation still returns 409 (preserved behavior).
  - Test: OpenAPI document is accessible at `/openapi/v1.json`.
- Add `Microsoft.AspNetCore.Mvc.Testing` package reference to test project.

### Slice 2: Frontend Auth UI + CSRF + TanStack Query Migration

**Goal**: Add login, register, logout, auth state to the React SPA. Require auth for booking. Use generated TanStack Query hooks. Polish UI.

**Orval config changes:**
- Switch `orval.config.ts` from `client: "fetch"` to add TanStack Query output alongside fetch:
  - Keep the fetch functions for low-level use.
  - Add `override` config to generate `useQuery`/`useMutation` hooks for the operations.
  - Alternatively, generate a second client file with `client: "react-query"`.
  - Simpler: add a second output in orval config targeting same spec with `client: "react-query"`.

**Frontend code changes:**
- Create `src/hooks/use-auth.tsx`:
  - `AuthProvider` component with context: `{ user, isAuthenticated, isLoading, login, register, logout, fetchCsrfToken }`.
  - On mount, call `GET /api/auth/me` to check session. If 401, user is not authenticated.
  - On mount, call `GET /api/antiforgery/token` and cache the token.
  - `login(email, password)`: POST `/api/auth/login` with CSRF header, then refresh user state.
  - `register(email, password)`: POST `/api/auth/register` with CSRF header, then refresh user state.
  - `logout()`: POST `/api/auth/logout` with CSRF header, clear user state.
  - Provide `csrfToken` and `csrfHeaderName` to consumers.

- Create `src/components/auth/login-form.tsx`:
  - Card with email/password fields, submit button.
  - Links to switch between login/register.
  - Error display for invalid credentials.
  - Uses generated TanStack Query mutation (if available) or typed fetch + useMutation.

- Create `src/components/auth/auth-header.tsx`:
  - Shows user email and logout button when authenticated.
  - Shows "Sign in" / "Register" buttons when not authenticated.
  - Responsive, consistent with existing visual language.

- Refactor `App.tsx`:
  - Split into component files (at minimum separate `RestaurantList`, `BookingForm`, `BookingHistory`, `ConfirmationCard`).
  - Wrap with `AuthProvider`.
  - Show auth header in the main layout.
  - Require authentication before showing the booking form. If not authenticated, show a message like "Sign in to book a table" with a link/button.
  - Use `csrfToken` from auth context in `POST /api/bookings` via `options.headers`.
  - Replace `listBookings` with `GET /api/bookings/mine` for the user's own bookings (when authenticated).
  - Keep `listBookings` for the global list (readable by anyone).
  - Use generated TanStack Query hooks from the Orval output for restaurant list, availability, bookings, and booking mutations.

- UI Polish:
  - Add a navigation/tab bar with "Restaurants", "My Bookings" sections.
  - Improve empty states (better copy, icons).
  - Add loading skeletons for restaurant cards and booking list.
  - Add transition animations for booking confirmation.
  - Improve responsive layout for mobile.
  - Add form validation feedback (inline errors instead of just bottom message).
  - Preserve existing warm color palette and typography.

**Generate TanStack Query hooks:**
- Update `orval.config.ts` to output a second file (e.g., `src/generated/booking-hooks.ts`) with `client: "react-query"`.
- Wire generated hooks into components.
- Fallback: if Orval react-query output has issues, wrap generated fetch functions in thin TanStack Query `useQuery`/`useMutation` calls in a dedicated hooks file.

### Slice 3: Backend Tests — HTTP/API Coverage

**Goal**: Add HTTP-level integration tests for all existing and new endpoints.

**Tests to add (in `ApiIntegrationTests.cs`):**

Existing behavior (preserve):
- `GET /api/restaurants` returns 200 with 3 restaurants.
- `GET /api/bookings` returns 200 (empty initially).
- `GET /api/restaurants/{id}/availability` with valid params returns 200.
- `GET /api/restaurants/{id}/availability` with unknown restaurant returns 404.
- `GET /api/restaurants/{id}/availability` with invalid party size returns 400.
- `GET /api/restaurants/{id}/availability` with past date returns 400.
- `POST /api/bookings` with valid data returns 201.
- `POST /api/bookings` with invalid party size returns 400.
- `POST /api/bookings` with invalid time returns 400.
- `POST /api/bookings` with unknown restaurant returns 404.
- `POST /api/bookings` with overlapping returns 409.
- `POST /api/bookings` adjacent non-overlapping succeeds.
- `GET /api/bookings` shows created booking.
- OpenAPI endpoint `/openapi/v1.json` returns valid JSON with all paths.

Auth behavior:
- `POST /api/bookings` without auth cookie returns 401.
- `POST /api/bookings` with auth cookie succeeds and stores userId.
- `GET /api/bookings/mine` without auth returns 401.
- `GET /api/bookings/mine` with auth returns user's bookings only.
- `POST /api/auth/register` creates user, returns 201.
- `POST /api/auth/login` with valid creds returns 200, sets cookie.
- `POST /api/auth/login` with invalid creds returns 401.
- `POST /api/auth/logout` clears session.
- `GET /api/auth/me` returns user info when authenticated, 401 when not.
- Two users cannot see each other's private bookings.

### Slice 4: Frontend Tests — UI/Integration Coverage

**Goal**: Add focused frontend tests for auth flows and booking flows.

**Setup:**
- Add Vitest + React Testing Library as dev dependencies.
- Add `@testing-library/jest-dom` for DOM matchers.
- Configure vitest with jsdom environment.
- Add test scripts to `package.json`.

**Tests to add:**

Auth flows:
- `LoginForm` renders email/password fields and submit button.
- `LoginForm` shows error for invalid credentials (mock API).
- `LoginForm` calls onSuccess callback after successful login.
- `RegisterForm` renders and submits correctly.
- `AuthHeader` shows "Sign in" when unauthenticated.
- `AuthHeader` shows user email and logout when authenticated.

Booking flows:
- `BookingForm` shows "Sign in to book" when unauthenticated.
- `BookingForm` renders date, party size, guest name, email fields when authenticated.
- `SlotPicker` renders available time slots.
- `SlotPicker` shows loading state.
- `SlotPicker` shows error state.
- `BookingForm` shows confirmation card after successful booking.
- `BookingForm` shows error message for API errors (409 conflict, 400 validation).
- `ExistingBookings` renders booking list for authenticated user.
- `ExistingBookings` shows empty state when no bookings.

Component structure:
- Test `RestaurantCard` selection behavior.
- Test form validation (required fields).

### Slice 5: Polish, README, and Quality Gates

**Goal**: Ensure all checks pass, update docs, verify end-to-end.

- Update `README.md`:
  - Document auth setup: seeded users with credentials.
  - Document CSRF behavior: SPA fetches token from `/api/antiforgery/token` and sends it as `X-CSRF-TOKEN` header.
  - Document new endpoints: `/api/auth/*`, `/api/antiforgery/token`, `/api/bookings/mine`.
  - Update run instructions if changed.
  - Document demo users.

- Verify backend:
  - `dotnet build RestaurantBooking.slnx` passes with TreatWarningsAsErrors.
  - `dotnet test RestaurantBooking.slnx --no-build` passes.
  - `dotnet format RestaurantBooking.slnx --verify-no-changes` passes.

- Verify frontend:
  - `npm install` succeeds.
  - `npm run generate:api` regenerates without errors.
  - `npm run build` (includes generate:api + tsc -b + vite build).
  - `npm run typecheck` passes.
  - `npm run lint` passes.
  - `npm run format:check` passes.
  - `npm run deadcode` passes.

- Final cleanup:
  - Remove dead code or unused exports.
  - Ensure all imports are used.
  - Run all scripts in the documented order.

## Key Design Decisions

1. **Identity store**: Use EF Core in-memory database provider for Identity stores (`UserStore`, `RoleStore`). This avoids implementing custom `IUserStore`/`IUserRoleStore`/`IUserPasswordStore` from scratch while staying lightweight and local-dev-friendly. Add `Microsoft.AspNetCore.Identity.EntityFrameworkCore` and `Microsoft.EntityFrameworkCore.InMemory` packages.

2. **CSRF approach**: Use ASP.NET Core's built-in antiforgery middleware. The SPA fetches tokens from a dedicated `GET /api/antiforgery/token` endpoint (no cookies required for this GET since it sets its own token cookie). Mutations include the token in `X-CSRF-TOKEN` header. For the auth endpoints (login/logout/register), we may need to configure antiforgery to not validate those since they don't have a prior session — instead, require the CSRF header from the initial token fetch.

3. **Orval TanStack Query**: Orval supports `client: "react-query"` for generating `useQuery`/`useMutation`. We'll add a second output block. If the generated output has issues with the current OpenAPI structure, we'll fall back to wrapping generated fetch functions in thin, typed TanStack Query hooks (e.g., `useListRestaurants()`, `useCreateBooking()`) in a dedicated `src/hooks/booking-queries.ts` file. This avoids stringly-typed fetch wrappers — the generated types are used throughout.

4. **Cookie config**: `SameSite=Lax` (not Strict) for practical SPA usage (allows GET navigation to maintain session). `HttpOnly=true`. `Secure=false` for localhost HTTP. Cookie name: `.AspNetCore.Identity.Application` (Identity default).

5. **CORS**: Explicit origin `http://localhost:5173` with `AllowCredentials()`. No wildcard origins when credentials are used.

6. **Booking ownership**: The `Booking` record gets a `UserId` property. The backend shell (`Program.cs`) extracts the user ID from `HttpContext.User` and passes it to the store, which surfaces it on the `Booking`. The functional core (`BookingRules`) receives `UserId` but does not use it for business logic — it's pure pass-through for identity.

## File Change Summary

### New files (backend):
- `backend/RestaurantBooking.Api/Models/` — User-related models (LoginRequest, RegisterRequest, UserInfo).
- `backend/RestaurantBooking.Tests/ApiIntegrationTests.cs` — HTTP-level integration tests.
- `backend/RestaurantBooking.Tests/CustomWebApplicationFactory.cs` — Test server factory.

### Modified files (backend):
- `backend/RestaurantBooking.Api/Program.cs` — Add Identity, auth endpoints, antiforgery, CORS, auth middleware.
- `backend/RestaurantBooking.Api/Domain.cs` — Add `UserId` to `Booking`, `CreateBookingRequest`.
- `backend/RestaurantBooking.Api/BookingStore.cs` — Accept and store `UserId` on booking creation.
- `backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj` — Add new package references.
- `backend/RestaurantBooking.Tests/RestaurantBooking.Tests.csproj` — Add test dependencies.

### Modified files (frontend):
- `frontend/openapi/restaurant-booking.json` — Add auth endpoints, security scheme, user-scoped paths.
- `frontend/orval.config.ts` — Add react-query client output.
- `frontend/src/App.tsx` — Refactor: split components, add auth gating, use generated hooks.
- `frontend/src/main.tsx` — Add AuthProvider wrapping.
- `frontend/package.json` — Add vitest + testing-library deps.
- `frontend/vite.config.ts` — May need test config.

### New files (frontend):
- `frontend/src/hooks/use-auth.tsx` — Auth context, provider, hooks.
- `frontend/src/components/auth/login-form.tsx` — Login/register form.
- `frontend/src/components/auth/auth-header.tsx` — Header with user info / auth actions.
- `frontend/src/components/restaurant-list.tsx` — Extracted from App.tsx.
- `frontend/src/components/booking-form.tsx` — Extracted from App.tsx.
- `frontend/src/components/booking-history.tsx` — Extracted from App.tsx.
- `frontend/src/components/confirmation-card.tsx` — Extracted from App.tsx.
- `frontend/src/components/slot-picker.tsx` — Extracted from App.tsx.
- `frontend/src/generated/booking-hooks.ts` — Generated TanStack Query hooks.
- `frontend/src/__tests__/` — Frontend test files.
- `frontend/vitest.config.ts` — Vitest configuration.
- `frontend/src/test-setup.ts` — Test setup (jsdom matchers).

### Modified files (root):
- `README.md` — Update with auth docs, demo credentials, CSRF info.

## Risk Mitigation

- **EF Core InMemory + Identity**: May require schema migrations even with in-memory. Mitigation: call `Database.EnsureCreated()` on startup.
- **Orval react-query output**: May not generate perfectly matching hooks for our API shape. Mitigation: test early in Slice 2; fall back to manual wrapping if needed.
- **CSRF token flow**: Antiforgery requires the token cookie and header to match. The SPA must fetch the token before any mutation. Mitigation: fetch token on app load and after login.
- **Test infrastructure**: WebApplicationFactory with auth may need cookie handling. Mitigation: use `HttpClient` with cookie container, manually set cookie from login response.

## Estimated Effort

- Slice 1 (Auth backend): ~20 min
- Slice 2 (Frontend auth + TanStack Query): ~20 min
- Slice 3 (Backend HTTP tests): ~10 min
- Slice 4 (Frontend tests): ~10 min
- Slice 5 (Polish + README + gates): ~10 min

Total: ~70 min. Slightly above target; can compress Slice 3+4 if results from earlier slices produce the necessary coverage organically.
