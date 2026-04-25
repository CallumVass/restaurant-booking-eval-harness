# Restaurant Booking System

A restaurant booking system with a .NET 10 Web API backend and React SPA frontend.

## Prerequisites

- .NET 10 SDK
- Node.js 18+
- npm

## Backend

### Run the API

```bash
cd backend/RestaurantBooking
dotnet run
```

The API starts at `http://localhost:5000`.

### Run Tests

```bash
cd backend
dotnet test
```

### Quality Checks

```bash
cd backend
dotnet build -p:TreatWarningsAsErrors=true
dotnet test --no-build
dotnet format --verify-no-changes
```

## Frontend

### Install Dependencies

```bash
cd frontend
npm install
```

### Run Development Server

```bash
cd frontend
npm run dev
```

The frontend starts at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:5000`.

### Quality Checks

```bash
cd frontend
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/restaurants` | List all restaurants with tables |
| GET | `/api/restaurants/{id}/slot?date=YYYY-MM-DD&partySize=N` | Get available time slots |
| POST | `/api/restaurants/{id}/bookings` | Create a booking |
| GET | `/api/restaurants/{id}/bookings` | List bookings for a restaurant |

### Create Booking Request Body

```json
{
  "tableId": "t1",
  "customerName": "Alice",
  "date": "2025-01-15",
  "time": "17:00",
  "partySize": 2
}
```

## Architecture

- **Backend**: .NET 10 minimal API with pure domain functions and thin imperative shells
- **Frontend**: React + TypeScript + Vite SPA
- **Error handling**: Explicit `Result<T, BookingError>` for business failures, no exceptions
- **Persistence**: In-memory (seeded data resets on restart)
- **Business hours**: 17:00-22:00, slots in 1-hour intervals