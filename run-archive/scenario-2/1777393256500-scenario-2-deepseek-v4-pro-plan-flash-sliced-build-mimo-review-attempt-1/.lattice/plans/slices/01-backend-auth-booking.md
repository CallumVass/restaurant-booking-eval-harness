# Slice 1: Backend Auth Foundation & Booking Protection

## Goal

Add cookie-based authentication with in-memory user store, protect booking creation behind auth, associate bookings with users, and add user-scoped booking-history endpoint — all without disrupting existing endpoints.

## Global Invariants

All invariants from `manifest.json` apply. Key invariants for this slice:
- Preserve existing Functional Core + Imperative Shell architecture
- Preserve existing .NET 10 minimal Web API, in-memory persistence, OpenAPI at /openapi/v1.json
- Preserve existing behavior: restaurant list, booking list, availability lookup, booking creation with conflict prevention; all validation rules continue to work
- Backend build passes with warnings treated as errors
- Existing domain tests (BookingRulesTests.cs) continue to pass
- No external services, hosted databases, OAuth providers, or secrets
- Auth uses HTTP-only cookies only; no localStorage or sessionStorage
- CSRF/anti-forgery protection on state-changing requests
- Backend formatting passes

## Acceptance Criteria

1. Backend build succeeds with `TreatWarningsAsErrors`
2. `dotnet test` passes (existing domain tests must still pass)
3. `dotnet format --verify-no-changes` passes
4. `POST /api/auth/register` creates a user, sets auth cookie, returns user info
5. `POST /api/auth/login` validates credentials, sets auth cookie, returns user info
6. `POST /api/auth/logout` clears the auth cookie
7. `GET /api/auth/me` returns current user info when authenticated, 401 otherwise
8. `GET /api/auth/csrf` returns CSRF token via header and sets CSRF cookie
9. Duplicate email registration returns 409
10. Invalid login credentials return 401 with generic message
11. `POST /api/bookings` without auth cookie returns 401
12. `POST /api/bookings` with valid auth creates booking associated with that user
13. `POST /api/bookings` without CSRF token returns 400 (antiforgery)
14. `GET /api/bookings/mine` returns only the authenticated user's bookings
15. `GET /api/bookings/mine` without auth returns 401
16. Existing endpoints (`GET /api/restaurants`, `GET /api/bookings`, `GET /api/restaurants/{id}/availability`) continue to work unchanged and remain public
17. Existing validation errors (invalid party size, date, time, unknown restaurant, overlapping reservation) still work
18. Seed user `demo@example.com` / `Demo1234!` exists at startup
19. OpenAPI document at `/openapi/v1.json` includes new auth endpoints, `bookings/mine`, and security definitions

## Invariant Checks For This Slice

- Verify `Domain.cs` pure functions (`CreateBooking`, `AvailableSlots`, `ValidateCommon`) are not contaminated with auth concerns (userId flows through as parameter, not looked up inside domain logic)
- Verify `BookingStore.TryCreate` still locks atomically; conflict prevention is not weakened
- Verify CORS policy uses explicit origin (`http://localhost:5173`) + `AllowCredentials()` instead of `AllowAnyOrigin`
- Verify auth cookie is set as HttpOnly, SameSite=Lax in local dev
- Verify CSRF token is required (via `[ValidateAntiForgeryToken]` or equivalent) on booking mutations but not on login/register
- Verify `GET /api/bookings` remains public (returns all bookings, restaurant-level view)
- Verify existing booking creation → availability → conflict flows still work end-to-end
- Verify OpenAPI doc still matches the actual backend routes

## Required Tests

Tests are covered in Slice 4 (backend tests). This slice's verification is manual/exploratory via `RestaurantBooking.Api.http` or curl. Verify:
- Seed user can log in
- Unauthenticated booking creation returns 401
- Authenticated booking creation succeeds and includes userId
- `GET /api/bookings/mine` returns user-scoped results
- Registration with duplicate email returns 409
- Invalid login returns 401

## Verification Commands

```bash
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes
```

## Handoff Notes

- Slice 2 (OpenAPI client) depends on this slice — the OpenAPI spec changes here are needed before regenerating the frontend client
- Slice 4 (backend tests) depends on this slice — tests verify the auth/boundary behavior implemented here
- The `string? UserId` on Booking record should become non-nullable; existing seed data (if any) will always be created with a userId going forward
- Cookie name: `.RestaurantBooking.Auth`, CSRF header: `X-CSRF-TOKEN`
- Password rules: ≥ 8 chars, ≥ 1 uppercase, ≥ 1 digit, ≥ 1 non-alphanumeric

## Non-Goals

- No persistence across restarts (in-memory is acceptable for local dev)
- No email verification, password reset, or account management beyond register/login/logout/me
- No frontend changes
- No test file creation (tests are in Slice 4)
