# Slice 2 Summary: Backend Authentication, Booking Association, and Boundary Tests

## Changes Made

### New Files

1. **`backend/RestaurantBooking.Api/AppDbContext.cs`** — EF Core `IdentityDbContext<IdentityUser>` configured for ASP.NET Core Identity with InMemory database.

2. **`backend/RestaurantBooking.Tests/AuthIntegrationTests.cs`** — 25 integration tests covering all auth endpoints, booking auth boundaries, CSRF enforcement, user-scoped booking history, adversarial user isolation, domain error mapping under auth, OpenAPI auth paths, and seeded demo users.

### Modified Files

1. **`backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj`** — Added `Microsoft.AspNetCore.Identity.EntityFrameworkCore` v10.0.7 and `Microsoft.EntityFrameworkCore.InMemory` v10.0.7 NuGet package references.

2. **`backend/RestaurantBooking.Api/Domain.cs`** — Added `UserId` field to `Booking` record (defaults to `""` for backward compatibility). Added `UserInfo`, `LoginRequest`, `RegisterRequest` records.

3. **`backend/RestaurantBooking.Api/BookingStore.cs`** — `TryCreate` now accepts `userId` string parameter and assigns it to the created booking. Added `GetBookingsForUser(string userId)` method for user-scoped querying.

4. **`backend/RestaurantBooking.Api/Program.cs`** — Major restructure:
   - Added ASP.NET Core Identity with EF Core InMemory (`AppDbContext`)
   - Configured cookie authentication (HTTP-only, SameSite=Lax, no redirect on 401)
   - Added Antiforgery services (`X-CSRF-TOKEN` header)
   - Updated CORS to `WithOrigins("http://localhost:5173")` + `AllowCredentials()`
   - Added seeding of demo users (`alice@example.com` and `bob@example.com` with password `Demo1234!`)
   - Added auth endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/antiforgery/token`
   - Replaced `GET /api/bookings` with `GET /api/bookings/mine` (authenticated, user-scoped)
   - `POST /api/bookings` now requires authentication + CSRF token
   - `ValidateCsrf` helper for consistent CSRF error responses
   - Added `AddAuthorization()` to satisfy `UseAuthorization()` middleware

5. **`backend/RestaurantBooking.Tests/HttpIntegrationTests.cs`** — Removed tests that used the old unauthenticated `/api/bookings` endpoint (replaced by authenticated `/api/bookings/mine`). Updated OpenAPI path expectations. Added `Restaurants_Public_Returns200WithoutAuth` and `Availability_Public_Returns200WithoutAuth` tests. Both test files now use `WithWebHostBuilder` to create unique InMemory database names per factory to prevent test isolation issues.

## Requirement IDs Covered

- R-004, R-005, R-006, R-007, R-008, R-009, R-010, R-011, R-012 (architecture/security)
- R-013 (no localStorage/sessionStorage — backend enforces HTTP-only cookies)
- R-014, R-015 (booking association, user-scoped history)
- R-016 (preserved validation errors under auth)
- R-029, R-034 (seeded demo users, boundary tests)
- R-038, R-039 (no external services, in-memory persistence)
- R-046, R-047, R-048, R-049, R-050 (UserInfo, LoginRequest, RegisterRequest, seeded users, auth endpoints)
- R-051 (replaced GET /api/bookings with GET /api/bookings/mine)
- R-052 (public endpoints remain public)

## Invariant Checks

- **GI-001**: All error responses tested under auth context (InvalidPartySize, UnknownRestaurant, OverlappingReservation all return correct HTTP status codes and ErrorResponse shapes).
- **GI-002**: `BookingRules` class not modified. All 8 domain tests (`BookingRulesTests`) pass unchanged.
- **GI-003**: Login test asserts `HttpOnly` on `Set-Cookie` header. No tokens in localStorage (backend only in this slice).
- **GI-004**: CSRF validation tested on all state-changing endpoints: login, register, logout, and booking creation.
- **GI-005**: CORS configured with `WithOrigins("http://localhost:5173")` and `AllowCredentials()`.
- **GI-006**: `ListBookingsMine_UserIsolation` test verifies cross-user isolation with two authenticated users.
- **GI-008**: Build succeeds (TreatWarningsAsErrors), 43/43 tests pass, format verification passes.
- **GI-009**: Only `Microsoft.AspNetCore.Identity.EntityFrameworkCore` and `Microsoft.EntityFrameworkCore.InMemory` added; no external auth.
- **GI-010**: Public endpoints tested without auth (restaurants, availability return 200).
- **GI-011**: `Booking.UserId` is additive (default `""`); `BookingRules.CreateBooking` unchanged; existing constructor call sites work.

## Deviations from Plan

- Used `WithWebHostBuilder` + unique database names `($"{prefix}_{Guid.NewGuid():N}")` in both test files to prevent EF Core InMemory static database conflicts across `WebApplicationFactory` instances. Without this, the InMemory database named "RestaurantBooking" is process-wide and causes "Sequence contains more than one element" errors when multiple factories seed the same users.
- `Returns200WithNullBody` tests use a flexible assertion (`string.IsNullOrEmpty(content) || content.Trim() == "null"`) to handle both empty-body and JSON-null responses from `Results.Ok<object?>(null)`.
- Added explicit `builder.Services.AddAuthorization()` to satisfy `app.UseAuthorization()` middleware requirement.

## Verification Commands

```bash
dotnet build RestaurantBooking.slnx        # 0 warnings, 0 errors
dotnet test RestaurantBooking.slnx --no-build  # 43/43 passed
dotnet format RestaurantBooking.slnx --verify-no-changes  # OK
```

## Known Gaps

- OpenAPI spec file not updated (deferred to Slice 3).
- Frontend TypeScript client not regenerated (deferred to Slice 3).
- Frontend auth UI not implemented (deferred to Slice 4).
- README not updated (deferred to Slice 5).

## Handoff Notes

- The CSRF flow requires the SPA to: (1) GET `/api/antiforgery/token` to obtain a request token + antiforgery cookie, (2) include the token as `X-CSRF-TOKEN` header on all mutation requests (login, register, logout, create booking), (3) the cookie is automatically sent by the browser.
- Auth cookie name is `.AspNetCore.Identity.Application` (default Identity cookie name).
- Demo user credentials: `alice@example.com` / `Demo1234!` and `bob@example.com` / `Demo1234!`.
- `GetBookingsForUser` filters bookings by `UserId` field — no admin endpoint exists yet to view all bookings.
