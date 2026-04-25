# Restaurant Booking System

A full-stack restaurant booking system with a .NET 10 backend and React frontend.

## Architecture

### Backend
- **Framework**: .NET 10 Web API
- **Pattern**: Functional Core / Imperative Shell (FCIS)
- **Persistence**: In-memory (ConcurrentDictionary)
- **Testing**: xUnit with boundary tests

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query
- **Routing**: React Router v7

## Prerequisites

- .NET 10 SDK
- Node.js 20+ and npm

## Backend

### Run

```bash
cd backend
dotnet restore
dotnet build
dotnet run --project src/WebApi
```

The API will be available at `http://localhost:5000` with Swagger UI at `/swagger`.

### Test

```bash
cd backend
dotnet test
```

### Format

```bash
cd backend
dotnet format --verify-no-changes
```

## Frontend

### Install

```bash
cd frontend
npm install
```

### Run

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` with API proxy to the backend.

### Build

```bash
cd frontend
npm run build
```

### Quality Scripts

```bash
cd frontend
npm run typecheck      # TypeScript type checking
npm run lint           # ESLint
npm run format:check   # Prettier
npm run deadcode       # Dead code detection
```

## API Endpoints

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `GET /api/restaurants/{id}/available-slots?date=...&partySize=...` - Get available time slots

### Bookings
- `POST /api/restaurants/{id}/bookings` - Create a new booking
- `GET /api/restaurants/{id}/bookings` - List bookings for a restaurant

## Design Decisions

1. **In-memory persistence** - Simple and fast for demo purposes
2. **FCIS pattern** - Domain functions are pure, shells handle I/O
3. **Result pattern** - Explicit error returns for business failures
4. **No comments** - Code is self-documenting

## Booking Rules

- Service hours: 11:00 AM - 10:00 PM
- Slot duration: 60 minutes
- Party size must be between 1 and restaurant's max capacity
- Bookings cannot be in the past
- Conflict detection prevents double-booking the same table
