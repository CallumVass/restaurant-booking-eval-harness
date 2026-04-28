# Restaurant Booking System — Implementation Plan

## Architecture Overview

### Backend (.NET 10 Web API)
- **Lightweight Clean Architecture** with 3 projects in a single solution:
  - `src/RestaurantBooking.Domain/` — Entities, value objects, domain errors, pure domain functions
  - `src/RestaurantBooking.Web/` — Minimal API endpoints, Program.cs, DI wiring
- **In-memory persistence** — simple `ConcurrentDictionary` repositories, no EF Core
- **Result<T, E> errors** — a `Result<TValue, TError>` union type for expected business failures (invalid party size, time conflicts, unknown restaurant)
- **OpenAPI/Swagger** — `Microsoft.AspNetCore.OpenApi` with explicit `WithOpenApi()` metadata on all endpoints; produces a clean OpenAPI 3.0 document at `/swagger/v1/swagger.json`

### Frontend (React SPA)
- **Vite + React + TypeScript** — fast, modern SPA scaffold
- **Tailwind CSS v4 + shadcn/ui** — polished, responsive, accessible UI components
- **TanStack Query** — server-state management for all API data and mutations
- **Orval** — generates a fully typed, tree-shakeable API client from the backend OpenAPI document; zero hand-written fetch wrappers
- **Deterministic scripts**: `build` (vite build), `typecheck` (tsc --noEmit), `lint` (eslint), `format:check` (prettier --check), `deadcode` (knip or ts-prune)

### Project Structure
```
/tmp/restaurant-booking-eval-harness-active/.../
├── src/
│   ├── RestaurantBooking.Domain/        # Pure domain (no external deps)
│   │   ├── Restaurant.cs
│   │   ├── Table.cs
│   │   ├── Booking.cs
│   │   ├── TimeSlot.cs
│   │   ├── Errors/
│   │   │   └── BookingErrors.cs
│   │   └── Result.cs
│   ├── RestaurantBooking.Web/           # API layer
│   │   ├── Program.cs
│   │   ├── Endpoints/
│   │   │   ├── RestaurantEndpoints.cs
│   │   │   ├── BookingEndpoints.cs
│   │   │   └── AvailabilityEndpoints.cs
│   │   ├── Repositories/
│   │   │   ├── IRestaurantRepository.cs
│   │   │   ├── IBookingRepository.cs
│   │   │   └── InMemory*.cs
│   │   └── Services/
│   │       └── BookingService.cs        # Pure-domain conflict detection
│   └── tests/
│       └── RestaurantBooking.Tests/
│           ├── BookingServiceTests.cs   # Boundary tests for conflicts
│           ├── ValidationTests.cs       # Party size, date/time validation
│           └── AvailabilityTests.cs
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/ui/              # shadcn components
│   │   ├── pages/
│   │   │   ├── RestaurantsPage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   ├── ConfirmationPage.tsx
│   │   │   └── BookingsPage.tsx
│   │   ├── hooks/                      # TanStack Query hooks
│   │   └── api/                        # Orval-generated client
│   ├── orval.config.ts
│   ├── tailwind.config.ts
│   └── package.json (scripts: build, typecheck, lint, format:check, deadcode)
├── README.md
└── RestaurantBooking.sln
```

---

## Vertical Slices (Build Order)

### Slice 1 — Domain Model + Restaurant Listing
**Goal**: Core domain types exist; backend serves restaurant list; frontend displays it.

**Backend:**
- Create solution + domain project with `Restaurant` and `Table` entities
- In-memory `RestaurantRepository` seeded with 3–4 restaurants, each with 3–5 tables of varying capacities
- `GET /api/restaurants` endpoint returning restaurant list with table info
- Enable Swagger UI and expose OpenAPI JSON

**Frontend:**
- Scaffold Vite + React + TypeScript project
- Install and configure Tailwind CSS v4, shadcn/ui (Button, Card, Badge)
- Set up TanStack Query provider
- Create `RestaurantsPage` — grid of restaurant cards with name, cuisine, address, capacity info
- Wire with `useQuery` calling the typed client (initially hand-written typed fetch, replaced in Slice 5)

**Tests:**
- Unit test: `GET /api/restaurants` returns seeded data

### Slice 2 — Booking Domain Logic + Create Booking Endpoint
**Goal**: Users can book a table; conflict detection works; validation catches bad input.

**Backend:**
- `Booking` entity (Id, RestaurantId, TableId, CustomerName, Email, PartySize, DateTime, Duration)
- `Result<T, E>` type and `BookingErrors` (InvalidPartySize, InvalidDateTime, RestaurantNotFound, TableNotFound, TimeConflict)
- `BookingService` (pure domain function): `TryBook(restaurant, existingBookings, request) → Result<Booking, BookingError>`
  - Validates party size (≥1, ≤ table capacity)
  - Validates date/time (not in past, within operating hours 11:00–22:00)
  - Checks booking does not overlap existing reservations on same table (conflict: start < existingEnd AND end > existingStart)
