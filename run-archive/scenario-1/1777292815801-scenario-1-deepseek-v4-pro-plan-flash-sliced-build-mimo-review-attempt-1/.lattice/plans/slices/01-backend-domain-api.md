# Slice 1: Backend Domain Models, Booking Logic, API Endpoints, and Boundary Tests

**Estimated time:** ≈18 minutes

## Goal

Build the complete backend: domain models, pure booking/slot logic with Result-typed errors, minimal API endpoints with OpenAPI/Swagger, in-memory persistence, and xUnit boundary tests.

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| A1 | `GET /api/restaurants` returns all seeded restaurants |
| A2 | `GET /api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N` returns available 30-minute slots (11:00–20:30) |
| A3 | `POST /api/restaurants/{id}/bookings` creates a booking (201) or rejects with 400/404/409 per the error table below |
| A4 | `GET /api/restaurants/{id}/bookings?date=YYYY-MM-DD` returns existing bookings |
| A5 | Overlapping bookings for the same table are rejected with 409 |
| A6 | The smallest-capacity table that fits the party is auto-assigned |
| A7 | Swagger UI is available at `/swagger` and OpenAPI JSON at `/swagger/v1/swagger.json` |
| A8 | All business errors use explicit `Result<T>` — no thrown exceptions for validation/conflict |

### Error Response Table

| Condition | HTTP | Error message |
|---|---|---|
| Party size ≤ 0 | 400 | Party size must be at least 1 |
| Date/time in past | 400 | Booking must be in the future |
| Time outside 11:00–20:30 | 400 | Booking time must be between 11:00 and 20:30 |
| Unknown restaurant | 404 | Restaurant not found |
| No table available | 409 | No table available for the requested party size and time |
| Overlapping booking | 409 | The selected table is already booked for this time slot |
| Invalid date format | 400 | Invalid date format, use YYYY-MM-DD |

## Required Tests

All tests must be xUnit facts/theories in `backend/Tests/`:

- **Conflict detection:** Same table, overlapping time → `CreateBooking` returns Failure
- **No conflict adjacent:** Same table, adjacent non-overlapping → `CreateBooking` returns Success
- **Invalid party size:** 0, negative → returns proper error
- **Invalid date/time:** past date, outside operating hours → returns proper error
- **Unknown restaurant:** non-existent ID → 404 / Failure
- **Slot listing:** correct slots returned when table is occupied vs free
- **Table assignment:** verifies smallest table that fits is chosen

## Files to Create

```
backend/
  backend.csproj                          — .NET 10, TreatWarningsAsErrors
  Domain/
    Models.cs                             — Restaurant, Table, Booking records + seed data
    Result.cs                             — Result<T> discriminated union
  UseCases/
    BookingService.cs                     — GetAvailableSlots, CreateBooking (pure functions)
  Api/
    Program.cs                            — Minimal API endpoints, Swagger, CORS
  Tests/
    Tests.csproj                          — xUnit, reference backend
    BookingServiceTests.cs                — All boundary tests above
```

## Verification Commands

```bash
cd backend && dotnet build && dotnet test && dotnet format --verify-no-changes
```

## Handoff Notes

- Persistence is `ConcurrentDictionary<string, List<Booking>>` keyed by restaurant ID — no EF Core, no database.
- Booking duration is fixed at 1.5 hours.
- Conflict formula: `startA < endB && startB < endA` on the same table.
- Time slots are 30-minute increments from 11:00 to 20:30 (last seating).
- The backend runs on port 5000 (specified in launchSettings or Program.cs).
- CORS must allow the frontend dev server origin (`http://localhost:5173`).
- The OpenAPI document at `/swagger/v1/swagger.json` must be valid and complete — it is consumed by Orval in Slice 2.

## Non-Goals

- Database persistence, EF Core, Docker
- Authentication / authorization
- Pagination or search
- Admin CRUD for restaurants or tables
- Email confirmations
