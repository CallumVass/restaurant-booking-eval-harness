# Restaurant Booking System

A full-stack restaurant booking system with a .NET 10 Web API backend and a React SPA frontend.

## Prerequisites

- .NET 10 SDK
- Node.js 20+ and npm

## Backend

### Run

```bash
dotnet run --project src/RestaurantBooking.Api
```

The API will start on `http://localhost:5000` with OpenAPI/Swagger UI available at `/swagger`.

### Quality checks

```bash
dotnet build -p:TreatWarningsAsErrors=true
dotnet test --no-build
dotnet format --verify-no-changes
```

## Frontend

### Install dependencies

```bash
cd frontend
npm install
```

### Run dev server

```bash
npm run dev
```

The dev server starts on `http://localhost:5173` and proxies API requests to the backend.

### Quality checks

```bash
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Architecture

- **Domain**: Pure functions for availability logic and validation, explicit `Result<T>` errors.
- **API**: In-memory store, lightweight controllers, CORS-enabled for the SPA.
- **Frontend**: React with TypeScript, state-driven UI, clear API service layer.
