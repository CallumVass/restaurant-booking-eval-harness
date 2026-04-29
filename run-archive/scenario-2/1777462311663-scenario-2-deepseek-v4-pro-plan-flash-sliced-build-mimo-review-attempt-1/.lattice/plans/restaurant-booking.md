# Restaurant Booking — Authenticated Accounts Implementation Plan

## Inventory: All Affected Surfaces

### Backend Endpoints (current)
| Method | Path | Auth? | Returns |
|--------|------|-------|---------|
| GET | /api/restaurants | No | Restaurant[] |
| GET | /api/bookings | No | Booking[] (all, no scope) |
| GET | /api/restaurants/{id}/availability | No | AvailabilitySlot[] or ErrorResponse |
| POST | /api/bookings | No | Booking (201) or ErrorResponse (400/404/409) |

### Backend Endpoints (post-change)
| Method | Path | Auth? | Returns |
|--------|------|-------|---------|
| GET | /api/restaurants | No (public) | Restaurant[] |
| GET | /api/bookings/mine | **Yes** | Booking[] (scoped to user) |
| GET | /api/restaurants/{id}/availability | No (public) | AvailabilitySlot[] or ErrorResponse |
| POST | /api/bookings | **Yes** | Booking (201) or ErrorResponse (400/404/409) |
| POST | /api/auth/register | No | 200/400 |
| POST | /api/auth/login | No | 200/401 |
| POST | /api/auth/logout | No | 200 |
| GET | /api/auth/me | No (returns null if anon) | UserInfo or null |
| GET | /api/antiforgery/token | No | token cookie |

### Domain Types (changes)
- `Booking` record: add `UserId` field
- `BookingResult<T>`: unchanged
- `BookingError` enum: unchanged
- `BookingRules`: unchanged (pure functions stay pure)

### OpenAPI Spec (changes)
- `restaurant-booking.json`: add auth paths, security schemes, update booking paths with auth requirement, add anti-forgery header parameter

### Frontend Surfaces
- `App.tsx`: restructure with auth-aware layout, routing/navigation
- `main.tsx`: add auth provider
- New: auth components (Login, Register)
- New: auth context/hooks
- `orval.config.ts`: change client to generate TanStack Query hooks
- Generated client: complete regeneration

---

## Slice 1: Backend HTTP Integration Tests (Existing Behavior)

**Goal**: Add ASP.NET Core `WebApplicationFactory`-based integration tests covering all existing endpoints and error mapping, without changing any production code.

**Files**:
- `backend/RestaurantBooking.Tests/HttpIntegrationTests.cs` (new)
- `backend/RestaurantBooking.Api/Program.cs` (add `public partial class Program` already exists)
- `backend/RestaurantBooking.Tests/RestaurantBooking.Tests.csproj` (add `Microsoft.AspNetCore.Mvc.Testing` package)

**Tasks**:
1. Add `Microsoft.AspNetCore.Mvc.Testing` NuGet reference to test project
2. Create `HttpIntegrationTests.cs` with a `WebApplicationFactory<Program>` fixture
3. Test: `GET /api/restaurants` returns 200 with 3 seeded restaurants
4. Test: `GET /api/bookings` returns 200 with empty array initially
5. Test: `GET /api/restaurants/{id}/availability` with valid params returns 200 with slots
6. Test: `GET /api/restaurants/{id}/availability` with unknown restaurant returns 404
7. Test: `GET /api/restaurants/{id}/availability` with invalid party size returns 400
8. Test: `GET /api/restaurants/{id}/availability` with past date returns 400
9. Test: `POST /api/bookings` with valid body returns 201
10. Test: `POST /api/bookings` with invalid party size returns 400 with ErrorResponse
11. Test: `POST /api/bookings` with unknown restaurant returns 404
12. Test: `POST /api/bookings` with overlapping reservation returns 409
13. Test: After creating a booking, `GET /api/bookings` includes it
14. Test: OpenAPI document is available at `/openapi/v1.json` and contains expected paths

**Verification**: `dotnet test RestaurantBooking.slnx --no-build` passes all 14+ tests

---

## Slice 2: Backend Authentication Foundation

**Goal**: Add ASP.NET Core Identity with cookie-based auth, HTTP-only cookies, CSRF protection, and local seeded users. No external providers.

