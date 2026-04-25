# Restaurant Booking System

A full-stack restaurant booking application with a .NET 10 backend and a React SPA frontend.

## Architecture

- **Backend**: .NET 10 Minimal APIs with in-memory persistence, vertical slice features, pure domain validation, and explicit Result-style errors.
- **Frontend**: Vite + React + TypeScript, Tailwind CSS, TanStack Query, and an Orval-generated typed API client from the backend OpenAPI spec.

## Prerequisites

- .NET 10 SDK
- Node.js (v20+)
- npm

## Getting Started

### Backend

```bash
cd backend
dotnet build -p:TreatWarningsAsErrors=true
dotnet test --no-build
dotnet run --project src/Api/RestaurantBooking.Api.csproj
```

The API will start on `http://localhost:5000` with Swagger UI at `/swagger`.

### Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

The SPA will start on `http://localhost:5173` and proxy API requests to the backend.

## Scripts

### Backend
| Command | Description |
|---------|-------------|
| `dotnet build -p:TreatWarningsAsErrors=true` | Build with warnings as errors |
| `dotnet test --no-build` | Run tests without rebuilding |
| `dotnet format --verify-no-changes` | Verify formatting |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier format check |
| `npm run deadcode` | Dead code detection (knip) |
| `npm run generate-api` | Regenerate typed API client from OpenAPI |

## Regenerating the Typed API Client

1. Ensure the backend is running:
   ```bash
   cd backend
   dotnet run --project src/Api/RestaurantBooking.Api.csproj
   ```

2. In another terminal, export the OpenAPI spec and regenerate:
   ```bash
   cd frontend
   curl -s http://localhost:5000/swagger/v1/swagger.json > openapi.json
   npm run generate-api
   ```

## Features

- Browse seeded restaurants with table details
- Select date, party size, and available time slot
- Create bookings with conflict prevention
- View booking confirmation with full details
- List all existing bookings in a responsive table

## Tests

Backend boundary tests cover:
- Invalid party size (zero, negative, exceeding capacity)
- Invalid date/time (past dates, outside hours, not on the hour)
- Unknown restaurants
- Overlapping reservations
- Slot availability logic
