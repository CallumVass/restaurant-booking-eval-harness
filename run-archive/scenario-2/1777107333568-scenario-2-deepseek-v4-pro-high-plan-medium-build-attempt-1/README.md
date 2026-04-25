# Restaurant Booking System

A full-stack restaurant booking application with a .NET 10 Web API backend and a React SPA frontend.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) (tested with 10.0.107)
- [Node.js](https://nodejs.org/) 22+ (tested with v25)

## Quick Start

### 1. Backend

```bash
cd backend/RestaurantBooking.Api
dotnet run
```

The API starts on `http://localhost:5197`.
OpenAPI spec available at `http://localhost:5197/openapi/v1.json`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # Development server (proxies to backend)
# or
npm run build     # Production build
```

Frontend dev server runs on `http://localhost:5173` and proxies API requests to the backend.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List all restaurants with table capacities |
| POST | `/api/bookings` | Create a new booking (with conflict prevention) |
| GET | `/api/bookings?restaurantId=&date=` | List bookings filtered by restaurant and/or date |
| GET | `/api/timeslots?restaurantId=&date=&partySize=` | Get available 90-minute time slots |

## Backend Architecture

- **Domain Layer** (`Domain/`): Pure functions for booking logic — `TryBook()` and `GetAvailableTimeSlots()`. Uses `Result<T>` for expected failures.
- **Infrastructure** (`Infrastructure/`): `InMemoryStore` with `ConcurrentDictionary` for persistence. Seeded with 3 restaurants.
- **Features** (`Features/`): Minimal API endpoint definitions, thin shells that call domain functions.
- **Operating Hours**: 11:00—22:00. Booking duration: 90 minutes.

## Frontend Architecture

- **React 19** with **Vite**, **Tailwind CSS v4**, and **shadcn/ui** components.
- **TanStack Query v5** for server state and mutations.
- **Orval** generates fully-typed API client from the backend OpenAPI spec.
- **React Router** for client-side routing.
- **react-hook-form** for form validation.

## Scripts

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Generate API client + typecheck + build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier format check |
| `npm run deadcode` | Knip dead code detection |
| `npm run generate-client` | Generate API client from OpenAPI spec |

### Backend

```bash
dotnet build -warnaserror   # Build with warnings as errors
dotnet test                  # Run all tests
dotnet format --verify-no-changes  # Check code formatting
```

## Tests

25 tests total — 17 domain unit tests + 8 API integration tests.

### Domain Tests (pure, no infrastructure)
- Valid bookings succeed
- Party size validation (zero, negative, exceeding capacity)
- Date/time validation (past dates, outside operating hours, ending past closing)
- Conflict detection (overlapping, non-overlapping, different table, different date)
- Time slot calculation and fully-booked filtering

### API Integration Tests
- Valid POST returns 201
- Invalid party size returns 400
- Overlapping reservation returns 409
- Unknown restaurant returns 400
- Past date returns 400
- Timeslots and bookings listing

## Seeded Data

3 restaurants with mixed table capacities:

| Restaurant | Tables (capacity) |
|------------|-------------------|
| Bella Napoli | 2, 4, 6, 8 |
| Sakura Garden | 2, 2, 4, 6 |
| The Steakhouse | 2, 4, 4, 8, 8 |
