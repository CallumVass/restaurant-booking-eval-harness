# Slice 1 Summary: Backend HTTP Integration Tests

## Changes Made

1. **`backend/RestaurantBooking.Tests/RestaurantBooking.Tests.csproj`** — Added `Microsoft.AspNetCore.Mvc.Testing` v10.0.7 NuGet package reference for `WebApplicationFactory<Program>`.

2. **`backend/RestaurantBooking.Tests/HttpIntegrationTests.cs`** (new) — 15 integration tests using `WebApplicationFactory<Program>`:
   - `ListRestaurants_Returns200WithThreeRestaurants` (AC-1.1, R-024)
   - `ListBookings_Returns200WithEmptyArray` (AC-1.2, R-024)
   - `AvailableSlots_WithValidParams_Returns200` (AC-1.3, R-024)
   - `AvailableSlots_UnknownRestaurant_Returns404` (AC-1.4, R-024)
   - `AvailableSlots_InvalidPartySize_Returns400` (AC-1.5, R-024, GI-001)
   - `AvailableSlots_PastDate_Returns400` (AC-1.6, R-024, GI-001)
   - `AvailableSlots_PartyExceedsCapacity_Returns400` (R-024, GI-001)
   - `CreateBooking_ValidRequest_Returns201` (AC-1.7, R-024)
   - `CreateBooking_InvalidPartySize_Returns400` (AC-1.8, R-024, GI-001)
   - `CreateBooking_UnknownRestaurant_Returns404` (AC-1.9, R-024, GI-001)
   - `CreateBooking_OverlappingReservation_Returns409` (AC-1.10, R-024, GI-001)
   - `CreateBooking_ThenListBookings_IncludesNewBooking` (AC-1.11, R-024)
   - `CreateBooking_ValidRequest_CreatesExactlyOneBooking` (AC-1.13, R-024)
   - `OpenApiDocument_Available_ContainsExpectedPaths` (AC-1.12, R-024, GI-007)
   - `AvailableSlots_ReturnsCorrectTableCount` (AC-1.14, R-002)

## Requirement IDs Covered

- R-002 (existing behavior preserved via test coverage)
- R-024 (backend HTTP/OpenAPI-level tests)

## Invariant Checks

- **GI-001**: All error-returning tests assert both HTTP status code AND `ErrorResponse` body shape (Code + Message fields). Verified via explicit assertions.
- **GI-002**: Existing `BookingRulesTests.cs` (8 domain tests) continue to pass unmodified (22/23 passing after adding 15 integration tests = 8 existing + 15 new).
- **GI-008**: `dotnet build` succeeds (0 warnings, 0 errors with TreatWarningsAsErrors). `dotnet test --no-build` passes (23/23). `dotnet format --verify-no-changes` passes.
- **GI-010**: Public endpoints (GET /api/restaurants, GET /api/restaurants/{id}/availability) tested without auth headers, returning 200 (GI-010 preserved).

## Deviations from Plan

- Used fresh `WebApplicationFactory<Program>` per test method (via static `CreateClient()`) instead of `IClassFixture`, because `BookingStore` is a registered singleton and tests would interfere with each other when sharing a factory.
- `AvailableSlots_PartyExceedsCapacity_Returns400` uses partySize=7 at Ember Table (max table capacity 6) to trigger `NoTableForPartySize` error code. The plan initially suggested partySize=9, but that hits the `InvalidPartySize` boundary (max 8) first.

## Verification Commands

```bash
dotnet build RestaurantBooking.slnx        # 0 warnings, 0 errors
dotnet test RestaurantBooking.slnx --no-build  # 23/23 passed
dotnet format RestaurantBooking.slnx --verify-no-changes  # OK
```

## Known Gaps

- No production code was changed (per slice scope).
- No auth-related tests (covered in Slices 2-4).
- No frontend tests (covered in Slice 7).
