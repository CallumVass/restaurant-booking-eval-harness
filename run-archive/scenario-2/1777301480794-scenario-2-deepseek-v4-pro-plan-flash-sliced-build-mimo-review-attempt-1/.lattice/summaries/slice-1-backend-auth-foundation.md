# Slice 1 Summary: Backend Auth Foundation + User-Scoped Bookings

## Changes Made

### New files
- `backend/RestaurantBooking.Api/AuthDomain.cs` — Functional core: `AuthUser`, `UserInfo`, `AuthError`, `AuthResult<T>` types
- `backend/RestaurantBooking.Api/AuthStore.cs` — Imperative shell: in-memory user store with `IPasswordHasher<AuthUser>`, register/login/get-by-id
- `backend/RestaurantBooking.Tests/AuthEndpointsTests.cs` — 8 HTTP integration tests for auth endpoints
- `backend/RestaurantBooking.Tests/BookingEndpointsTests.cs` — 10 HTTP integration tests for booking endpoints with auth

### Modified files
- `backend/RestaurantBooking.Api/Domain.cs` — Added `UserId` field to `Booking` record (default `""` for backward compat)
- `backend/RestaurantBooking.Api/BookingStore.cs` — `TryCreate` accepts `userId`; added `GetUserBookings(string userId)` method
- `backend/RestaurantBooking.Api/Program.cs` — Major changes:
  - Cookie auth (`AddAuthentication().AddCookie()` + `AddAuthorization()`)
  - CORS restricted to `http://localhost:5173` with `AllowCredentials()`
  - Auth endpoints: register, login, logout, me
  - Booking creation protected with `.RequireAuthorization()`
  - Added `GET /api/bookings/mine` (user-scoped, requires auth)
  - Seeded demo users: alice@example.com, bob@example.com (password: Demo1234!)
  - `ToAuthHttpResult` for auth error mapping (duplicate → 409, invalid → 401)
- `backend/RestaurantBooking.Tests/RestaurantBooking.Tests.csproj` — Added `Microsoft.AspNetCore.Mvc.Testing`

### Notable design decisions
- `IPasswordHasher<TUser>` from `Microsoft.AspNetCore.Identity` (included in ASP.NET Core shared framework, no extra NuGet needed)
- AuthResult<T> mirrors BookingResult<T> pattern for Result-style errors
- Cookie auth: HTTP-only, SameSite=Lax, Secure=None (local dev, no HTTPS)
- Existing `BookingRulesTests.cs` pure-domain tests pass unchanged (8 tests)
- All public endpoints (restaurants, availability, all-bookings) remain unauthenticated

## Verification
- `dotnet build RestaurantBooking.slnx` — passes (0 warnings, 0 errors)
- `dotnet test RestaurantBooking.slnx --no-build` — 26/26 pass (8 existing + 18 new)
- `dotnet format RestaurantBooking.slnx --verify-no-changes` — passes

## Known Gaps
- No CSRF protection (deferred to Slice 2 as planned)
- No frontend changes (deferred to Slice 2)
- OpenAPI spec and generated client not updated (deferred to Slice 2)
- Logout test verifies Set-Cookie clearing header rather than subsequent 401 (client-side cookie management in tests is manual)

## Handoff Notes
- AuthStore uses `ConcurrentDictionary` for thread safety; BookingStore uses `lock` for atomic conflict prevention
- Seeded users are created at startup; duplicate seed registration is silently caught
- The `UserId` field on `Booking` is part of the record's primary constructor (default `""`) — existing code using 9-arg constructor still works
- Booking creation flow: endpoint extracts `ClaimTypes.NameIdentifier` from auth cookie -> passes to `BookingStore.TryCreate` -> `BookingRules.CreateBooking` (pure) -> `booking with { UserId = userId }` (imperative shell adds user context)
