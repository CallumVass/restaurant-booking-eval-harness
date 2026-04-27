# Restaurant Booking System

A full-stack restaurant booking system with .NET 10 backend and React SPA frontend.

## Prerequisites

- .NET 10 SDK
- Node.js 20+

## Project Structure

```
├── src/
│   ├── RestaurantBooking.Domain/   # Pure domain: entities, Result type, booking service
│   ├── RestaurantBooking.Web/      # .NET 10 Minimal API endpoints, Swagger
│   └── tests/
│       └── RestaurantBooking.Tests/ # 24 boundary and unit tests
├── frontend/                       # React SPA (Vite + TypeScript)
│   ├── src/
│   │   ├── api/                    # Typed API client + generated client (Orval)
│   │   ├── components/ui/          # shadcn/ui components
│   │   └── pages/                  # Restaurants, Booking, Confirmation, Bookings
│   └── orval.config.ts             # Orval client generation config
├── RestaurantBooking.slnx          # .NET 10 solution
└── README.md
```

## Quick Start

### Backend

```bash
cd src/RestaurantBooking.Web
dotnet run --urls "http://localhost:5000"
```

The API serves at `http://localhost:5000`. OpenAPI document at `/openapi/v1.json`.

### Frontend

```bash
cd frontend
npm install
npm run dev              # Development server at http://localhost:5173
```

### Generate Typed API Client (Orval)

The frontend includes a hand-written typed client at `src/api/client.ts`.
To regenerate from the OpenAPI spec:

```bash
# Start the backend first, then:
cd frontend
npm run generate-api
```

This fetches the OpenAPI spec and generates client code in `src/api/` using Orval.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |
| GET | `/api/restaurants/{id}/availability?date=...&partySize=...` | Available time slots |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings/{id}` | Get booking by ID |

## Testing

```bash
# Backend (24 tests)
dotnet test RestaurantBooking.slnx

# Frontend checks
cd frontend
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint
npm run format:check   # Prettier format check
npm run deadcode       # Knip unused code check
npm run build          # Production build
```

## Architecture

- **Functional Core, Imperative Shell**: Domain logic (BookingService, conflict detection, availability) is pure — no I/O. Endpoints are thin shells that gather data, call domain functions, and persist results.
- **Result<T,E> Pattern**: Expected business failures (invalid party size, time conflicts) use a discriminated `Result<T, E>` type instead of exceptions.
- **In-Memory Persistence**: Simple concurrent dictionaries for repositories — quick and sufficient for eval.
- **Operating Hours**: 11:00–22:00, 30-minute booking slots, 90-minute default booking duration.

## Design Decisions

- In-memory persistence over database to keep scope realistic for a 30-60 minute eval.
- Lightweight Clean Architecture: Domain project with pure functions, Web project with endpoints.
- Result over exceptions for business logic: party size, time conflicts, validation.
- shadcn/ui base-ui components — no `asChild` prop, using direct Link elements with Tailwind classes instead.
- Orval generates typed React Query hooks from the OpenAPI spec; a hand-written typed client is also provided.
