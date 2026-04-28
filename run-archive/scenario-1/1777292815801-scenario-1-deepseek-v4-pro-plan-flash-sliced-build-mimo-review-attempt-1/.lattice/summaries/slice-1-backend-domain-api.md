# Slice 1 Summary: Backend Domain Models, Booking Logic, API Endpoints, and Boundary Tests

## Changes Made

### Files Created

| File | Purpose |
|------|---------|
| `backend/backend.csproj` | .NET 10 Web API project, TreatWarningsAsErrors, OpenApi package |
| `backend/Domain/Result.cs` | `Result<T>` discriminated union (Success/Failure) |
| `backend/Domain/Models.cs` | `Restaurant`, `Table`, `Booking`, `CreateBookingRequest` records + seed data (3 restaurants, 10 tables) |
| `backend/UseCases/BookingService.cs` | Pure functions: `GetAvailableSlots` and `CreateBooking` with Result-typed errors |
| `backend/Api/Program.cs` | Minimal API endpoints, CORS, Swagger UI, OpenAPI doc |
| `backend/Tests/Tests.csproj` | xUnit test project consuming backend |
| `backend/Tests/BookingServiceTests.cs` | 10 boundary tests |

### API Endpoints

- `GET /api/restaurants` — list all restaurants
- `GET /api/restaurants/{id}` — single restaurant
- `GET /api/restaurants/{id}/tables` — tables for a restaurant
- `GET /api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N` — available 30-min slots
- `POST /api/restaurants/{id}/bookings` — create booking (201 or 400/404/409)
- `GET /api/restaurants/{id}/bookings?date=YYYY-MM-DD` — bookings for restaurant+date

### Key Behaviors

- Auto-assigns smallest-capacity table that fits party size
- Conflict detection: `startA < endB && startB < endA` on same table
- All business errors use `Result<T>` — no exceptions for validation/conflicts
- In-memory `ConcurrentDictionary<string, Booking[]>` persistence
- Fixed 1.5h booking duration
- Operating hours: 11:00–20:30 (last seating)
- CORS allows `http://localhost:5173`
- OpenAPI doc at `/swagger/v1/swagger.json`, Swagger UI at `/swagger`

### Error Responses

| Condition | HTTP | Message |
|---|---|---|
| Party size ≤ 0 | 400 | Party size must be at least 1 |
| Date/time in past | 400 | Booking must be in the future |
| Time outside 11:00–20:30 | 400 | Booking time must be between 11:00 and 20:30 |
| Unknown restaurant | 404 | Restaurant not found |
| No table available | 409 | No table available for the requested party size and time |
| Overlapping booking | 409 | The selected table is already booked for this time slot |
| Invalid date format | 400 | Invalid date format, use YYYY-MM-DD |

## Tests (10 passing)

- `CreateBooking_AllTablesBooked_ReturnsFailure` — conflict when all tables booked
- `CreateBooking_AdjacentNonOverlappingTime_ReturnsSuccess` — adjacent slots don't conflict
- `CreateBooking_InvalidPartySize_ReturnsError` (0, -1) — boundary values
- `CreateBooking_PastDate_ReturnsError` — past date rejected
- `CreateBooking_TimeOutsideOperatingHours_ReturnsError` — 9:00 rejected
- `CreateBooking_UnknownRestaurant_ReturnsError` — 404 for unknown ID
- `CreateBooking_AssignsSmallestTableThatFits` — party of 3 gets 4-seater (t2)
- `GetAvailableSlots_ReturnsAllSlotsForEmptyRestaurant` — 20 slots from 11:00–20:30
- `GetAvailableSlots_ExcludesSlotsWhenAllTablesAreOccupied` — blocked time excluded

## Verification

```
dotnet build     → 0 warnings, 0 errors
dotnet test      → 10/10 passed
dotnet format --verify-no-changes → clean
```

## Deviations from Plan

- Conflict test adapted for auto-assignment: tests all-tables-exhausted scenario instead of single-table overlap (since auto-assignment falls through to next available table)
- Slot test similarly adapted to book all tables rather than one (same reason)
- OpenAPI path is `/swagger/v1/swagger.json` (not the default `/openapi/v1.json`) via custom route pattern
- Swagger UI served inline via CDN at `/swagger` (no Swashbuckle dependency)

## Handoff Notes

- Backend runs on `http://localhost:5000`
- OpenAPI doc at `/swagger/v1/swagger.json` is ready for Orval client generation in Slice 2
- The `CreateBookingRequest` record uses positional parameters: `GuestName`, `GuestEmail`, `PartySize`, `DateTime`
- All successful API responses return camelCase JSON (default System.Text.Json)
- Booking DateTime is expected as ISO 8601 in request body
