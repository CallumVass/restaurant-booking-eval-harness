# Restaurant Booking System — Implementation Plan

**Target:** 30–60 minutes. Vertical slices, domain-first, thin imperative shells.

---

## Architecture Overview

```
backend/          — .NET 10 Web API (minimal APIs)
  Domain/         — Restaurant, Table, Booking (pure C# records)
  UseCases/       — BookingService (pure functions, Result-returning)
  Api/            — Minimal API endpoints, Program.cs, OpenAPI/Swagger
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
- `CreateBookingRequest` — GuestName, GuestEmail, PartySize, DateTime
- Seed: 3 restaurants, 10 tables total (2–8 seats each)

### 1.2 Result type (`backend/Domain/Result.cs`)
```csharp
public record Result<T>
{
    public T? Value { get; }
    public string? Error { get; }
    public bool IsSuccess { get; }

    public static Result<T> Success(T value) => new(value, null, true);
    public static Result<T> Failure(string error) => new(default, error, false);
}
```

### 1.3 Booking service (`backend/UseCases/BookingService.cs`)
Pure static class — no DI, no side effects, operates on data passed in:

| Method | Logic |
|---|---|
| `GetAvailableSlots(restaurantId, date, partySize, tables, bookings)` | Return 30-min timeslots where a table with capacity ≥ partySize is free for 1.5h. Opens 11:00–22:00, last seating 20:30. |
| `CreateBooking(restaurantId, request, tables, bookings, now)` | Validate party size > 0; validate DateTime in future; validate time within hours; find smallest-capacity table that fits and is free; return `Booking` or `Result.Failure`. |

**Conflict detection:** Two bookings overlap if they share a table and `startA < endB AND startB < endA`.

**Table assignment:** Iterates suitable tables ordered by capacity ascending; first non-conflicting table wins.

### 1.4 Minimal API endpoints (`backend/Api/Program.cs`)
- `GET /api/restaurants` — all restaurants
- `GET /api/restaurants/{id}` — single restaurant
- `GET /api/restaurants/{id}/tables` — tables for restaurant
- `GET /api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N` — available slots
- `POST /api/restaurants/{id}/bookings` — create booking → `201` or `409`/`400`/`404`
- `GET /api/restaurants/{id}/bookings?date=YYYY-MM-DD` — bookings for a restaurant+date
- Swagger UI at `/swagger`, OpenAPI doc at `/swagger/v1/swagger.json`
- CORS allows `http://localhost:5173`
- Listens on `http://localhost:5000`

### 1.5 Tests (`backend/Tests/`)
xUnit project. 10 boundary tests:
- **Conflict:** All tables booked for overlapping time → failure
- **No conflict:** Adjacent non-overlapping booking → success
- **Invalid party size:** 0, negative → error message
- **Past date:** → error message
- **Outside hours:** 9:00 AM → error message
- **Unknown restaurant:** → error message
- **Smallest table:** Party of 3 gets 4-seat table (not 6-seat)
- **Slot listing (empty):** Returns all 20 slots (11:00–20:30)
- **Slot listing (occupied):** Excludes occupied time windows

### 1.6 OpenAPI spec (`backend/Api/openapi.json`)
Static OpenAPI 3.1 document with full schemas for all types. Required because .NET 10's `MapOpenApi()` generates minimal specs without response schemas — Orval needs complete type definitions.

### 1.7 Build & verify
```bash
cd backend && dotnet build && dotnet test && dotnet format --verify-no-changes
```
- `TreatWarningsAsErrors` enabled in `.csproj`
- Build target copies `openapi.json` to output directory

---

## Slice 2: Frontend Foundation (≈15 min)

### 2.1 Scaffold
```bash
npm create vite@latest frontend -- --template react-ts
```
Install: `tailwindcss @tailwindcss/vite`, `@tanstack/react-query`, `orval`, `shadcn`

