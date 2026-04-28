# Restaurant Booking — Authenticated Booking Accounts Plan

## Architecture Summary (Preserved)

| Layer | Technology | Pattern |
|-------|-----------|---------|
| Backend | .NET 10 minimal API, in-memory store | Functional Core (pure `Domain.cs`, `BookingRules`) + Imperative Shell (`Program.cs`, `BookingStore`) |
| Frontend | Vite + React 19 + TanStack Query | Imperative Shell (`App.tsx`) consuming Orval-generated typed fetch client |
| API Client | Orval from checked-in `openapi/restaurant-booking.json` | `client: "fetch"` generating typed functions + response types |
| UI | Tailwind CSS v4, shadcn-style source components | Class-variance-authority + cn() utility |
| Tests | xUnit domain-only tests (`BookingRulesTests.cs`) | No HTTP integration tests, no frontend tests |

---

## Slice 1: Backend Auth Foundation

**Goal:** Add cookie-based authentication with in-memory user store without disrupting existing endpoints.

### Files to create/modify

1. **`backend/RestaurantBooking.Api/Auth/UserStore.cs`** (new — Imperative Shell)
   - In-memory concurrent dictionary of `{email → (userId, passwordHash)}`
   - Thread-safe methods: `CreateUser(email, password)`, `ValidateCredentials(email, password)`, `GetUser(userId)`
   - Password hashing via `Microsoft.AspNetCore.Identity.PasswordHasher<string>`
   - Seed one demo user at startup (`demo@example.com` / `Demo1234!`)

2. **`backend/RestaurantBooking.Api/Auth/AuthEndpoints.cs`** (new — Imperative Shell)
   - `POST /api/auth/register` — validates email format, password strength, duplicate; creates user; signs in via cookie
   - `POST /api/auth/login` — validates credentials; signs in via cookie
   - `POST /api/auth/logout` — signs out
   - `GET /api/auth/me` — returns current user info (or 401 if unauthenticated)
   - Static mapping method `MapAuthEndpoints(IEndpointRouteBuilder)`

3. **`backend/RestaurantBooking.Api/Auth/AuthDtos.cs`** (new — Functional Core)
   - Records: `LoginRequest`, `RegisterRequest`, `UserResponse(id, email)`
   - `AuthResult<T>` following the existing `BookingResult<T>` pattern

4. **`backend/RestaurantBooking.Api/Program.cs`** (modify)
   - Add `AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(...)` with explicit `Cookie.Name`, `ExpireTimeSpan`, `SlidingExpiration`
   - Add `AddAntiforgery()` with explicit header name `X-CSRF-TOKEN`
   - Add `UseAuthentication()` and `UseAntiforgery()` middleware (order: UseCors → UseAuthentication → UseAntiforgery → MapOpenApi → endpoint mapping)
   - Replace `AllowAnyOrigin` CORS with explicit origins (`http://localhost:5173`) + `AllowCredentials()`
   - Add `RequireAuthorization()` / `RequireCors()` per route group as needed
   - Add `GET /api/auth/csrf` endpoint returning antiforgery token set via cookie + header
   - Call `MapAuthEndpoints(api)` for auth routes
   - Register `UserStore` as singleton

5. **`backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj`** (modify)
   - Add `Microsoft.AspNetCore.Identity` package reference (for `PasswordHasher`)

6. **`backend/RestaurantBooking.Api/Domain.cs`** (modify)
   - Add `string? UserId` property to `Booking` record (nullable for backward compat; non-null for new bookings)
   - Add `UserId` to `CreateBookingRequest` (nullable/optional for backward compat, populated from auth context)

### Validation rules
- Email: non-empty, contains `@`, ≤ 256 chars
- Password: ≥ 8 chars, ≥ 1 uppercase, ≥ 1 digit, ≥ 1 non-alphanumeric (matching default Identity rules)
- Duplicate email registration returns 409 Conflict
- Invalid login returns 401 with a generic "Invalid email or password" message

