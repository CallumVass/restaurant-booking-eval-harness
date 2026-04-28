# Slice 4 Summary: Backend HTTP & Auth Integration Tests

## Changes Made

### New Files
- **`ApiTests.cs`** — HTTP-level integration tests using `WebApplicationFactory<Program>` with 23 tests across 5 categories.

### Modified Files
- **`RestaurantBooking.Tests.csproj`** — Added `Microsoft.AspNetCore.Mvc.Testing` version `10.0.7` package reference.

## Test Categories

| Category | Tests | Description |
|----------|-------|-------------|
| **A. Smoke Tests** | 3 | `GET /api/restaurants` (200 + 3 restaurants), `GET /api/bookings` (200), `GET /api/restaurants/{id}/availability` (200 + slots) |
| **B. Error Mapping** | 8 | UnknownRestaurant (404), InvalidPartySize too small (400), InvalidPartySize too large (400), PastDate (400), InvalidTime (400), OverlappingReservation (409), NoTableForPartySize (400), AdjacentNonOverlapping (201) |
| **C. Auth Boundaries** | 10 | CreateBooking without auth (401), with auth (201 includes userId), GetMyBookings without auth (401), with auth (own bookings), Register valid (201 + auth cookie), Register duplicate (409), Login wrong password (401), Login valid (200 + auth cookie), GetMe authed (200), GetMe unauthed (401) |
| **D. User Isolation** | 1 | User A creates booking → User B's `/mine` doesn't include it, User A's `/mine` includes it |
| **E. CSRF** | 1 | CreateBooking without CSRF token → 400 AntiforgeryValidationFailed |

## Test Architecture
- Each test creates its own `WebApplicationFactory<Program>` (no shared singleton state between tests)
- `CreateClient()` uses `AllowAutoRedirect = false` for correct status code assertions
- `GetCsrfToken()` helper fetches token via `GET /api/auth/csrf` + reads `X-CSRF-TOKEN` response header
- `CreateAuthenticatedClient()` logs in as seeded demo user (email: `demo@example.com`, password: `Demo1234!`)
- `CreateRegisteredUser(email)` registers a new user and returns `(HttpClient, UserId)`
- CSRF token sent as `X-CSRF-TOKEN` request header on all mutation requests
- Cookie-based auth via `WebApplicationFactory`'s automatic `CookieContainer` management

## Verification Results

| Check | Result |
|-------|--------|
| `dotnet build` | ✅ 0 warnings, 0 errors |
| `dotnet test` (31/31) | ✅ All 8 existing domain tests + 23 new integration tests pass |
| `dotnet format --verify-no-changes` | ✅ No formatting issues |
| Frontend `npm run typecheck` | ✅ Passes |
| Frontend `npm run lint` | ✅ Passes |

## Invariant Checks
- ✅ `BookingRulesTests.cs` not modified — all 8 existing assertions unchanged
- ✅ Domain.cs (Functional Core) unchanged — pure functions not touched
- ✅ BookingStore.cs, AuthStore.cs, AuthEndpoints.cs, Program.cs unchanged
- ✅ No test hard-codes specific user IDs — uses `Guid.NewGuid()` for unique emails
- ✅ No external services or secrets introduced
- ✅ CSRF token fetched via `GET /api/auth/csrf` and sent as `X-CSRF-TOKEN` header
- ✅ Cookie-based auth: `HttpClient` automatically tracks Set-Cookie from login/register
- ✅ Overlapping test uses saffron-court (only saffron-8 seats 8) to reliably trigger 409
- ✅ Adjacent test uses ember-table (ember-4) with 2-hour gap (17:00-19:00 vs 19:00-21:00)
- ✅ Backend formatting passes
- ✅ Frontend typecheck and lint pass

## Handoff Notes
- Tests create fresh `WebApplicationFactory<Program>` per test — clean state every time
- The `Program` class was already exposed via `public partial class Program` (from Slice 1)
- Test helpers `CreateAuthenticatedClient()` and `CreateRegisteredUser()` provide reusable auth patterns
- CSRF is required on mutations: tests always call `GetCsrfToken()` before mutations, but note that mutation endpoints (like booking) internally validate CSRF, so a fresh token is needed after each mutation (since the antiforgery cookie may be rotated)
- The `CreateBooking_OverlappingReservation_Returns409` test uses saffron-court with party of 8 — only saffron-8 seats 8, ensuring reliable overlap

## Acceptance Criteria Status
| # | Criteria | Status |
|---|----------|--------|
| 1 | `dotnet test` passes (existing + new) | ✅ 31/31 |
| 2 | `dotnet build` with TreatWarningsAsErrors | ✅ 0 warnings |
| 3 | `dotnet format --verify-no-changes` | ✅ Passes |
| A | Existing endpoint smoke tests | ✅ 3 tests |
| B | Error mapping tests | ✅ 8 tests |
| C | Auth boundary tests | ✅ 10 tests |
| D | User-scoped booking isolation | ✅ 1 test |
| E | CSRF protection | ✅ 1 test |
