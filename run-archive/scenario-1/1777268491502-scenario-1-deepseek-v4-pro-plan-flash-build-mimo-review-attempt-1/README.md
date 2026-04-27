# TableMate — Restaurant Booking System

A restaurant booking system with a .NET 10 Web API backend and a React SPA frontend with typed OpenAPI client generation.

## Quick Start

### Prerequisites

- .NET 10 SDK
- Node.js 20+
- npm

### Backend

```bash
cd backend
dotnet build
dotnet test
dotnet run --project src/RestaurantBooking --urls "http://localhost:5000"
```

OpenAPI document: http://localhost:5000/openapi/v1.json

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run build
npm run dev
```

Open http://localhost:5173

### Generate Typed API Client

```bash
# Start the backend first, then:
cd frontend
bash scripts/generate-api.sh
```

This generates the Orval TanStack Query hooks at `frontend/src/api/booking-api.ts`.

## Quality Checks

### Backend

```bash
cd backend
dotnet build                         # Build (warnings as errors)
dotnet test --no-build               # Run all tests
dotnet format --verify-no-changes    # Formatting verification
```

### Frontend

```bash
cd frontend
npm run build          # TypeScript compile + Vite build
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint
npm run format:check   # Prettier formatting check
npm run deadcode       # Knip dead code detection
```

## Architecture

### Backend (Vertical Slices)

```
src/RestaurantBooking/
├── Domain/           # Pure domain: entities, validation, conflict detection, availability
├── Features/         # Endpoint handlers (thin I/O shells calling domain functions)
│   ├── Restaurants/  # GET /api/restaurants
│   ├── Bookings/     # POST /api/bookings, GET /api/bookings
│   └── Availability/ # GET /api/restaurants/{id}/availability
├── Infrastructure/   # In-memory stores (ConcurrentDictionary)
└── Program.cs        # Composition root
```

- Pure domain functions in `Domain/` (no I/O, no dependencies) with Result-style error types.
- Endpoint handlers in `Features/` follow gather-call domain-persist pattern.
- In-memory persistence via ConcurrentDictionary with 3 seeded restaurants.

### Frontend

```
frontend/
├── src/
│   ├── api/booking-api.ts    # Orval-generated typed TanStack Query hooks
│   ├── lib/api-client.ts     # Axios instance for Orval mutator
│   ├── components/
│   │   ├── ui/               # shadcn-style primitives
│   │   ├── RestaurantList.tsx
│   │   ├── BookingForm.tsx
│   │   ├── BookingConfirmation.tsx
│   │   └── BookingList.tsx
│   └── App.tsx + main.tsx    # React Router + TanStack Query setup
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/restaurants | List all restaurants |
| POST | /api/bookings | Create a booking |
| GET | /api/bookings | List all bookings |
| GET | /api/bookings/by-restaurant/{id} | List bookings by restaurant |
| GET | /api/restaurants/{id}/availability?date=...&partySize=... | Get available time slots |

## Seed Data

3 restaurants with operating hours 11:00–22:00, 30-minute time slots, 90-minute booking duration:
- Trattoria Milano (Italian, 6 tables)
- Sakura Garden (Japanese, 5 tables)
- Le Bistro Parisien (French, 4 tables)

## Validation

- Party size: 1–20 guests
- Booking time: 11:00–21:00, 30-minute increments
- Date/time must not be in the past
- Table capacity must meet or exceed party size
- No overlapping bookings for the same table and time
