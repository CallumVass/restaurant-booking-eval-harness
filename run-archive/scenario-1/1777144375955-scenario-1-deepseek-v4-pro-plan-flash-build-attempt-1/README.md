# Restaurant Booking System

A full-stack restaurant booking application with a .NET 10 backend API and a React SPA frontend.

## Prerequisites

- .NET 10 SDK
- Node.js 22+

## Backend

```bash
cd backend
dotnet restore
dotnet build --no-restore
dotnet test --no-build
dotnet run --project src/RestaurantBooking.Api
```

The API runs on `http://localhost:5062`. OpenAPI document available at `http://localhost:5062/openapi/v1.json`.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant details |
| GET | `/api/restaurants/{id}/availability?date=YYYY-MM-DD&partySize=N` | Get available time slots |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings/{id}` | Get booking details |
| POST | `/api/bookings` | Create a booking |

### Domain tests (18 boundary tests)

```bash
cd backend && dotnet test
```

## Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend.

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Generate API client + typecheck + build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier formatting check |
| `npm run deadcode` | knip dead code analysis |
| `npm run generate:api` | Regenerate Orval API client from OpenAPI spec |

### Architecture notes

- **Backend**: Clean Architecture with pure domain functions (validation, conflict detection, availability calculation) and thin imperative shell (API endpoints, in-memory repositories)
- **Frontend**: React + TypeScript SPA with TanStack Query for API state, Tailwind CSS + shadcn/ui for UI, Orval for typed API client generation from OpenAPI spec
- **Error handling**: Explicit `Result<T>` type for expected business failures, mapped to HTTP status codes
