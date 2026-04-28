# Slice 4: Backend HTTP & Auth Integration Tests

## Goal

Add HTTP-level integration tests for existing endpoints, error mapping, auth boundaries, user-scoped booking isolation, and CSRF protection. Use `Microsoft.AspNetCore.Mvc.Testing` with a custom `WebApplicationFactory`.

## Global Invariants

All invariants from `manifest.json` apply. Key invariants for this slice:
- Preserve existing behavior: all existing validation rules and business logic continue to work
- Backend build passes with warnings treated as errors
- Existing domain tests (BookingRulesTests.cs) continue to pass
- Backend formatting passes
- Auth uses HTTP-only cookies only; no localStorage or sessionStorage
- No external services or secrets

## Acceptance Criteria

1. `dotnet test` passes — all existing domain tests + new integration tests
2. `dotnet build` passes with `TreatWarningsAsErrors`
3. `dotnet format --verify-no-changes` passes

### Test categories and specific tests:

**A. Existing endpoint smoke tests**
- `GET /api/restaurants` returns 200 with 3 seeded restaurants
- `GET /api/bookings` returns 200 (initially empty list, or bookings if seeded)
- `GET /api/restaurants/{id}/availability` returns 200 with slots for valid query

**B. Error mapping tests**
- Unknown restaurant → 404 with ErrorResponse
- Invalid party size (0, 9) → 400 with ErrorResponse
- Past date → 400 with ErrorResponse
- Invalid time (non-seating time) → 400 with ErrorResponse
- Overlapping reservation → 409 with ErrorResponse
- No table for party size → 400 with ErrorResponse
- Adjacent non-overlapping bookings succeed (201)

**C. Auth boundary tests**
- `POST /api/bookings` without auth cookie → 401
- `POST /api/bookings` with valid auth → 201, booking includes userId
- `GET /api/bookings/mine` without auth → 401
- `GET /api/bookings/mine` with auth → returns only that user's bookings
- `POST /api/auth/register` with valid data → 200 + auth cookie set
- `POST /api/auth/register` with duplicate email → 409
- `POST /api/auth/login` with wrong password → 401
- `POST /api/auth/login` with valid credentials → 200 + auth cookie set
- `GET /api/auth/me` authenticated → 200 with user info
- `GET /api/auth/me` unauthenticated → 401

**D. User-scoped booking isolation**
- User A creates a booking → User B's `GET /api/bookings/mine` does not include it
- User A's `GET /api/bookings/mine` returns their own booking

**E. CSRF protection**
- `POST /api/bookings` without CSRF token → 400 (antiforgery failure)

## Invariant Checks For This Slice

- Verify test project has `Microsoft.AspNetCore.Mvc.Testing` package added
- Verify `CustomWebApplicationFactory` uses the `Program` class from the API project (needs `InternalsVisibleTo` or `public partial class Program`)
- Verify `HttpClient` instances use `UseCookies = true` for cookie-based auth flows
- Verify CSRF token is fetched via GET /api/auth/csrf and sent as `X-CSRF-TOKEN` header on mutation tests
- Verify existing `BookingRulesTests.cs` are not modified or broken
- Verify no test hard-codes a specific user ID — use the seeded demo user or register fresh

## Required Tests

All tests in the file `backend/RestaurantBooking.Tests/ApiTests.cs` (new file).

## Verification Commands

```bash
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes
```

## Handoff Notes

- Requires Slice 1 (backend auth + booking protection) completed
- `CustomWebApplicationFactory` must reference `Program` — add `public partial class Program` if needed to expose it to the test project
- Cookie-based auth in integration tests: POST login → HttpClient captures Set-Cookie → reuse same HttpClient for subsequent requests
- CSRF token flow: GET /api/auth/csrf → read X-CSRF-TOKEN from response headers → include as request header on mutations
- The test project already references `RestaurantBooking.Api` via `ProjectReference`

## Non-Goals

- No load/stress tests
- No database integration tests (in-memory store is sufficient)
- No frontend test coverage
- No modification to existing `BookingRulesTests.cs` (unless tests need clarification that doesn't change assertions)