**Files**:
- `backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj` (add packages)
- `backend/RestaurantBooking.Api/Program.cs` (add auth middleware, endpoints, CORS with credentials)
- `backend/RestaurantBooking.Api/AuthEndpoints.cs` (new — register, login, logout, me)
- `backend/RestaurantBooking.Api/Domain.cs` (add `UserInfo` record, `LoginRequest`, `RegisterRequest`)
- `backend/RestaurantBooking.Api/Seeder.cs` (new — seed demo users)
- `backend/RestaurantBooking.Api/appsettings.json` (add connection strings for in-memory Identity store)

**Tasks**:
1. Add NuGet packages: `Microsoft.AspNetCore.Identity.EntityFrameworkCore` (or just `Microsoft.AspNetCore.Identity` if using in-memory), `Microsoft.EntityFrameworkCore.InMemory`
2. Create `AppDbContext` with `IdentityUser` (EF Core InMemory for persistence)
3. Create `Seeder.cs` with demo users:
   - `alice@example.com` / `Demo1234!`
   - `bob@example.com` / `Demo1234!`
4. In `Program.cs`:
   - Register Identity services with cookie auth
   - Configure `ApplicationCookie` as HTTP-only, SameSite=Lax, secure for dev
   - Add `AddAntiforgery()` for CSRF protection
   - Configure CORS with `WithOrigins("http://localhost:5173")` (Vite dev) and `AllowCredentials()`
   - Map auth endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
   - Map `/api/antiforgery/token` endpoint that returns a CSRF cookie (for SPA to read)
5. Add `UserInfo` record: `{ Email, Id }` for `/api/auth/me`
6. Add `LoginRequest` and `RegisterRequest` records
7. Hash passwords; validate email format; reject duplicate emails

**Security invariants**:
- Auth cookie is HTTP-only (JavaScript cannot read it)
- CSRF token required for POST/PUT/DELETE endpoints
- No secrets in code; seeded passwords documented in README

**Verification**: `dotnet build RestaurantBooking.slnx` passes with TreatWarningsAsErrors

---

## Slice 3: Booking Association & Authorization

**Goal**: Associate bookings with authenticated users, protect booking creation, and scope booking history.

**Files**:
- `backend/RestaurantBooking.Api/Domain.cs` (add `UserId` to `Booking`)
- `backend/RestaurantBooking.Api/BookingStore.cs` (user-scoped operations)
- `backend/RestaurantBooking.Api/Program.cs` (update endpoints with auth)

**Tasks**:
1. Add `UserId` field to `Booking` record (nullable string, empty for legacy/anonymous)
2. Update `BookingStore.TryCreate` to accept a `userId` parameter
3. Add `BookingStore.GetBookingsForUser(string userId)` method
4. Change `POST /api/bookings`:
   - Require authorization (`RequireAuthorization()`)
   - Read `User.Identity.Name` (email) or `User.FindFirstValue(ClaimTypes.NameIdentifier)` for userId
   - Pass userId to `TryCreate`
   - Validate CSRF token via `IAntiforgery`
5. Replace `GET /api/bookings` with `GET /api/bookings/mine`:
   - Require authorization
   - Return only bookings where `Booking.UserId == currentUserId`
6. Remove the old unauthenticated `GET /api/bookings` endpoint (breaking change, documented)
7. Keep `GET /api/restaurants` and `GET /api/restaurants/{id}/availability` public (no auth)

**Security invariants**:
- Unauthenticated POST to `/api/bookings` returns 401 (not redirected)
- User A cannot see User B's bookings via `/api/bookings/mine`
- Booking domain logic (overlap detection, validation) is unchanged
- CSRF token is validated on booking creation

**Verification**: Backend auth tests (Slice 4) will cover these

---

## Slice 4: Backend Auth & Boundary Tests

**Goal**: Add tests for authentication boundaries, user-scoped booking history, invalid auth attempts, and CSRF.

**Files**:
- `backend/RestaurantBooking.Tests/AuthIntegrationTests.cs` (new)

**Tasks**:
1. Test: `POST /api/auth/register` with new email returns 200
2. Test: `POST /api/auth/register` with duplicate email returns 400
3. Test: `POST /api/auth/register` with invalid email returns 400
4. Test: `POST /api/auth/login` with valid credentials returns 200, sets auth cookie
5. Test: `POST /api/auth/login` with wrong password returns 401
6. Test: `POST /api/auth/login` with unknown email returns 401
7. Test: `GET /api/auth/me` when authenticated returns user info
8. Test: `GET /api/auth/me` when anonymous returns 200 with null body
9. Test: `POST /api/auth/logout` clears auth cookie, subsequent `/me` returns anonymous
10. Test: `POST /api/bookings` without auth returns 401
11. Test: `POST /api/bookings` without CSRF token returns 400
12. Test: `POST /api/bookings` with valid auth + CSRF returns 201
13. Test: `GET /api/bookings/mine` when authenticated returns user's bookings only
14. Test: User A's bookings do not appear in User B's `/api/bookings/mine`
15. Test: All existing domain validation errors still return correct HTTP codes under auth
16. Test: OpenAPI document includes auth endpoints and security schemes

