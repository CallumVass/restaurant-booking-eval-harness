# Restaurant Booking System

A full-stack restaurant booking application with a .NET 10 Web API backend and a React SPA frontend.

## Prerequisites

- .NET 10 SDK
- Node.js 22+

## Project Structure

```
backend/                  # .NET 10 Web API
  Domain/                 # Pure domain: entities, value objects, booking service
  Data/                   # In-memory store with seeded restaurants
  Api/                    # Minimal API endpoints (thin imperative shell)
  backend.Tests/          # xUnit tests (unit + integration)

frontend/                 # React SPA (Vite + TypeScript)
  src/
    api/                  # Orval-generated typed API client + TanStack Query hooks
    components/           # React components (shadcn/ui + Tailwind CSS)
    lib/                  # Utility functions
```

## Running the Backend

```bash
cd backend
dotnet run
```

The API listens on `http://localhost:5000`. Swagger UI is available at `http://localhost:5000/swagger`.

### Backend API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant details |
| GET | `/api/restaurants/{id}/slots?date=X&partySize=Y` | Get available time slots |
| GET | `/api/bookings?date=X` | List bookings (optional date filter) |
| GET | `/api/bookings/{id}` | Get a booking |
| POST | `/api/bookings` | Create a booking |

### Backend Scripts

```bash
cd backend
dotnet build -warnaserror   # Build with warnings as errors
dotnet test                  # Run tests
dotnet format --verify-no-changes  # Check formatting
```

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

### Frontend Scripts

```bash
cd frontend
npm run codegen       # Regenerate API client from OpenAPI spec
npm run build         # codegen + TypeScript build + Vite build
npm run typecheck     # TypeScript type checking
npm run lint          # ESLint
npm run format:check  # Prettier formatting check
npm run deadcode      # Knip dead code analysis
```

## Architecture

### Backend

- **Clean Architecture** with lightweight boundaries: Domain (pure logic) → API (thin handlers) → Data (in-memory store)
- **Pure domain functions**: `BookingService.FindAvailableSlots` and `BookingService.TryBook` are stateless functions that operate on passed-in state
- **Result pattern**: Business validation returns `Result<T>` with explicit error codes instead of exceptions
- **In-memory persistence**: 3 seeded restaurants with 5-6 tables each
- **Booking rules**: Party size 1-20, operating hours 10:00-22:00, 30-min slot granularity, 90-min booking duration, overlap prevention

### Frontend

- **React SPA** with TanStack Query for server state management
- **Orval-generated typed client** from OpenAPI spec (`src/api/`) - no hand-written fetch wrappers
- **shadcn/ui** components with Tailwind CSS v4
- **State-based view switching**: Restaurant list → Booking form → Confirmation → Bookings table
- **Vite proxy** for backend API during development