- In-memory `BookingRepository`
- `POST /api/bookings` — accepts booking request, calls `BookingService.TryBook`, returns booking or error

**Frontend:**
- `BookingPage` with shadcn form components (Select for restaurant, Input for name/email/party size, date/time picker)
- Form validation with Zod on the client side mirroring backend rules
- TanStack Query `useMutation` for booking submission

**Tests:**
- **Boundary**: booking with party size 0 → InvalidPartySize
- **Boundary**: booking with party size exceeding table capacity → InvalidPartySize
- **Boundary**: booking in the past → InvalidDateTime
- **Boundary**: booking outside operating hours → InvalidDateTime
- **Boundary**: two non-overlapping bookings on same table succeed
- **Boundary**: overlapping bookings on same table → TimeConflict
- **Boundary**: booking at unknown restaurant → RestaurantNotFound

### Slice 3 — Availability Endpoint
**Goal**: Users can see available time slots for a restaurant, date, and party size.

**Backend:**
- `GET /api/restaurants/{id}/availability?date=YYYY-MM-DD&partySize=N`
- `BookingService.GetAvailableSlots(restaurant, bookings, date, partySize) → List<TimeSlot>`
  - Generates 30-minute slots within operating hours
  - Filters out slots where no table can accommodate the party size
  - Filters out slots that conflict with existing bookings
- Returns list of `{ time: "18:00", tableId: "…" }` with best-fit table

**Frontend:**
- Enhance `BookingPage` to include date picker and party size input, then fetch and display available time slots as selectable buttons/chips
- TanStack Query with enabled-flag to fetch availability only when date + party size are valid

**Tests:**
- All slots available for empty restaurant
- Slot filtered out when only table that fits is booked
- Slot available when restaurant has multiple tables and only one is booked
- Invalid party size returns empty or error

### Slice 4 — Booking List + Confirmation
**Goal**: Users see existing bookings; booking flow ends with confirmation.

**Backend:**
- `GET /api/bookings` — returns all bookings
- `GET /api/bookings/{id}` — returns single booking by ID

**Frontend:**
- `ConfirmationPage` — shown after successful booking, displays booking details with shadcn Card
- `BookingsPage` — table/list of all bookings with shadcn Table, shows customer name, restaurant, date/time, party size, status
- Navigation between pages (simple react-router with 3 routes: /, /book, /bookings)
- Add a shadcn Toast for success/error feedback on booking submission

**Tests:**
- Integration: full booking flow returns correct booking ID and details

### Slice 5 — OpenAPI Client Generation + Polish
**Goal**: Typed client replaces hand-written fetch; all scripts pass; README complete.

**Frontend:**
- Install Orval as dev dependency
- Create `orval.config.ts` pointing to `http://localhost:5000/swagger/v1/swagger.json`
- Add `generate-api` script: `orval --config orval.config.ts`
- Run generation; replace all hand-written fetch calls with Orval-generated hooks/functions
- Ensure `build` script runs `generate-api` first (or documents manual step); add `prebuild` hook
- Configure and verify all scripts:
  - `build`: vite build → passes
  - `typecheck`: tsc --noEmit → passes, 0 errors
  - `lint`: eslint src/ → passes, 0 warnings
  - `format:check`: prettier --check src/ → passes
  - `deadcode`: knip → passes, no unused exports

**Backend:**
- Ensure `dotnet build` passes with `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`
- Ensure `dotnet test` passes all boundary tests
- Ensure `dotnet format --verify-no-changes` passes

**README:**
- Prerequisites: .NET 10 SDK, Node.js 20+
- Backend: `cd src && dotnet run` (serves on :5000)
- Frontend: `cd frontend && npm install && npm run dev` (serves on :5173)
- Client generation: `npm run generate-api` (requires running backend first)
- Test commands for both projects

---

## Key Design Decisions

1. **In-memory persistence**: Keeps scope tight. No database setup overhead. All seeded data is hardcoded in Program.cs or repository constructors.
2. **Single backend project + domain project**: API controllers are thin endpoints calling pure domain functions. No separate Application/Infrastructure projects needed at this scale.
3. **Result<T,E> over exceptions**: All expected business failures (party size, time conflicts) use discriminated Result types. Infrastructure failures (in-memory can't fail) are not needed.
4. **Operating hours**: 11:00–22:00, 30-minute booking slots.
5. **Conflict detection**: `existingStart < newEnd && newStart < existingEnd` for overlapping time ranges.
6. **Orval generates during `prebuild`**: ensures CI-able, reproducible typed client generation.

## Time Budget (per slice)
- Slice 1: ~12 min
- Slice 2: ~15 min
- Slice 3: ~10 min
- Slice 4: ~10 min
- Slice 5: ~13 min
- Total: ~60 min
