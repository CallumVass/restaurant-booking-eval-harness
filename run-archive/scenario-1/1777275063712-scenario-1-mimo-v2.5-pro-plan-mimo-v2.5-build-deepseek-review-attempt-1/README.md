# Restaurant Booking System

A full-stack restaurant booking system with a .NET 10 backend and React frontend.

## Architecture

- **Backend**: .NET 10 Web API with minimal APIs, in-memory persistence, OpenAPI/Swagger
- **Frontend**: React SPA with Vite, Tailwind CSS, shadcn/ui, TanStack Query, Orval-generated typed client
- **Pattern**: Functional Core / Imperative Shell — pure domain functions for booking logic

## Backend

### Running

```bash
cd backend
dotnet run --project src/RestaurantBooking.Api
```

The API will be available at `http://localhost:5000` with OpenAPI docs at `/openapi/v1.json`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant details |
| GET | `/api/restaurants/{id}/availability?date=YYYY-MM-DD&partySize=N` | Get available time slots |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings?restaurantId={id}` | List bookings for a restaurant |
| GET | `/api/bookings/{id}` | Get booking details |

### Testing

```bash
cd backend
dotnet test
```

### Build

```bash
cd backend
dotnet build
```

## Frontend

### Setup

```bash
cd frontend
npm install
```

### Running

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` with API proxy to the backend.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint linting |
| `npm run format:check` | Prettier format check |
| `npm run format` | Prettier format write |
| `npm run deadcode` | Knip dead code detection |
| `npm run generate-api` | Regenerate typed API client from OpenAPI spec |

### Typed API Client

The frontend uses Orval to generate a fully typed API client from the backend OpenAPI spec. To regenerate:

1. Start the backend: `cd backend && dotnet run --project src/RestaurantBooking.Api`
2. Generate the spec: `curl http://localhost:5000/openapi/v1.json > frontend/openapi.json`
3. Generate the client: `cd frontend && npm run generate-api`

## Design Decisions

- **In-memory persistence**: No database setup required, sufficient for the eval scope
- **Result pattern**: Explicit error handling for business failures (invalid party size, overlapping reservations, etc.)
- **Orval-generated client**: Fully typed API hooks auto-generated from OpenAPI spec
- **shadcn/ui**: Polished, accessible UI components
- **TanStack Query**: Server state management with caching and invalidation
