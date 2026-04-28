# Restaurant Booking System — Implementation Plan

**Target:** 30–60 minutes. Vertical slices, domain-first, thin imperative shells.

---

## Architecture Overview

```
backend/          — .NET 10 Web API (minimal APIs)
  Domain/         — Restaurant, Table, Booking, TimeSlot (pure C# records/structs)
  UseCases/       — BookingService, SlotService (pure functions, Result-returning)
  Api/            — Minimal API endpoints, program.cs, OpenAPI/Swagger setup
  Tests/          — xUnit boundary tests

frontend/         — React SPA (Vite + TypeScript)
  src/
    api/          — Orval-generated typed client (from backend OpenAPI)
    components/   — shadcn/ui components
    pages/        — RestaurantList, BookingForm, BookingConfirmation, BookingsList
    lib/          — TanStack Query helpers, utils
```

**Persistence:** In-memory `ConcurrentDictionary` (fast, zero setup).

**Error model:** Explicit `Result<T>` — `Result<T>.Success(T)` / `Result<T>.Failure(string)`.
Business failures never throw; validation/conflict errors flow as `Result.Failure`.

---

## Slice 1: Backend Domain + API (≈18 min)

### 1.1 Domain models (`backend/Domain/Models.cs`)
- `Restaurant` — Id, Name, Cuisine, Address
- `Table` — Id, RestaurantId, Capacity, Label
- `Booking` — Id, RestaurantId, TableId, GuestName, GuestEmail, PartySize, DateTime, Duration (1.5h default)
- Seed: 2–3 restaurants, 3–5 tables each.

### 1.2 Result type (`backend/Domain/Result.cs`)
```csharp
public record Result<T>(T? Value, string? Error, bool IsSuccess)
{
    public static Result<T> Success(T value) => new(value, null, true);
    public static Result<T> Failure(string error) => new(default, error, false);
}
```

### 1.3 Booking service (`backend/UseCases/BookingService.cs`)
Pure functions (no DI side effects — just operate on data passed in):

| Method | Logic |
|---|---|
| `GetAvailableSlots(restaurantId, date, partySize, tables, bookings)` | Return 30-min timeslots where a table with capacity ≥ partySize is free for 1.5h. Restaurant opens 11:00–22:00, last seating 20:30. |
| `CreateBooking(restaurantId, request, tables, bookings)` | Validate party size > 0; validate DateTime in future; validate restaurant exists; find smallest-capacity table that fits and is free for the slot; check no overlapping booking exists; return `Booking` or `Result.Failure`. |

**Conflict detection:** Two bookings overlap if they share a table and their time ranges intersect (startA < endB AND startB < endA).

### 1.4 Minimal API endpoints (`backend/Api/Program.cs`)
- `GET /api/restaurants` — all restaurants
- `GET /api/restaurants/{id}` — single restaurant
- `GET /api/restaurants/{id}/tables` — tables for restaurant
- `GET /api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N` — available slots
- `POST /api/restaurants/{id}/bookings` — create booking → `201` or `409`/`400`/`404`
- `GET /api/restaurants/{id}/bookings?date=YYYY-MM-DD` — bookings for a restaurant+date
- Swagger UI at `/swagger`, OpenAPI doc at `/swagger/v1/swagger.json`

### 1.5 Tests (`backend/Tests/`)
xUnit project. Boundary tests:
- **Conflict:** Two bookings for same table overlapping → failure
- **No conflict:** Two bookings for same table adjacent (no overlap) → success
- **Invalid party size:** 0, negative → 400
- **Invalid date/time:** past date, outside hours → 400
- **Unknown restaurant:** → 404
- **Slot listing:** returns correct slots when table occupied vs free
- **Table assignment:** assigns smallest table that fits party

### 1.6 Build & verify
- `dotnet build` with `TreatWarningsAsErrors`
- `dotnet test`
- `dotnet format --verify-no-changes`

---

## Slice 2: Frontend Foundation (≈15 min)

### 2.1 Scaffold
- `npm create vite@latest frontend -- --template react-ts`
- Install: `tailwindcss @tailwindcss/vite`, `@tanstack/react-query`, `orval`, shadcn/ui init

