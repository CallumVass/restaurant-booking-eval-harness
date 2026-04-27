# Restaurant Booking System

A full-stack restaurant booking system with a .NET 10 Web API backend and a React SPA frontend.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 20+](https://nodejs.org/)

## Project Structure

```
backend/       — .NET 10 Web API (domain models, pure-function booking service, minimal API endpoints)
frontend/      — React SPA with Tailwind CSS, shadcn/ui, TanStack Query, Orval-generated typed client
```

## Setup & Run

### Backend

```bash
cd backend
dotnet run
```

Serves on `http://localhost:5000`. Swagger UI at `http://localhost:5000/swagger`. OpenAPI spec at `http://localhost:5000/swagger/v1/swagger.json`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Serves on `http://localhost:5173`. The dev server proxies `/api` requests to the backend at `http://localhost:5000`.

The API client is generated from the backend's OpenAPI spec. Run `npm run gen:api` to regenerate after backend changes.

## Frontend Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Regenerate API client from spec, then type-check and build for production |
| `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Run ESLint (zero warnings policy) |
| `npm run format:check` | Check Prettier formatting |
| `npm run deadcode` | Check for unused files, exports, and dependencies (informational) |

## Backend Scripts

```bash
cd backend
dotnet build          # Build with warnings as errors
dotnet test           # Run xUnit tests
dotnet format --verify-no-changes   # Check formatting
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |
| GET | `/api/restaurants/{id}/tables` | List tables for a restaurant |
| GET | `/api/restaurants/{id}/slots?date=&partySize=` | Get available time slots |
| GET | `/api/restaurants/{id}/bookings?date=` | List bookings for a date |
| POST | `/api/restaurants/{id}/bookings` | Create a booking |

## Notes

- Uses in-memory persistence (data resets on restart)
- Orval-generated exports and shadcn/ui component variants may appear as false positives in dead code analysis
