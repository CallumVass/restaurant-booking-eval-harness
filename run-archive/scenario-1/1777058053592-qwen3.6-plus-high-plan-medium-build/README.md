# Restaurant Booking System

A restaurant booking system with a .NET 10 Web API backend and React SPA frontend.

## Features

- Browse restaurants with table capacity info
- Book a table with conflict prevention (no overlapping reservations on the same table)
- View available 30-minute time slots for a restaurant, date, and party size
- View all existing bookings
- Validation for party size, date/time, operating hours, and unknown restaurants

## Quick Start

### Backend

```bash
cd backend
dotnet run
```

The API runs on `http://localhost:5000` (or the port shown in the console).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE` in `.env` or as an environment variable to point to the backend URL (defaults to `http://localhost:5000`).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/restaurants` | List all restaurants |
| `GET` | `/api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N` | Get available time slots |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings` | List all bookings |

## Quality Gates

### Backend

```bash
cd backend
dotnet build -p:TreatWarningsAsErrors=true
dotnet tests/bin/Debug/net10.0/RestaurantBooking.Tests.dll
dotnet format --verify-no-changes
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Architecture

- **Backend**: .NET 10 Minimal API with vertical slice features, pure domain functions (Functional Core), and thin imperative shells
- **Frontend**: React + TypeScript + Vite with typed API client functions
- **Persistence**: In-memory (seeded with 3 restaurants)
- **Error handling**: Result-style errors for expected business failures (400/404/409)
