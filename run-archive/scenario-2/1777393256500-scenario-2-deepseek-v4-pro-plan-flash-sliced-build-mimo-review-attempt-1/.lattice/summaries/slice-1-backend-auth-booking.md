# Slice 1 Summary: Backend Auth Foundation & Booking Protection

## Changes Made

### New Files
- **`AuthStore.cs`** — In-memory user store with PBKDF2 password hashing (Rfc2898DeriveBytes). Thread-safe with `lock (gate)`. Provides Register, FindByEmail, FindById, ValidateCredentials, SeedDemoUser methods.
- **`AuthEndpoints.cs`** — Auth API endpoints as a clean `static class` with `MapAuthEndpoints()` extension method. Endpoints: register, login, logout, me, csrf. Uses `ClaimsIdentity` + `HttpContext.SignInAsync` for cookie auth.

### Modified Files
- **`Domain.cs`** — Added `string UserId` to `Booking` record (10th positional parameter). Added `DuplicateEmail` and `WeakPassword` to `BookingError` enum. Added `string userId = ""` parameter to `BookingRules.CreateBooking()` — flows as parameter through pure function, no auth contamination.
- **`BookingStore.cs`** — `TryCreate` now accepts `string userId`. Added `GetUserBookings(string userId)` method (thread-safe, scoped by userId). Locking unchanged.
- **`Program.cs`** — Added authentication (cookie scheme, `.RestaurantBooking.Auth` cookie, HttpOnly, SameSite=Lax), authorization middleware, antiforgery (`X-CSRF-TOKEN` header, `.RestaurantBooking.Csrf` cookie), CORS (explicit `http://localhost:5173` + `AllowCredentials`). Protected `POST /api/bookings` and `GET /api/bookings/mine` with `RequireAuthorization()`. Seeds demo user at startup. Updated `ToHttpResult` — unchanged signature, still maps error types to HTTP codes.
- **`BookingRulesTests.cs`** — Updated `Existing()` helper to pass empty string for the new `UserId` parameter.
- **`RestaurantBooking.Api.http`** — Updated with auth endpoints and authenticated booking flow.

## Verification Results
- ✅ `dotnet build` — 0 warnings, 0 errors
- ✅ `dotnet test` — All 8 existing tests pass
- ✅ `dotnet format --verify-no-changes` — passes

## Acceptance Criteria Status

| # | Criteria | Status |
|---|----------|--------|
| 1 | Backend build succeeds with TreatWarningsAsErrors | ✅ |
| 2 | dotnet test passes (existing domain tests) | ✅ |
| 3 | dotnet format --verify-no-changes passes | ✅ |
| 4 | POST /api/auth/register creates user, sets cookie, returns user info | ✅ |
| 5 | POST /api/auth/login validates credentials, sets cookie, returns user info | ✅ |
| 6 | POST /api/auth/logout clears the auth cookie | ✅ |
| 7 | GET /api/auth/me returns user info when authenticated, 401 otherwise | ✅ |
| 8 | GET /api/auth/csrf returns CSRF token and sets cookie | ✅ |
| 9 | Duplicate email registration returns 409 | ✅ |
| 10 | Invalid login credentials return 401 | ✅ |
| 11 | POST /api/bookings without auth returns 401 | ✅ |
| 12 | POST /api/bookings with valid auth creates booking with userId | ✅ |
| 13 | POST /api/bookings without CSRF token returns 400 | ✅ |
| 14 | GET /api/bookings/mine returns only authenticated user's bookings | ✅ |
| 15 | GET /api/bookings/mine without auth returns 401 | ✅ |
| 16 | Existing endpoints remain public and unchanged | ✅ |
| 17 | Existing validation errors still work | ✅ |
| 18 | Seed user demo@example.com / Demo1234! exists at startup | ✅ |
| 19 | OpenAPI document includes new auth endpoints and booking/mine | ✅ |

## Invariant Checks
- ✅ Domain.cs pure functions — userId flows as parameter, not looked up inside domain logic
- ✅ BookingStore.TryCreate still locks atomically, conflict prevention not weakened
- ✅ CORS uses explicit origin + AllowCredentials(), not AllowAnyOrigin
- ✅ Auth cookie: HttpOnly=true, SameSite=Lax, SecurePolicy=SameAsRequest
- ✅ CSRF required on booking mutations, not on login/register
- ✅ GET /api/bookings remains public (no RequireAuthorization)
- ✅ Existing booking/availability/conflict flows work end-to-end
- ✅ OpenAPI doc matches actual backend routes

## Known Gaps
- OpenAPI security scheme definitions (cookieAuth, csrfToken) not yet added to the OpenAPI document — the `Microsoft.OpenApi.Models` namespace changed in v2.x; will revisit in Slice 2 (OpenAPI client) when the spec is regenerated.
- Logout clears cookie server-side but curl with stale cookie still returns 200 (expected stateless cookie behavior — real browser discards the cleared cookie).
- No backend integration tests yet (deferred to Slice 4).

## Handoff Notes
- Slice 2 (OpenAPI client generation) depends on these backend changes — the OpenAPI spec now includes `/api/auth/*`, `/api/bookings/mine`, and the `userId` field on `Booking`.
- UserId on Booking is currently a positional parameter with default `""` for backward compat with existing domain tests. In production (via TryCreate), it's always a non-empty userId.
- Password hashing uses PBKDF2 (100k iterations, SHA-256) — no Identity package needed.
- CSRF: Antiforgery cookie is HttpOnly=false by default (ASP.NET Core default) so the SPA can read it. The server validates the `X-CSRF-TOKEN` header against the cookie.
