# Slice 2: Backend Authentication, Booking Association, and Boundary Tests

## Goal

Add ASP.NET Core Identity with cookie-based authentication (HTTP-only cookies, CSRF protection), associate bookings with authenticated users, protect booking creation, scope booking history to the current user, seed demo users, and add comprehensive auth boundary tests. No external providers or secrets.

## Global Invariants

| Invariant | Text |
|-----------|------|
| GI-001 | All API responses use typed, result-style errors mapped to appropriate HTTP status codes |
| GI-002 | Booking domain rules remain unchanged pure functions |
| GI-003 | Auth cookies are HTTP-only with SameSite=Lax; no tokens in localStorage/sessionStorage |
| GI-004 | CSRF protection validated on all state-changing endpoints |
| GI-005 | CORS allows localhost:5173 with credentials |
| GI-006 | User-scoped data isolation enforced |
| GI-008 | All quality gates pass |
| GI-009 | No external services, hosted databases, or secrets |
| GI-010 | Existing public endpoints remain public |
| GI-011 | Domain types preserve existing signatures; Booking.UserId is additive |

## Acceptance Criteria

| # | Criterion | Covers |
|---|-----------|--------|
| AC-2.1 | `POST /api/auth/register` with valid email/password creates user and returns 200 | R-004, R-049 |
| AC-2.2 | `POST /api/auth/register` with duplicate email returns 400 | R-050 |
| AC-2.3 | `POST /api/auth/register` with invalid email format returns 400 | R-050 |
| AC-2.4 | `POST /api/auth/login` with valid credentials returns 200 and sets HTTP-only auth cookie | R-004, R-049, GI-003 |
| AC-2.5 | `POST /api/auth/login` with wrong password returns 401 | R-004, R-034 |
| AC-2.6 | `POST /api/auth/login` with unknown email returns 401 | R-004, R-034 |
| AC-2.7 | `GET /api/auth/me` when authenticated returns UserInfo { Email, Id } | R-046, R-049 |
| AC-2.8 | `GET /api/auth/me` when anonymous returns 200 with null/empty body | R-049 |
| AC-2.9 | `POST /api/auth/logout` clears auth cookie; subsequent `/api/auth/me` returns anonymous | R-049 |
| AC-2.10 | `POST /api/bookings` without auth returns 401 (not redirected) | R-006, GI-006 |
| AC-2.11 | `POST /api/bookings` without CSRF token returns 400 | R-010, GI-004 |
| AC-2.12 | `POST /api/bookings` with valid auth + CSRF returns 201, Booking includes UserId | R-006, R-014 |
| AC-2.13 | `GET /api/bookings/mine` when authenticated returns user's own bookings only | R-007, R-015, GI-006 |
| AC-2.14 | `GET /api/bookings/mine` without auth returns 401 | R-007, R-015 |
| AC-2.15 | User A's `GET /api/bookings/mine` does NOT include User B's bookings (adversarial isolation) | R-008, GI-006 |
| AC-2.16 | `GET /api/restaurants` remains public (no auth, returns 200) | R-052, GI-010 |
| AC-2.17 | `GET /api/restaurants/{id}/availability` remains public (no auth, returns 200) | R-052, GI-010 |
| AC-2.18 | Domain validation errors (invalid party size, date, time, overlap) still return correct HTTP codes under auth | R-016, GI-001 |
| AC-2.19 | OpenAPI document at `/openapi/v1.json` includes auth endpoints and security schemes | R-017 |
| AC-2.20 | Seeded demo users alice@example.com and bob@example.com can authenticate | R-029, R-048 |
| AC-2.21 | Passwords are hashed (not stored in plaintext) | R-050 |
| AC-2.22 | No external service references, secrets, or OAuth packages in csproj | R-005, R-038, GI-009 |
| AC-2.23 | In-memory persistence for both bookings (BookingStore) and users (EF Core InMemory) | R-039 |
| AC-2.24 | The old unauthenticated `GET /api/bookings` endpoint is removed (replaced by `/api/bookings/mine`) | R-051 |
| AC-2.25 | Booking.UserId field added to Booking record (additive, not breaking domain rule signatures) | R-014, GI-011 |
| AC-2.26 | CSRF token is required and validated for POST /api/auth/login and /api/auth/logout | R-010, GI-004 |

