# Restaurant Booking System

Small full-stack restaurant booking system.

## Stack

- Backend: .NET 10 minimal Web API, in-memory booking persistence, ASP.NET Core Identity with EF Core InMemory auth, OpenAPI at `/openapi/v1.json`.
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

The API uses first-party ASP.NET Core Identity with HTTP-only application cookies. No external auth provider, OAuth app, hosted database, or secret is required.

Seeded demo user:

- Email: `demo@example.com`
- Password: `Password123!`

Auth endpoints:

- `GET /api/auth/csrf` returns a request token for state-changing requests.
- `GET /api/auth/me` returns the current authenticated user or `401`.
- `POST /api/auth/register` creates a local account and signs it in.
- `POST /api/auth/login` signs in with email/password.
- `POST /api/auth/logout` signs out.

Cookie and CSRF behavior:

- Cookies are HTTP-only and are not stored by the SPA in `localStorage` or `sessionStorage`.
- The SPA sends credentialed requests with `credentials: "include"`.
- Login, registration, logout, and booking creation require the `X-CSRF-TOKEN` header from `/api/auth/csrf`.
- A fresh CSRF token is fetched after login/register/logout because the authenticated identity changes.
- CORS is deliberately limited to `http://localhost:5173` and `http://127.0.0.1:5173` with credentials enabled.

Booking ownership:

- Creating a booking requires authentication.
- Each booking is associated with the authenticated user that created it.
- `GET /api/bookings?restaurantId=...` returns only the current user's booking history, optionally filtered by restaurant.
- Availability still accounts for all bookings so conflicts are prevented across users without exposing other users' history.

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
npm test
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Behavior Covered

- Restaurant list, authenticated user-scoped booking history, availability lookup, auth, CSRF, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Backend boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, capacity limits, HTTP error mapping, OpenAPI availability, auth boundaries, user-scoped history, invalid credentials, CSRF requirements, and atomic conflict prevention.
- Frontend tests cover unauthenticated booking gating, login mutation flow, booking confirmation/history display, and API conflict error display.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