### 2.2 Tailwind + shadcn/ui
- Tailwind v4 with Vite plugin
- shadcn/ui components: `button`, `input`, `card`, `select`, `form`, `badge`, `table`, `skeleton`, `toast` (sonner)

### 2.3 Typed client generation
- Orval config (`frontend/orval.config.ts`) pointing at `http://localhost:5000/swagger/v1/swagger.json`
- NPM script: `"gen:api": "orval --config orval.config.ts"`
- Generated output → `frontend/src/api/booking-api.ts` (typed hooks: `useGetRestaurants`, `useCreateBooking`, etc.)
- `gen:api` runs before `build` and as part of CI/verify scripts

### 2.4 TanStack Query setup
- `QueryClientProvider` wrapping app in `main.tsx`
- Query key factory for cache organization

---

## Slice 3: Frontend Features (≈18 min)

### 3.1 Restaurant list (`pages/RestaurantList.tsx`)
- Card grid with restaurant name, cuisine, address
- Click/tap navigates to booking form for that restaurant
- Uses `useGetRestaurants` from generated client
- Loading: skeleton cards; error: toast; empty: friendly message

### 3.2 Booking form (`pages/BookingForm.tsx`)
- Date picker (native `input type="date"`, min=today)
- Time slot selector (populated from `GET /slots` — fetched when date/partySize changes)
- Party size input
- Guest name, email inputs
- Table display (auto-assigned from available slot selection)
- Submit → `useCreateBooking` mutation
- Validation: client-side for required fields, server errors surfaced via toast

### 3.3 Booking confirmation (`pages/BookingConfirmation.tsx`)
- Shows booking details after successful creation
- Link to view all bookings

### 3.4 Bookings list (`pages/BookingsList.tsx`)
- Table of bookings for a restaurant+date
- Uses `useGetBookings`
- Badge for booking status, time, party size, guest name

### 3.5 Navigation
- Simple top nav: "Restaurants" | "Bookings"
- React Router or simple state-based routing (keep it light)

---

## Slice 4: Polish & Verification (≈9 min)

### 4.1 Frontend scripts (`package.json`)
```json
{
  "scripts": {
    "gen:api": "orval --config orval.config.ts",
    "dev": "vite",
    "build": "tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "format:check": "prettier --check 'src/**/*.{ts,tsx,css}'",
    "deadcode": "knip --no-exit-code || npx ts-prune | grep -v 'used in module' | tee /dev/null"
  }
}
```

### 4.2 Dead code / unused export check
- Use `knip` or `ts-prune` — configure to fail on unused exports if possible, otherwise document known safe false positives.

### 4.3 README
- Prerequisites: .NET 10 SDK, Node 20+
- Backend: `cd backend && dotnet run` (serves on :5000)
- Frontend: `cd frontend && npm run gen:api && npm run dev` (serves on :5173, proxies /api)
- Scripts reference and purpose

### 4.4 Final verification
- `dotnet build && dotnet test && dotnet format --verify-no-changes` (backend)
- `npm install && npm run gen:api && npm run build && npm run typecheck && npm run lint && npm run format:check && npm run deadcode` (frontend)
- Manual smoke: create a booking, verify conflict rejection, verify slot listing

---

## What We Skip (keep scope tight)
- Database / EF Core / Docker (in-memory is sufficient)
- Auth / multi-tenancy
- Email confirmation / notifications
- Admin CRUD for restaurants/tables (seed only)
- Pagination / search (single-date scope is small)
- i18n
- End-to-end browser tests (boundary tests at API level cover core logic)

## Error Type Reference

| Condition | HTTP Status | Result Error |
|---|---|---|
| Party size ≤ 0 | 400 | "Party size must be at least 1" |
| Date/time in past | 400 | "Booking must be in the future" |
| Time outside 11:00–20:30 | 400 | "Booking time must be between 11:00 and 20:30" |
| Unknown restaurant | 404 | "Restaurant not found" |
| No table available | 409 | "No table available for the requested party size and time" |
| Overlapping booking | 409 | "The selected table is already booked for this time slot" |
| Invalid date format | 400 | "Invalid date format, use YYYY-MM-DD" |