**Verification**: `dotnet test RestaurantBooking.slnx --no-build` passes all tests

---

## Slice 5: Update OpenAPI Spec & Regenerate Frontend Client

**Goal**: Update the static OpenAPI spec to include auth endpoints and security schemes, then regenerate the TypeScript client with TanStack Query hooks.

**Files**:
- `frontend/openapi/restaurant-booking.json` (update with auth endpoints)
- `frontend/orval.config.ts` (change client type to react-query)
- `frontend/src/generated/booking-client.ts` (regenerated)
- `frontend/package.json` (add @tanstack/react-query to orval dependencies if needed)

**Tasks**:
1. Update `restaurant-booking.json`:
   - Add security scheme: `cookieAuth` (apiKey in cookie)
   - Add `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` paths
   - Add `/api/auth/me` path (returns `UserInfo` or null)
   - Add `/api/antiforgery/token` path
   - Add `UserInfo`, `LoginRequest`, `RegisterRequest` schemas
   - Mark `POST /api/bookings` and `GET /api/bookings/mine` as requiring auth
   - Remove old `GET /api/bookings` path (replaced by `/api/bookings/mine`)
   - Add `X-CSRF-TOKEN` header parameter for mutating endpoints
2. Update `orval.config.ts`:
   - Change `client: "fetch"` to `client: "react-query"` 
   - Add `override` to generate proper query/mutation hooks
   - Configure credentials: "include" for cookie-based auth
3. Run `npm run generate:api` to regenerate `booking-client.ts`
4. Verify generated output has:
   - `useListRestaurants`, `useListAvailableSlots` query hooks
   - `useCreateBooking` mutation hook
   - `useListBookingsMine` query hook
   - `useRegister`, `useLogin`, `useLogout` mutation hooks
   - `useGetAuthMe` query hook
   - CSRF header support

**Verification**: `npm run generate:api` completes; `npm run build` passes

---

## Slice 6: Frontend Auth UI

**Goal**: Add login, registration, logout, and authenticated-user state to the UI. Require login before booking.

**Files**:
- `frontend/src/App.tsx` (restructured with auth awareness)
- `frontend/src/components/AuthDialog.tsx` (new — login/register form)
- `frontend/src/components/NavHeader.tsx` (new — user greeting, logout)
- `frontend/src/hooks/useAuth.ts` (new — auth state hook)
- `frontend/src/main.tsx` (wrap in auth provider if needed)

**Tasks**:
1. Create `useAuth.ts` hook:
   - Calls `useGetAuthMe` to check auth state on mount
   - Exposes `{ user, isLoading, isAuthenticated, login, register, logout }`
   - Login/register mutations call generated hooks and invalidate auth query
2. Update `App.tsx`:
   - Show `NavHeader` with user greeting or "Login" button
   - When not authenticated, show login prompt before the booking form
   - When clicking "Confirm booking" without auth, show auth dialog instead of submitting
3. Create `AuthDialog.tsx`:
   - Tabbed or toggled login/register form
   - Email + password fields with validation
   - Error display for invalid credentials
   - Uses generated TanStack Query hooks directly
4. Create `NavHeader.tsx`:
   - App title/brand on left
   - User email + logout button on right when authenticated
   - Login button when anonymous
5. Replace manual fetch wrapper usage with generated TanStack Query hooks throughout:
   - `listRestaurants` → `useListRestaurants`
   - `listAvailableSlots` → `useListAvailableSlots`
   - `listBookings` → `useListBookingsMine`
   - `createBooking` → `useCreateBooking`
6. Configure all fetch calls to use `credentials: "include"` for cookies

