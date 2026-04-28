# Restaurant Booking System

Small full-stack restaurant booking system.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, cookie auth, CSRF protection, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client and TanStack Query hooks from `frontend/openapi/restaurant-booking.json`.

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

## Local Auth

The API uses local email/password accounts with HTTP-only cookie authentication. The in-memory auth store seeds one demo user every time the backend starts:

- Email: `demo@restaurant.test`
- Password: `DinnerTable42!`

Newly registered users are stored in memory only. Restarting the backend resets users and bookings.

State-changing requests use ASP.NET Core antiforgery protection. The SPA calls `GET /api/auth/csrf` and sends the returned token in the `X-CSRF-TOKEN` header for login, registration, logout, and booking creation. Auth state is kept in HTTP-only cookies; the frontend does not store auth tokens in `localStorage` or `sessionStorage`.

Local CORS is intentionally credentialed for `http://localhost:5173` and `http://127.0.0.1:5173`. In normal Vite development, the `/api` proxy keeps requests same-origin from the browser's perspective.

## API Client

The checked-in OpenAPI document under `frontend/openapi/restaurant-booking.json` is the deterministic source for frontend client generation. Run this after API shape changes:

```bash
cd frontend
npm run generate:api
```

Orval emits generated typed operations and TanStack Query hooks into `frontend/src/generated/booking-client.ts`. The shared mutator in `frontend/src/lib/api-fetcher.ts` sends `credentials: "include"` and attaches CSRF headers to state-changing requests.

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
npm run test
```

## Behavior Covered

- Restaurant list, authenticated current-user booking history, availability lookup, and create booking endpoints.
- Local login, registration, logout, current-user lookup, HTTP-only cookie auth, and CSRF-protected mutations.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Backend HTTP tests cover OpenAPI availability, auth boundaries, invalid auth attempts, current-user booking history isolation, invalid party size, invalid dates, invalid times, unknown restaurants, overlapping reservations, and atomic conflict prevention.
- Frontend tests cover login-required booking, registration, logout state, booking confirmation/history display, and booking API error display.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses; protected endpoints return `401` when unauthenticated.
