# Restaurant Booking System - Implementation Plan

## Architecture Overview

- **Backend**: .NET 10 Web API, minimal APIs, in-memory persistence, OpenAPI/Swagger enabled
- **Frontend**: React SPA (Vite), Tailwind CSS, shadcn/ui, TanStack Query, Orval-generated typed client
- **Pattern**: Functional Core / Imperative Shell — pure domain functions for booking logic, thin I/O shells
- **Errors**: Result-style (`OneOf` or custom `Result<T, Error>`) for expected business failures

## Directory Structure

```
backend/
  RestaurantBooking.sln
  src/
    RestaurantBooking.Api/          # Web API project (Imperative Shell)
    RestaurantBooking.Domain/       # Pure domain library (Functional Core)
  tests/
    RestaurantBooking.Domain.Tests/ # Unit tests for pure functions
    RestaurantBooking.Api.Tests/    # Integration tests (WebApplicationFactory)
frontend/
  package.json
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
  components.json                   # shadcn config
  src/
    api/                            # Orval-generated client (gitignored or committed)
    components/
    pages/
    lib/
```

## Vertical Slices

### Slice 0: Project Scaffolding (~5 min)

**Backend:**
- `dotnet new webapi` with .NET 10 target, minimal APIs, OpenAPI enabled
- `dotnet new classlib` for Domain project
- `dotnet new xunit` for Domain.Tests and Api.Tests
- Add `TreatWarningsAsErrors=true` in Directory.Build.props
- Enable `dotnet format` via `.editorconfig`

**Frontend:**
- `npm create vite@latest frontend -- --template react-ts`
- Install Tailwind CSS v4, shadcn/ui, TanStack Query, Orval
- Configure shadcn with `npx shadcn@latest init`
- Add deterministic scripts to `package.json`: `build`, `typecheck`, `lint`, `format:check`, `deadcode`
- Configure ESLint, Prettier, knip (deadcode)

### Slice 1: Domain Models & Restaurant List (~8 min)

**Functional Core** — `RestaurantBooking.Domain/Models.cs`:
- `Restaurant` record: `Id`, `Name`, `Address`, `CuisineType`, `OpeningTime`, `ClosingTime`
- `Table` record: `Id`, `RestaurantId`, `Seats`, `Location` (e.g. "Patio", "Main")
- `Booking` record: `Id`, `RestaurantId`, `TableId`, `CustomerName`, `PartySize`, `Date`, `TimeSlot`, `CreatedAt`
- `TimeSlot` record: `StartTime` (TimeOnly), `EndTime` (TimeOnly)
- `BookingError` enum: `InvalidPartySize`, `InvalidDate`, `InvalidTimeSlot`, `RestaurantNotFound`, `NoAvailableTable`, `OverlappingReservation`

**Imperative Shell** — `RestaurantBooking.Domain/InMemoryRepository.cs`:
- `InMemoryRestaurantRepository` with seed data (3 restaurants, multiple tables each)
- `InMemoryBookingRepository` with Add/GetByRestaurant/GetByDate

**API** — `RestaurantBooking.Api/RestaurantEndpoints.cs`:
- `GET /api/restaurants` → list all restaurants
- `GET /api/restaurants/{id}` → single restaurant

**Tests:**
- Domain: none yet (no logic)
- API: GET /api/restaurants returns seeded data

**Frontend:**
- Generate Orval client from backend OpenAPI spec
- `RestaurantListPage` with shadcn Card grid
- TanStack Query `useQuery` for restaurant list

### Slice 2: Available Time Slots (~10 min)

**Functional Core** — `RestaurantBooking.Domain/AvailabilityService.cs`:
- `GetAvailableSlots(restaurant, tables, bookings, date, partySize) -> Result<IReadOnlyList<AvailableSlot>, BookingError>`
- Pure function: given restaurant hours, table capacities, existing bookings, and party size — returns available time slots with table assignments
- Validates: party size > 0, date not in past, within restaurant hours

