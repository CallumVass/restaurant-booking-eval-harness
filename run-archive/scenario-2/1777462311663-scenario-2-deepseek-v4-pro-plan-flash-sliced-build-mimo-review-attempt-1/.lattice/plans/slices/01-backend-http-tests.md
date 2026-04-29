# Slice 1: Backend HTTP Integration Tests for Existing Behavior

## Goal

Add ASP.NET Core `WebApplicationFactory`-based integration tests covering all existing endpoints and error mapping, without changing any production code. This establishes a baseline that existing behavior is preserved through subsequent changes.

## Global Invariants

| Invariant | Text |
|-----------|------|
| GI-001 | All API responses use typed, result-style errors mapped to appropriate HTTP status codes (400/404/409) |
| GI-002 | Booking domain rules remain unchanged pure functions |
| GI-008 | All quality gates must pass |
| GI-010 | Existing public endpoints (GET /api/restaurants, GET /api/restaurants/{id}/availability) remain publicly accessible without authentication |

## Acceptance Criteria

| # | Criterion | Covers |
|---|-----------|--------|
| AC-1.1 | `GET /api/restaurants` returns 200 with 3 seeded restaurants (Ember Table, Luna Verde, Saffron Court) | R-024 |
| AC-1.2 | `GET /api/bookings` returns 200 with empty array initially | R-024 |
| AC-1.3 | `GET /api/restaurants/{id}/availability` with valid params returns 200 with available slots | R-024 |
| AC-1.4 | `GET /api/restaurants/{id}/availability` with unknown restaurant ID returns 404 with ErrorResponse | R-024 |
| AC-1.5 | `GET /api/restaurants/{id}/availability` with invalid party size returns 400 with ErrorResponse | R-024, GI-001 |
| AC-1.6 | `GET /api/restaurants/{id}/availability` with past date returns 400 with ErrorResponse | R-024, GI-001 |
| AC-1.7 | `POST /api/bookings` with valid body returns 201 with Booking in response body | R-024 |
| AC-1.8 | `POST /api/bookings` with invalid party size (0 or 9) returns 400 with ErrorResponse | R-024, GI-001 |
| AC-1.9 | `POST /api/bookings` with unknown restaurant returns 404 with ErrorResponse | R-024, GI-001 |
| AC-1.10 | `POST /api/bookings` with overlapping reservation returns 409 with ErrorResponse | R-024, GI-001 |
| AC-1.11 | After creating a booking, `GET /api/bookings` lists it | R-024 |
| AC-1.12 | `GET /openapi/v1.json` returns 200 with valid JSON containing expected paths | R-024, GI-007 |
| AC-1.13 | POST to `/api/bookings` with valid booking creates exactly one booking (no duplicate from retry logic) | R-024 |
| AC-1.14 | Availability returns correct available table count (at least one slot when tables exist and party fits) | R-002, GI-002 |

## Invariant Checks For This Slice

- **GI-001**: Each error test (1.4-1.6, 1.8-1.10) must assert both HTTP status code AND ErrorResponse body shape (Code + Message fields present, non-empty).
- **GI-002**: The existing `BookingRulesTests.cs` (domain tests) must continue to pass unmodified. This slice does not touch domain logic.
- **GI-008**: All tests pass with `dotnet test --no-build`. Must draw baseline on the current codebase first.
- **GI-010**: Tests 1.1 and 1.3 must assert 200 responses without any auth headers/cookies on the request.

## Required Tests

All tests are automated integration tests using `WebApplicationFactory<Program>`. File: `backend/RestaurantBooking.Tests/HttpIntegrationTests.cs`.

| Test | Type | Covers | Contract |
|------|------|--------|----------|
| `ListRestaurants_Returns200WithThreeRestaurants` | Automated | AC-1.1, R-024 | HTTP 200, JSON array with 3 items, each has id/name/tables fields |
| `ListBookings_Returns200WithEmptyArray` | Automated | AC-1.2, R-024 | HTTP 200, JSON array, length 0 |
| `AvailableSlots_WithValidParams_Returns200` | Automated | AC-1.3, R-024 | HTTP 200, array of AvailabilitySlot with time and availableTableCount |
| `AvailableSlots_UnknownRestaurant_Returns404` | Automated | AC-1.4, R-024 | HTTP 404, body has code and message |
| `AvailableSlots_InvalidPartySize_Returns400` | Automated | AC-1.5, R-024, GI-001 | HTTP 400, ErrorResponse.code="InvalidPartySize" (or similar) |
| `AvailableSlots_PastDate_Returns400` | Automated | AC-1.6, R-024, GI-001 | HTTP 400, ErrorResponse.code="InvalidDate" (or similar) |
| `AvailableSlots_PartyExceedsCapacity_Returns400` | Automated | R-024, GI-001 | HTTP 400, ErrorResponse.code="NoTableForPartySize" |
| `CreateBooking_ValidRequest_Returns201` | Automated | AC-1.7, R-024 | HTTP 201, Booking JSON with id/restaurantId/tableId/partySize/date/time/guestName/guestEmail |
| `CreateBooking_InvalidPartySize_Returns400` | Automated | AC-1.8, R-024, GI-001 | HTTP 400, ErrorResponse |
| `CreateBooking_UnknownRestaurant_Returns404` | Automated | AC-1.9, R-024, GI-001 | HTTP 404, ErrorResponse |
| `CreateBooking_OverlappingReservation_Returns409` | Automated | AC-1.10, R-024, GI-001 | HTTP 409, ErrorResponse.code="OverlappingReservation" |
| `CreateBooking_ThenListBookings_IncludesNewBooking` | Automated | AC-1.11, R-024 | GET /api/bookings returns array containing the newly created booking |
| `OpenApiDocument_Available_ContainsExpectedPaths` | Automated | AC-1.12, R-024, GI-007 | HTTP 200, JSON with paths containing /api/restaurants, /api/bookings, /api/restaurants/{restaurantId}/availability |
| `AvailableSlots_ReturnsCorrectTableCount` | Automated | AC-1.14, R-002 | Assert at least one slot, availableTableCount > 0 for each slot |

## Verification Commands

```bash
# From repo root:
cd backend
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
```

Expected: all tests pass. The existing `BookingRulesTests` continue to pass.

## Handoff Notes

- The API project's `Program` class must remain `public partial class Program` for `WebApplicationFactory` to work.
- The test project needs `Microsoft.AspNetCore.Mvc.Testing` NuGet package added.
- Tests use `HttpClient` directly; no auth setup needed in this slice since all endpoints are currently unauthenticated.
- The `GET /api/bookings` endpoint will be replaced by `GET /api/bookings/mine` in Slice 2. Tests for it here serve as a baseline and will need updating in Slice 2.

## Non-Goals

- This slice does NOT add or change any production code.
- This slice does NOT add auth-related tests (covered in Slice 2+4).
- This slice does NOT add frontend tests (covered in Slice 4).
- This slice does NOT modify Domain.cs, BookingStore.cs, or Program.cs.
