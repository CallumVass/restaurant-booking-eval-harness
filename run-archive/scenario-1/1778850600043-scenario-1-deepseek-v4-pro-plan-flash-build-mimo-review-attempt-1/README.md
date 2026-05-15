# Restaurant Booking System

A restaurant table booking system with a .NET 10 Web API backend and React SPA frontend.

## Architecture

### Backend (`backend/`)
- **.NET 10 Web API** with minimal APIs
- **In-memory persistence** (`InMemoryStore`) with seed data (3 restaurants)
- **Result-style domain errors** (`BookingError` discriminated union)
- **OpenAPI v3.1** spec auto-generated at `/openapi/v1.json`
- **xUnit tests** covering domain logic and API endpoints

### Frontend (`frontend/`)
- **React 19 SPA** with Vite
- **Tailwind CSS 4** with shadcn/ui components
- **TanStack Query** for API state management
- **Orval-generated typed client** from backend OpenAPI spec

## Quick Start

### Prerequisites
- .NET 10 SDK
- Node.js 20+

### Backend

```bash
cd backend
dotnet build
dotnet test --no-build
dotnet run --project RestaurantBooking.Api
```

Server starts on `http://localhost:5000`. OpenAPI spec at `http://localhost:5000/openapi/v1.json`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run generate-api   # Regenerate typed client from OpenAPI spec
npm run dev            # Start dev server
```

Open `http://localhost:5173` in a browser.

### Deterministic Checks

```bash
# From repo root:
node .opencode/scripts/deterministic-checks.mjs
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |
| GET | `/api/restaurants/{id}/slots?date=&partySize=` | Get available time slots |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings?email=` | List bookings by email |

## Frontend Pages

1. **Restaurant List** (`/`) - Browse restaurants, pick one to book
2. **Booking Form** (`/book/:restaurantId`) - Select date, party size, time slot, enter details
3. **Booking Confirmation** (`/confirmation`) - Confirmation after successful booking
4. **My Bookings** (`/bookings`) - Look up bookings by email

## Project Structure

```
backend/
├── RestaurantBooking.Api/
│   ├── Program.cs            # Endpoints and configuration
│   ├── Models/               # Domain models (Restaurant, Table, Booking)
│   ├── Domain/               # Domain services and errors
│   ├── Data/                 # In-memory store and seed data
│   └── Dtos/                 # Request/response types
├── RestaurantBooking.Tests/  # xUnit tests (20 tests)
└── RestaurantBooking.slnx

frontend/
├── src/
│   ├── api/generated/        # Orval-generated typed client
│   ├── components/ui/        # shadcn/ui components
│   └── pages/                # Application pages
├── orval.config.ts           # Orval configuration
├── knip.json                 # Dead code analysis config
└── package.json              # Scripts: build, typecheck, lint, format:check, deadcode
```