**Verification**: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run deadcode` pass

---

## Slice 7: Frontend Booking History & UI Polish

**Goal**: Show authenticated user's booking history, improve UI polish, add frontend tests.

**Files**:
- `frontend/src/App.tsx` (update booking history display)
- `frontend/src/components/BookingHistory.tsx` (new — extracted booking history card)
- `frontend/src/components/BookingForm.tsx` (new — extracted booking form card)
- `frontend/src/components/RestaurantList.tsx` (new — extracted restaurant cards)
- `frontend/src/components/ConfirmationCard.tsx` (new — extracted confirmation)
- `frontend/src/App.test.tsx` (new — basic rendering/integration test)
- `frontend/package.json` (add test dependencies if needed)

**Tasks**:
1. Extract components from `App.tsx` for better organization and testability:
   - `RestaurantList` (restaurant cards + selection)
   - `BookingForm` (date, party, times, guest info, submit)
   - `BookingHistory` (existing bookings card)
   - `ConfirmationCard` (post-booking success)
2. Update booking history display:
   - Use `useListBookingsMine` (user-scoped)
   - Show "Your bookings" instead of "Existing bookings"
   - Empty state: "You haven't made any bookings yet."
   - Loading skeleton/spinner states
3. UI Polish:
   - Add smooth transitions between views
   - Improve mobile responsiveness of booking form
   - Add focus-visible indicators for keyboard navigation
   - Better visual hierarchy for error messages
   - Add restaurant image placeholder/gradient in cards
4. Frontend tests (using Vitest + React Testing Library if practical, or documented manual verification):
   - Test: App renders restaurant list
   - Test: Unauthenticated user sees login prompt
   - Test: Authenticated user sees booking form
   - Test: Form submission calls createBooking mutation
   - Test: API error messages display in the UI
   - Test: Booking confirmation card appears after successful booking
   - Test: Booking history shows user's bookings
5. Update `index.html` title to "Restaurant Booking"

**Verification**: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run deadcode` all pass

---

## Slice 8: Documentation & Cleanup

**Goal**: Update README with auth instructions, demo user credentials, CSRF behavior, and verify all quality gates.

**Files**:
- `README.md` (update)
- `.gitignore` (verify no generated files or secrets are committed)

**Tasks**:
1. Update README:
   - Document seeded demo users (alice@example.com / bob@example.com, both Demo1234!)
   - Note that auth uses HTTP-only cookies + CSRF tokens
   - Document new `/api/auth/*` endpoints
   - Update run instructions (no change to commands)
   - Note that Vite dev server proxies `/api` to backend
   - Document that `frontend/openapi/restaurant-booking.json` is the source of truth for client generation
2. Verify `.gitignore` excludes `node_modules`, `dist`, `.env`
3. Run full verification pipeline:
   ```bash
   dotnet build RestaurantBooking.slnx
   dotnet test RestaurantBooking.slnx --no-build
   dotnet format RestaurantBooking.slnx --verify-no-changes
   cd frontend
   npm install && npm run generate:api && npm run build && npm run typecheck && npm run lint && npm run format:check && npm run deadcode
   ```

**Verification**: All quality gates pass end-to-end.

---

## Implementation Order

Slices must be executed in order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

Dependencies:
- Slice 3 depends on Slice 2 (auth infrastructure)
- Slice 4 depends on Slice 3 (booking scoping)
- Slice 5 depends on Slices 1-4 (complete backend API surface)
- Slice 6 depends on Slice 5 (generated client with auth)
- Slice 7 depends on Slice 6 (auth-aware components)
- Slice 8 wraps it all up

---

## Cross-Cutting Requirement Coverage

| Requirement | Slices | Verification |
|-------------|--------|--------------|
| Auth required for booking creation | 3, 4 | Backend test — 401 on unauthenticated POST |
| User-scoped booking history | 3, 4, 7 | Backend test — cross-user isolation; frontend shows own bookings |
| HTTP-only cookies | 2 | Manual + automated test check that `Set-Cookie` is `HttpOnly` |
| CSRF protection | 2, 3 | Backend test — missing CSRF token returns 400 |
| No external auth providers | 2 | Using ASP.NET Core Identity (built-in) |
| No secrets in code | 2, 8 | Review + README docs |
| Seeded demo users | 2, 8 | Alice/bob credentials in README |
| OpenAPI includes auth endpoints | 5 | Backend test + spec validation |
| Generated TanStack Query hooks | 5, 6 | Build check — no raw fetch wrappers in component code |
| Existing behavior preserved | All | Backend HTTP tests (Slice 1) pass after changes |
| Result-style errors | 1, 4 | Backend tests assert error shapes |
| Tailwind/shadcn preserved | 7 | Visual inspection + component extraction preserves utility classes |
| All quality gates pass | 8 | Explicit gate check in Slice 8 |
