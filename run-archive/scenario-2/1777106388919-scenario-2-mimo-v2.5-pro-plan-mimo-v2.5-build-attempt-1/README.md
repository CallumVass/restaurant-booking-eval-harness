# Restaurant Booking System

A full-stack restaurant booking application with a .NET 10 Web API backend and a React SPA frontend.

## Architecture

```
backend/   — .NET 10 Minimal API with in-memory persistence
frontend/  — React 19 + Vite + Tailwind CSS + shadcn/ui + TanStack Query
```

### Backend

- **Clean Architecture** with pure domain functions in `Domain/BookingService.cs`
- **Result-style errors** for expected business failures (no exceptions for flow control)
- **In-memory persistence** seeded with 3 restaurants and multiple tables
- **OpenAPI/Swagger** enabled for client generation

### Frontend

- **React 19** with TypeScript and Vite
- **Tailwind CSS v4** with shadcn/ui components
- **TanStack Query** for API state management
- **Orval-generated typed client** from backend OpenAPI spec
- **React Router** for navigation

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List all restaurants with tables |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |
| GET | `/api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N` | Available time slots |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings?restaurantId=` | List bookings |

## Running the Application

### Prerequisites

- .NET 10 SDK
- Node.js 18+ (tested with v25)

### Backend

```bash
cd backend
dotnet restore
dotnet run --urls http://localhost:5100
```

The API will be available at `http://localhost:5100`. Swagger UI at `http://localhost:5100/swagger` (Development environment).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Full Build & Verification

**Backend:**
```bash
cd backend
dotnet build                    # Build with warnings-as-errors
dotnet test --no-build          # Run all 14 boundary tests
dotnet format RestaurantBooking.sln --verify-no-changes  # Format check
```

**Frontend:**
```bash
cd frontend
npm install
npm run build                   # Orval generate + TypeScript + Vite build
npm run typecheck               # TypeScript type checking
npm run lint                    # ESLint
npm run format:check            # Prettier format check
npm run deadcode                # Knip dead code detection
```

## Boundary Tests

The test suite includes 14 boundary tests covering:

- **Invalid party size** (0, negative, >20)
- **Unknown restaurant**
- **Past date booking**
- **Invalid time slot**
- **Overlapping reservations** (all tables occupied)
- **Smaller table fallback** (when larger table is occupied)
- **Slot availability** with overlapping bookings
- **Empty slot results** for invalid inputs

## Engineering Decisions

- **In-memory persistence** for simplicity in a 30-60 minute eval scope
- **Pure domain functions** in `BookingService` with no I/O dependencies
- **Orval** for type-safe client generation from OpenAPI spec
- **shadcn/ui v4** with base-ui primitives (uses `render` prop instead of `asChild`)
- **Knip** for dead code detection, excluding generated API files and UI component utilities
