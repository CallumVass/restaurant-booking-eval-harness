# Restaurant Booking Eval

Small full-stack restaurant booking system for Scenario 1.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json`.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Run

```bash
dotnet run --project backend/RestaurantBooking.Api --urls http://localhost:5177
```

```bash
cd frontend
npm install
npm run generate:api
npm run dev
```

Open the Vite URL shown in the terminal. The dev server proxies `/api` to `http://localhost:5177`.

## Backend Checks

```bash
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes
```

## Frontend Checks

```bash
cd frontend
npm install
npm run generate:api
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Behavior Covered

- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