### Key decisions
- Cookie name: `.RestaurantBooking.Auth`
- CSRF header: `X-CSRF-TOKEN` (ASP.NET Core default)
- Auth cookie: HttpOnly, SameSite=Lax, Secure=false (local dev)
- Keep existing booking endpoints functional; protect `POST /api/bookings` with auth in Slice 2

---

## Slice 2: Protect Booking Creation & Add User History

**Goal:** Require auth for booking creation, associate bookings with users, and add user-scoped history endpoint.

### Files to modify

1. **`backend/RestaurantBooking.Api/Program.cs`** (modify)
   - Wrap `POST /api/bookings` route with `.RequireAuthorization()`
   - Add `[ValidateAntiForgeryToken]` filter equivalent (validate CSRF on state-changing POST)
   - Add `GET /api/bookings/mine` endpoint — returns only bookings where `UserId == current user`
   - Extract current user ID from `HttpContext.User` claims in booking creation
   - Keep existing `GET /api/bookings` and `GET /api/restaurants` public (no auth required)

2. **`backend/RestaurantBooking.Api/BookingStore.cs`** (modify)
   - Add `TryCreate(CreateBookingRequest, DateOnly, string userId)` overload or modify existing
   - Add `FindByUser(string userId)` method returning bookings filtered by user
   - Lock is already in place — preserves atomic conflict check

3. **`backend/RestaurantBooking.Api/Domain.cs`** (modify)
   - Add `string UserId` to `Booking` record (non-nullable — existing seed data will be backfilled or treated as public)
   - `CreateBooking` pure function receives and passes through `userId`

### Auth boundaries
- Unauthenticated `POST /api/bookings` → 401
- Invalid/expired CSRF token on `POST /api/bookings` → 400 (antiforgery failure)
- `GET /api/bookings/mine` unauthenticated → 401
- `GET /api/bookings` remains public (shows all bookings — restaurant-level view)
- `GET /api/bookings/mine` authenticated → returns only that user's bookings

---

## Slice 3: OpenAPI Spec Update & Client Regeneration

**Goal:** Update the checked-in OpenAPI spec with auth endpoints and regenerated types.

### Files to modify

