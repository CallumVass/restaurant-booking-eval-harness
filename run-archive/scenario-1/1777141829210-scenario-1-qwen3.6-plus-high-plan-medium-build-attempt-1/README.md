# Restaurant Booking System

A full-stack restaurant booking system with a .NET 10 Web API backend and a React SPA frontend.

## Architecture

- **Backend**: .NET 10 Minimal APIs with pure domain functions (FCIS pattern), Result-style errors, and in-memory persistence
- **Frontend**: React + TypeScript SPA with Tailwind CSS, shadcn/ui, TanStack Query, and Orval-generated typed API client
- **API Client**: Generated from OpenAPI spec using Orval — no hand-written fetch wrappers

## Prerequisites

- .NET 10 SDK
- Node.js 18+ with npm

## Quick Start

### Backend

```bash
# Build
dotnet build

# Run tests
dotnet test

# Verify formatting
dotnet format --verify-no-changes

# Run the API (default: http://localhost:5053)
dotnet run --project backend/src/Api

# Open Scalar API docs
# http://localhost:5053/scalar
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Generate typed API client from OpenAPI spec
# (requires backend running to fetch spec, or use existing openapi/openapi.json)
npm run generate:api

# Development server
npm run dev

# Quality checks
npm run build          # TypeScript + Vite build
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint
npm run format:check   # Prettier formatting check
npm run deadcode       # Knip dead code detection
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/restaurants` | List all restaurants |
| `GET` | `/api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N` | Get available time slots |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings` | List all bookings |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── Domain/           # Pure domain models, errors, and booking logic
│   │   │   ├── Models/       # Restaurant, Table, Booking records
│   │   │   ├── Errors/       # Result type and BookingError discriminated union
│   │   │   ├── Services/     # Pure booking domain functions (FCIS)
│   │   │   └── Store/        # IBookingStore interface
│   │   └── Api/              # Thin imperative shell — endpoints, DI, seeding
│   │       ├── Endpoints/    # Minimal API endpoint registrations
│   │       ├── Infrastructure/ # In-memory store implementation
│   │       └── Program.cs
│   └── tests/
│       └── BookingServiceTests.cs  # 20 boundary tests
├── frontend/
│   ├── src/
│   │   ├── api/              # Orval-generated typed client + custom fetch
│   │   ├── components/ui/    # shadcn/ui components
│   │   ├── features/         # Feature slices
│   │   │   ├── RestaurantList/
│   │   │   ├── BookingForm/
│   │   │   ├── BookingConfirmation/
│   │   │   └── BookingList/
│   │   └── App.tsx
│   └── openapi/              # OpenAPI spec for client generation
└── README.md
```

## Design Decisions

- **In-memory persistence**: Used `ConcurrentDictionary` for fast, setup-free operation suitable for an eval
- **Pure domain functions**: `BookingService.BookRestaurant` and `GetAvailableSlots` are pure functions that take a store interface and return `Result<T, BookingError>` — easily testable without mocks
- **Result-style errors**: Expected business failures (invalid party size, conflicts, etc.) are returned as typed errors, not exceptions
- **Orval-generated client**: The frontend uses a fully typed API client generated from the backend's OpenAPI spec, eliminating stringly-typed fetch wrappers
- **TanStack Query**: All API state managed through generated `useQuery` and `useMutation` hooks with automatic caching and invalidation