## Invariant Checks For This Slice

- **GI-001**: All error responses tested in auth context (AC-2.18) must return same error shapes as pre-auth. Verify by running Slice 1 HTTP tests in addition to new auth tests.
- **GI-002**: Do not modify `BookingRules` class. Verify existing `BookingRulesTests` pass unchanged.
- **GI-003**: Check that `Set-Cookie` response header from login includes `HttpOnly` flag. Verify no frontend code touches `localStorage` or `sessionStorage` in `useAuth.ts` or `AuthDialog.tsx` (frontend is Slice 4, but backend must emit correct cookie).
- **GI-004**: Every POST endpoint test must include a variant that omits the CSRF header and asserts 400. This includes `/api/auth/login`, `/api/auth/logout`, and `/api/auth/register`.
- **GI-005**: CORS in Program.cs must use `WithOrigins("http://localhost:5173")` with `AllowCredentials()`. Test that credentialed preflight passes.
- **GI-006**: Tests AC-2.13 and AC-2.15 together provide positive and adversarial coverage. Create two users, have each create a booking, then assert each sees only their own.
- **GI-009**: Verify no `Microsoft.AspNetCore.Authentication.Google` / `Facebook` / `Twitter` packages. Only `Microsoft.AspNetCore.Identity.EntityFrameworkCore` and `Microsoft.EntityFrameworkCore.InMemory`.
- **GI-010**: Tests AC-2.16 and AC-2.17 must pass without auth headers.
- **GI-011**: The `Booking` record gains an optional `UserId` field (nullable string, or string with default). Existing constructor call sites in tests and `BookingStore.TryCreate` must be updated. `BookingRules` pure functions do not reference `UserId`.

## Required Tests

File: `backend/RestaurantBooking.Tests/AuthIntegrationTests.cs`