1. **`frontend/openapi/restaurant-booking.json`** (modify)
   - Add auth paths: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/csrf`
   - Add `GET /api/bookings/mine` path
   - Add `security: [{ cookieAuth: [] }]` to `POST /api/bookings` and `GET /api/bookings/mine`
   - Add `securitySchemes.cookieAuth` in components (type: apiKey, in: cookie)
   - Add `401` response to protected endpoints
   - Add schemas: `LoginRequest`, `RegisterRequest`, `UserResponse`

2. **`frontend/orval.config.ts`** (modify)
   - Switch from `client: "fetch"` to `client: "react-query"` to generate TanStack Query hooks
   - Or keep `fetch` + add `override` blocks to generate `useQuery`/`useMutation` hooks per operation
   - **Decision:** Use `client: "react-query"` with custom fetch mutator that attaches CSRF token and credentials → generates `useListRestaurants`, `useListBookings`, `useCreateBooking`, etc. hooks directly

3. **`frontend/src/generated/booking-client.ts`** (regenerated via `npm run generate:api`)
   - Now contains React Query hooks instead of raw fetch functions
   - Custom fetch instance configured with `credentials: "include"` and CSRF header injection

4. **`frontend/src/lib/api.ts`** (new — Imperative Shell)
   - Custom fetch mutator for Orval: reads CSRF token from cookie/header, attaches to requests
   - Configured as Orval's `override.fetch` or passed via mutator config

---

## Slice 4: Frontend Auth UI & CSRF Integration

**Goal:** Add login, register, logout, and authenticated state to the SPA without routing complexity.

### Files to create/modify

1. **`frontend/src/components/AuthDialog.tsx`** (new — Imperative Shell)
   - Tabbed dialog (Login / Register) using Card + Button + Input
   - Login form: email + password → calls `useLogin` mutation
   - Register form: email + password + confirm password → calls `useRegister` mutation
   - Error display for validation failures, 401, 409
   - On success: invalidate `["auth", "me"]` query

2. **`frontend/src/components/UserMenu.tsx`** (new — Imperative Shell)
   - Shows when authenticated: user email + Logout button
   - Shows when unauthenticated: "Sign in" button that opens AuthDialog
   - Uses `useQuery(["auth", "me"])` to fetch current user state

3. **`frontend/src/App.tsx`** (modify)
   - Extract stats header into `Header` component
   - Add `UserMenu` in the header area
   - Guard booking form submission: if not authenticated, show "Sign in to book" prompt + open AuthDialog
   - Add `Your Bookings` tab/section using `GET /api/bookings/mine`
   - Replace manual `useMutation(createBooking)` with generated `useCreateBooking` hook
   - Replace all manual `useQuery(listXxx)` with generated hooks
   - Add CSRF token fetch on mount (GET /api/auth/csrf → sets cookie + returns token for future requests)

4. **`frontend/src/main.tsx`** (modify)
   - Wrap app with an `AuthProvider` context that holds the CSRF token and triggers initial fetch

5. **`frontend/src/lib/auth.tsx`** (new — Imperative Shell)
   - `AuthProvider` context component
   - `useCsrfToken()` hook — fetches token on mount, provides it to mutation mutators
   - `useCurrentUser()` hook wrapping the generated `useAuthMe` query
   - On 401 responses from mutations, invalidate auth query (user becomes unauthenticated)

### UI Polish (existing issues to fix)
- Expand single-card layout into a slightly richer tabbed/sectioned experience
- Add a booking-history tab/panel showing user's past bookings in a table/list with better density
- Improve empty states with illustrations (use lucide icons)
- Add loading skeletons for availability and bookings sections
- Preserve existing color palette, typography, spacing

---

## Slice 5: Backend Tests

**Goal:** Add HTTP-level integration tests and auth-boundary tests.

### Test file: `backend/RestaurantBooking.Tests/ApiTests.cs` (new)

Uses `Microsoft.AspNetCore.Mvc.Testing` (add package reference to test project).

**Test categories:**

1. **Existing endpoint smoke tests** (preserve behavior)
   - `GET /api/restaurants` returns 3 seeded restaurants
   - `GET /api/bookings` returns empty list initially
   - `POST /api/bookings` creates a booking and returns 201
   - `GET /api/restaurants/{id}/availability` returns slots for valid query

2. **Error mapping tests** (existing issues to fix)
   - Unknown restaurant → 404 with ErrorResponse
   - Invalid party size (0, 9) → 400 with ErrorResponse
   - Past date → 400 with ErrorResponse
   - Invalid time → 400 with ErrorResponse
   - Overlapping reservation → 409 with ErrorResponse
   - No table for party size → 400 with ErrorResponse
   - Adjacent non-overlapping bookings succeed

3. **Auth boundary tests**
   - `POST /api/bookings` without auth cookie → 401
   - `POST /api/bookings` with valid auth → 201 (booking created with userId)
   - `GET /api/bookings/mine` without auth → 401
   - `GET /api/bookings/mine` with auth → returns only that user's bookings
   - `POST /api/auth/register` with valid data → 200 + auth cookie set
   - `POST /api/auth/register` with duplicate email → 409
   - `POST /api/auth/login` with wrong password → 401
   - `POST /api/auth/login` with valid credentials → 200 + auth cookie set
   - `GET /api/auth/me` authenticated → 200 with user info
   - `GET /api/auth/me` unauthenticated → 401

4. **User-scoped booking isolation**
   - User A creates a booking → User B's `GET /api/bookings/mine` does not include it
   - User A's `GET /api/bookings/mine` returns their own booking

5. **CSRF protection tests**
   - `POST /api/bookings` without CSRF token → 400 (antiforgery failure)
   - `POST /api/auth/login` bypasses CSRF (login endpoint exempt)

### Test infrastructure
- Add `Microsoft.AspNetCore.Mvc.Testing` package to test project
- Create `CustomWebApplicationFactory` that uses `Program.cs` with in-memory services
- Use `HttpClient` with `UseCookies = true` for cookie-based auth tests
- Helper to authenticate: POST to `/api/auth/login`, capture cookies, reuse on subsequent requests
- Helper to get CSRF token: GET `/api/auth/csrf`, capture header value

---

## Slice 6: Frontend Tests

**Goal:** Add focused UI/integration tests for core auth and booking flows.

### Test setup
- Add Vitest + React Testing Library + `@testing-library/jest-dom` as dev dependencies
- Create `frontend/vitest.config.ts` using jsdom environment
- Add `test` and `test:run` scripts to `package.json`

### Test files

1. **`frontend/src/__tests__/AuthDialog.test.tsx`** (new)
   - Renders login/register tabs
   - Login form submits email + password
   - Register form validates password match
   - Displays API error messages

2. **`frontend/src/__tests__/BookingForm.test.tsx`** (new)
   - Renders booking form fields
   - Shows "Sign in to book" when unauthenticated
   - Submits booking when authenticated
   - Displays availability slots
   - Shows error message on API failure
   - Shows confirmation card on success

3. **`frontend/src/__tests__/BookingHistory.test.tsx`** (new)
   - Shows user's bookings from `/api/bookings/mine`
   - Shows empty state when no bookings
   - Shows loading state

### Mocking strategy
- Mock Orval-generated hooks via `vi.mock("../generated/booking-client")`
- Mock `AuthProvider` for authenticated/unauthenticated states
- Test components in isolation with mocked data

---

## Slice 7: Quality Gates & Final Polish

**Goal:** Ensure all checks pass, update README, dead code cleanup.

### Backend
- `dotnet build` passes with warnings as errors
- `dotnet test` passes all tests
- `dotnet format --verify-no-changes` passes
- No unused imports or dead code in backend

### Frontend
- `npm install` succeeds
- `npm run generate:api` regenerates client successfully
- `npm run build` passes (tsc + vite build)
- `npm run typecheck` passes
- `npm run lint` passes (no warnings)
- `npm run format:check` passes
- `npm run deadcode` passes (update knip.json if needed for new files)

### README update
- Document seeded demo user credentials
- Document CSRF token flow (GET /api/auth/csrf → header for mutations)
- Document how to register/login via API/UI
- Document new endpoints: auth/*, bookings/mine
- Update run instructions if auth setup changes anything
- Document that SPA must fetch CSRF token before state-changing requests

### OpenAPI spec alignment
- Backend live OpenAPI doc at `/openapi/v1.json` matches `frontend/openapi/restaurant-booking.json`
- Verify by running backend → fetch spec → diff against checked-in copy

---

## Implementation Order

1. **Slice 1** — Backend auth foundation (UserStore + endpoints + cookie/CSRF middleware)
2. **Slice 2** — Protect bookings + user history (backend changes only)
3. **Slice 3** — OpenAPI spec update + Orval config migration to React Query hooks (no frontend code changes yet, just regenerate)
4. **Slice 5** — Backend tests (verify Slice 1+2 work correctly, including HTTP-level tests for existing behavior)
5. **Slice 4** — Frontend auth UI + migration to generated hooks (wire up the regenerated client)
6. **Slice 6** — Frontend tests
7. **Slice 7** — Quality gates, README, final verification

Dependencies: 1 → 2 → {3,5} → 4 → 6 → 7. Slice 5 can run in parallel with 3.

---

## Risk Notes

- **Orval `client: "react-query"` switch:** The generated output format changes significantly. Need to ensure all existing types/hooks in `App.tsx` are updated. If migration is too invasive, fall back to adding `override.query` blocks on the existing `fetch` client — this generates hooks alongside fetch functions but may require manual TanStack Query wiring.
- **CSRF with Vite proxy:** The frontend `fetch` calls go through Vite's dev proxy (`/api` → `http://localhost:5177`). The CSRF cookie must be set by the backend and sent back automatically via `credentials: "include"`. The SPA reads the CSRF token from a dedicated endpoint response and attaches it as a header for mutations.
- **In-memory user store:** No persistence across restarts. Acceptable for local dev/demo. Documented in README.