### 2.2 Tailwind + shadcn/ui
- Tailwind v4 with `@tailwindcss/vite` plugin (CSS-based config, no `tailwind.config.js`)
- shadcn/ui components: `button`, `input`, `card`, `select`, `badge`, `table`, `skeleton`, `field`, `label`, `separator`
- Toast via `sonner` (shadcn's toast provider)

### 2.3 Typed client generation
- Orval config (`frontend/orval.config.ts`) pointing at `../backend/Api/openapi.json` (local file, not URL — reproducible without running backend)
- NPM script: `"gen:api": "orval --config orval.config.ts"`
- Generated output → `frontend/src/api/booking-api.ts`
- Hooks: `useGetRestaurants`, `useGetRestaurant`, `useGetRestaurantTables`, `useGetAvailableSlots`, `useGetRestaurantBookings`, `useCreateBooking`
- Types: `Restaurant`, `Table`, `Booking`, `CreateBookingRequest`, `ApiError`, etc.
- Custom mutator (`src/api/mutator.ts`) wraps responses into `{ data, status, headers }` format

### 2.4 TanStack Query setup
- `QueryClientProvider` wrapping app in `main.tsx`
- Shared `QueryClient` in `lib/query-client.ts`
- Vite proxy: `/api` → `http://localhost:5000`

---

## Slice 3: Frontend Features (≈18 min)

### 3.1 Restaurant list (`pages/RestaurantList.tsx`)
- Card grid with restaurant name, cuisine badge, address
- Uses `useGetRestaurants` from generated client
- Loading: 3 skeleton cards; Error: sonner toast; Empty: centered message
- Click navigates to booking form

### 3.2 Booking form (`pages/BookingForm.tsx`)
- Date picker (native `input type="date"`, min=today, defaults to today)
- Party size input (1–maxCapacity from tables)
- Time slot selector — `Select` populated from `useGetAvailableSlots` (enabled when date + partySize valid)
- Guest name, email inputs (required)
- Auto-assignment note after slot selection
- Submit → `useCreateBooking` mutation; success → confirmation page; error → toast
- Back button returns to restaurant list

### 3.3 Booking confirmation (`pages/BookingConfirmation.tsx`)
- Success icon + "Booking Confirmed!" heading
- Card with: restaurant name, booking reference, formatted date/time, party size badge, guest name/email
- "View All Bookings" and "Book Another" buttons

### 3.4 Bookings list (`pages/BookingsList.tsx`)
- Restaurant selector (dropdown) + date picker
- Table view: guest name, email, time badge, party size badge, table ID
- Uses `useGetRestaurantBookings` (enabled when restaurant selected)
- Loading: skeleton rows; Empty: "No bookings for this date"

### 3.5 Navigation (`components/Layout.tsx`)
- Sticky header with "TableBook" branding
- Nav buttons: "Restaurants" | "Bookings" (highlights active route)
- State-based routing via `useState<Route>` discriminated union in `App.tsx`
- No React Router dependency

### 3.6 Sub-components
- `BookingCard` — reusable restaurant card with name, cuisine badge, address, "Book a Table" button

---

## Slice 4: Polish & Verification (≈9 min)

### 4.1 Frontend scripts (`package.json`)
```json
{
  "scripts": {
    "gen:api": "orval --config orval.config.ts",
    "dev": "vite",
    "build": "npm run gen:api && tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\"",
    "deadcode": "knip --no-exit-code || npx ts-prune | grep -v 'used in module' || true"
  }
}
```

### 4.2 Dead code check
- `knip` with `--no-exit-code` (informational)
- Known false positives documented: Orval-generated helper exports, shadcn/ui component variants, unused shadcn components (`field.tsx`), unused deps (`react-hook-form`, `@hookform/resolvers`)

### 4.3 README (`README.md`)
- Prerequisites: .NET 10 SDK, Node.js 20+
- Backend setup: `cd backend && dotnet run`
- Frontend setup: `cd frontend && npm install && npm run dev`
- Scripts reference table
- API endpoints reference table
- Note about dead code false positives

### 4.4 Final verification
```bash
# Backend
cd backend && dotnet build && dotnet test && dotnet format --verify-no-changes

# Frontend (reproducible from source)
cd frontend && npm install && npm run build && npm run typecheck && npm run lint && npm run format:check && npm run deadcode
```

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