| Test | Type | Covers | Contract |
|------|------|--------|----------|
| `Register_ValidRequest_Returns200` | Automated | AC-2.1, R-004 | POST valid email+password; assert 200; verify can login after |
| `Register_DuplicateEmail_Returns400` | Automated | AC-2.2, R-050 | POST same email twice; second returns 400 with error message |
| `Register_InvalidEmail_Returns400` | Automated | AC-2.3, R-050 | POST with non-email string; returns 400 |
| `Login_ValidCredentials_Returns200AndSetsCookie` | Automated | AC-2.4, GI-003 | POST valid creds; assert 200; assert Set-Cookie header present with HttpOnly |
| `Login_WrongPassword_Returns401` | Automated | AC-2.5, R-034 | POST valid email + wrong password; assert 401 |
| `Login_UnknownEmail_Returns401` | Automated | AC-2.6, R-034 | POST non-existent email; assert 401 |
| `Me_Authenticated_ReturnsUserInfo` | Automated | AC-2.7, R-046 | Login, then GET /api/auth/me; assert JSON with Email and Id fields |
| `Me_Anonymous_Returns200WithNullBody` | Automated | AC-2.8, R-049 | GET /api/auth/me without auth; assert 200, body null or "null" |
| `Logout_ClearsCookie_ThenMeIsAnonymous` | Automated | AC-2.9, R-049 | Login, POST /api/auth/logout, GET /api/auth/me; assert anonymous |
| `CreateBooking_Unauthenticated_Returns401` | Automated | AC-2.10, R-006 | POST /api/bookings without auth cookie; assert 401 (not redirect to login page) |
| `CreateBooking_MissingCsrf_Returns400` | Automated | AC-2.11, R-010, GI-004 | POST with auth but no X-CSRF-TOKEN header; assert 400 |
| `CreateBooking_AuthenticatedWithCsrf_Returns201` | Automated | AC-2.12, R-006, R-014 | Full flow: get CSRF token, login, POST booking with CSRF; assert 201, verify Booking.UserId matches authenticated user |
| `ListBookingsMine_Authenticated_ReturnsOwnBookings` | Automated | AC-2.13, R-007, R-015 | Login as alice, create booking, GET /api/bookings/mine; assert booking present |
| `ListBookingsMine_Unauthenticated_Returns401` | Automated | AC-2.14, R-007 | GET /api/bookings/mine without auth; assert 401 |
| `ListBookingsMine_UserIsolation` | Automated | AC-2.15, R-008, GI-006 | Login as alice, create booking. Login as bob, create booking. GET /api/bookings/mine as alice; assert only alice's booking. GET /api/bookings/mine as bob; assert only bob's booking. |
| `Restaurants_PublicAccess_Returns200` | Automated | AC-2.16, R-052, GI-010 | GET /api/restaurants without auth; assert 200 |
| `Availability_PublicAccess_Returns200` | Automated | AC-2.17, R-052, GI-010 | GET /api/restaurants/ember-table/availability?date=...&partySize=2 without auth; assert 200 |
| `CreateBooking_WithAuth_DomainErrorsStillMap` | Automated | AC-2.18, R-016, GI-001 | Authenticated POST with invalid party size → 400; unknown restaurant → 404; overlapping → 409 |
| `OpenApiDocument_IncludesAuthPaths` | Automated | AC-2.19, R-017 | GET /openapi/v1.json; assert paths include /api/auth/register, /api/auth/login, /api/auth/logout, /api/auth/me |
| `SeededDemoUsers_CanLogin` | Automated | AC-2.20, R-029, R-048 | Login as alice@example.com/Demo1234! and bob@example.com/Demo1234!; assert 200 for both |
| `CsrfRequired_OnLogin` | Automated | AC-2.26, R-010, GI-004 | POST /api/auth/login without X-CSRF-TOKEN header; assert 400 |

## Verification Commands

```bash
# From repo root:
dotnet build RestaurantBooking.slnx          # must pass (TreatWarningsAsErrors)
dotnet test RestaurantBooking.slnx --no-build  # all tests pass (Slice 1 + Slice 2)
```

## Handoff Notes

- The `Program.cs` file will be significantly restructured: add Identity services, cookie auth config, CORS with credentials, antiforgery, EF Core InMemory, `AppDbContext`, seeder, and new endpoint mappings.
- `Domain.cs` gets additive changes: `UserInfo` record, `LoginRequest`/`RegisterRequest` records, `UserId` field on `Booking`.
- `BookingStore.cs` changes: `TryCreate` gains `userId` parameter; new `GetBookingsForUser(string userId)` method; the old `Bookings` property may be removed or kept for admin purposes.
- The old `GET /api/bookings` endpoint is REMOVED (breaking change). The OpenAPI spec update in Slice 3 must reflect this.
- Tests use `HttpClient` with cookie container to maintain auth state across requests. The `WebApplicationFactory` setup must configure antiforgery for test requests.
- For CSRF testing: the antiforgery cookie + header token flow must work. Tests must simulate the SPA flow: GET /api/antiforgery/token to get cookie, extract token from cookie, include in X-CSRF-TOKEN header.
- Seeded demo users are created via `Seeder.cs` called during app startup with `IServiceProvider`.
- The `Booking` record `UserId` field defaults to empty string for legacy compatibility. `BookingRules.CreateBooking` does NOT take a `userId` parameter — the assignment happens in `BookingStore.TryCreate` after the domain function returns success.
- `ToHttpResult` helper is extended or a new variant added to handle 401 (Unauthorized) responses.

## Non-Goals

- This slice does NOT update the OpenAPI spec file (done in Slice 3).
- This slice does NOT regenerate the TypeScript client (done in Slice 3).
- This slice does NOT implement frontend auth UI (done in Slice 4).
- This slice does NOT implement frontend tests (done in Slice 4).
- This slice does NOT update README (done in Slice 5).
