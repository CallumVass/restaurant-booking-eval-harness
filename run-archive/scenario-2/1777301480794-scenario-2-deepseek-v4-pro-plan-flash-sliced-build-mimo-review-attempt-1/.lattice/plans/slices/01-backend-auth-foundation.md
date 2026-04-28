# Slice 1: Backend Auth Foundation + User-Scoped Bookings

## Goal

Add cookie-based authentication using ASP.NET Core Identity's `IPasswordHasher<TUser>` (no EF Core), an in-memory `AuthStore`, register/login/logout/session endpoints, associate bookings with authenticated users, protect booking creation behind `RequireAuthorization()`, and add a user-scoped booking history endpoint (`GET /api/bookings/mine`). Public endpoints (restaurants, availability, all-bookings) remain unauthenticated.

## Acceptance Criteria

- [ ] `POST /api/auth/register` creates a user and sets an HTTP-only auth cookie; duplicate emails return 409.
- [ ] `POST /api/auth/login` validates credentials and sets an auth cookie; invalid credentials return 401.
- [ ] `POST /api/auth/logout` clears the auth cookie.
- [ ] `GET /api/auth/me` returns the current user when authenticated; returns 401 when not.
- [ ] `POST /api/bookings` requires authentication (returns 401 if anonymous) and associates the booking with the authenticated user's ID.
- [ ] `GET /api/bookings/mine` requires authentication and returns only the current user's bookings.
- [ ] User A cannot see User B's bookings via `/api/bookings/mine`.
- [ ] Existing public endpoints (`GET /api/restaurants`, `GET /api/restaurants/{id}/availability`, `GET /api/bookings`) remain unchanged and functional.
- [ ] Existing validation errors (invalid party size → 400, unknown restaurant → 404, conflict → 409) still work.
- [ ] Two seeded demo users exist: `alice@example.com` / `Demo1234!` and `bob@example.com` / `Demo1234!`.
- [ ] CORS is updated to specific origin `http://localhost:5173` with `AllowCredentials()`.
- [ ] `dotnet build RestaurantBooking.slnx` passes with `TreatWarningsAsErrors`.
- [ ] `dotnet format RestaurantBooking.slnx --verify-no-changes` passes.
- [ ] `dotnet test RestaurantBooking.slnx --no-build` passes.

## Required Tests

### Backend HTTP integration tests (`AuthEndpointsTests.cs`)
- Register new user → 200 OK, cookie set
- Register duplicate email → 409 Conflict
- Login with valid credentials → 200 OK, cookie set
- Login with wrong password → 401 Unauthorized
- Login with unknown email → 401 Unauthorized
- `GET /api/auth/me` authenticated → 200 with user info (Id, Email, DisplayName)
- `GET /api/auth/me` unauthenticated → 401
- Logout → clears cookie

### Backend HTTP integration tests (`BookingEndpointsTests.cs`)
- Create booking authenticated → 201 Created, booking has UserId
- Create booking unauthenticated → 401 Unauthorized
- `GET /api/bookings/mine` authenticated → 200, only own bookings
- `GET /api/bookings/mine` unauthenticated → 401
- User A cannot see User B's bookings via `/mine`
- Invalid party size → 400 via HTTP
- Unknown restaurant → 404 via HTTP
- Overlapping reservation → 409 via HTTP
- Available slots endpoint returns correct results via HTTP
- Restaurant list endpoint returns data via HTTP

## Verification Commands

```bash
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes
```

## Handoff Notes

- **Architecture**: Functional core (`BookingRules` in `Domain.cs`) stays pure. `AuthStore` and `BookingStore` are imperative shells. Auth endpoints use minimal API pattern in `Program.cs`. `AuthResult<T>` mirrors existing `BookingResult<T>` for Result-style errors.
- **Files created**: `backend/RestaurantBooking.Api/AuthStore.cs`, `backend/RestaurantBooking.Api/AuthDomain.cs`
- **Files modified**: `backend/RestaurantBooking.Api/Program.cs`, `backend/RestaurantBooking.Api/Domain.cs`, `backend/RestaurantBooking.Api/BookingStore.cs`, `backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj`
- **Test project modified**: `backend/RestaurantBooking.Tests/RestaurantBooking.Tests.csproj` (add `Microsoft.AspNetCore.Mvc.Testing`)
- **Test files created**: `backend/RestaurantBooking.Tests/AuthEndpointsTests.cs`, `backend/RestaurantBooking.Tests/BookingEndpointsTests.cs`
- **Packages added to API**: `Microsoft.Extensions.Identity.Core` for `IPasswordHasher<TUser>`
- **Packages added to tests**: `Microsoft.AspNetCore.Mvc.Testing` for `WebApplicationFactory<Program>`
- The existing `BookingRulesTests.cs` pure-domain tests must continue to pass unchanged.

## Non-Goals

- No EF Core, no database migrations, no external identity providers.
- No CSRF protection yet (added in Slice 2).
- No frontend changes.
- No OpenAPI spec update (added in Slice 2).
- No antiforgery middleware.
- No changes to the generated TypeScript client.