**Imperative Shell** — wires data from repos into the pure function

**API** — `GET /api/restaurants/{id}/availability?date=2025-06-01&partySize=4`

**Tests (boundary):**
- Party size 0 → `InvalidPartySize`
- Party size > max table capacity → `NoAvailableTable`
- Past date → `InvalidDate`
- Time outside opening hours → `InvalidTimeSlot`
- All slots available when no bookings
- Correct slots returned when some are booked

**Frontend:**
- Date picker + party size selector on restaurant detail page
- `useQuery` with parameters for availability
- Display available slots as selectable chips/buttons

### Slice 3: Create Booking with Conflict Prevention (~10 min)

**Functional Core** — `RestaurantBooking.Domain/BookingService.cs`:
- `CreateBooking(bookings, tables, restaurant, request) -> Result<Booking, BookingError>`
- Pure function: validates inputs, checks for overlapping reservations, assigns table
- Overlap detection: same table, same date, overlapping time ranges

**Imperative Shell** — persists booking via repository

**API** — `POST /api/bookings` with `{ restaurantId, customerName, partySize, date, timeSlot }`

**Tests (boundary — critical):**
- Overlapping reservation on same table → `OverlappingReservation`
- Overlapping but different table → success
- Non-overlapping same table → success
- Unknown restaurant → `RestaurantNotFound`
- Invalid party size, date, time → respective errors

**Frontend:**
- Booking form (shadcn Form with react-hook-form + zod validation)
- `useMutation` with TanStack Query
- Success → navigate to confirmation
- Error → display error message

### Slice 4: Booking Confirmation & Existing Bookings (~5 min)

**API:**
- `GET /api/bookings?restaurantId={id}` → list bookings for a restaurant
- `GET /api/bookings/{id}` → single booking detail

**Frontend:**
- `BookingConfirmationPage` showing booking details
- `BookingsListPage` showing existing bookings for a restaurant
- shadcn Table component for bookings list

### Slice 5: Polish & Verification (~5 min)

- Run `node .opencode/scripts/deterministic-checks.mjs` and fix all issues
- Ensure backend `dotnet build -p:TreatWarningsAsErrors=true` passes
- Ensure all backend tests pass with `--no-build`
- Ensure `dotnet format --verify-no-changes` passes
- Ensure frontend `build`, `typecheck`, `lint`, `format:check`, `deadcode` all pass
- Add README with run instructions

## Key Technology Choices

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Persistence | In-memory collections | Fast, no setup, eval scope |
| Validation | Result<T, Error> pattern | Explicit errors, no exceptions for flow |
| API style | Minimal APIs + TypedResults | .NET 10 best practice |
| OpenAPI | Built-in `AddOpenApi()` + Swagger UI | No extra packages needed |
| Frontend client | Orval `react-query` + `fetch` | Typed, auto-generated hooks |
| Forms | react-hook-form + zod + shadcn Form | Type-safe validation |
| UI library | shadcn/ui + Tailwind CSS | Polished, accessible components |
| Dead code | knip | Industry standard for TS dead code |

## Deterministic Scripts (frontend/package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/",
    "format:check": "prettier --check src/",
    "format": "prettier --write src/",
    "deadcode": "knip",
    "generate-api": "orval"
  }
}
```

## OpenAPI Spec Notes

- Use unique `operationId` on every endpoint (Orval depends on this)
- Define schemas in `components/schemas` for reusable types
- Use tags to group: `Restaurants`, `Bookings`, `Availability`
- Serve spec at `/openapi/v1.json`

## Non-Goals (for 30-60 min scope)

- Authentication/authorization
- Persistent database (EF Core, SQL)
- User accounts or sessions
- Email/SMS notifications
- Payment processing
- Multi-tenancy
- CQRS/MediatR (overkill for this scope)
