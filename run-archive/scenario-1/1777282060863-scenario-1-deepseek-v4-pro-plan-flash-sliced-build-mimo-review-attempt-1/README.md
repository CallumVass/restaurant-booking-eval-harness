# Restaurant Booking System

A restaurant booking system with a .NET 10 Web API backend and a React SPA frontend.

## Quick Start

### Prerequisites

- .NET 10 SDK
- Node.js 22+
- npm

### Backend

```bash
cd backend
dotnet run
```

The API starts at `http://localhost:5000` with OpenAPI spec at `http://localhost:5000/openapi/v1.json`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The SPA starts at `http://localhost:5173` and proxies API requests to the backend.

## Verification Scripts

### Backend

```bash
cd backend
dotnet build          # Build with warnings as errors
dotnet test           # Run 35+ tests (unit + integration)
dotnet format --verify-no-changes  # Check formatting
```

### Frontend

```bash
cd frontend
npm run build         # Type-check + production build
npm run typecheck     # TypeScript type-check only
npm run lint          # ESLint
npm run format:check  # Prettier formatting check
npm run deadcode      # Knip dead code analysis
npm run generate-api  # Regenerate typed API client from backend OpenAPI spec
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/restaurants` | List all restaurants |
| GET | `/restaurants/{id}/slots?date=&partySize=` | Get available time slots |
| POST | `/bookings` | Create a new booking |
| GET | `/bookings` | List all bookings |

## Architecture

- **Functional Core, Imperative Shell**: Pure domain logic in `Domain/SlotCalculator.cs`, I/O in endpoints and `InMemoryStore`.
- **Result Types**: Domain operations return `Result<Booking, BookingError>` for explicit error handling.
- **Typed API Client**: The frontend uses an Orval-generated typed client from the OpenAPI spec — no hand-written fetch wrappers.
- **In-Memory Store**: Pre-seeded with 3 restaurants (Italian, Japanese, Mexican) with 3–4 tables each.
