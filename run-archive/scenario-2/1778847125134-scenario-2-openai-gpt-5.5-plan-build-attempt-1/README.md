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

- Demo users are seeded in memory: `demo@example.com` / `Password123!` and `riley@example.com` / `Password123!`.
- New accounts can be registered from the SPA; users are stored in memory for the backend process lifetime.
- Auth uses the HTTP-only `RestaurantBooking.Auth` cookie. The frontend does not store auth tokens in localStorage or sessionStorage.
- State-changing requests use ASP.NET Core antiforgery. The SPA fetches `/api/auth/csrf` and sends `X-CSRF-TOKEN` for login, registration, logout, and booking creation.
- CORS is intentionally limited to local Vite origins (`http://localhost:5173`, `https://localhost:5173`) with credentials enabled.

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
npm run test
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Behavior Covered

- Restaurant list and availability lookup remain public.
- Booking creation requires an authenticated user and valid CSRF token.
- Booking history endpoints return only the current user's reservations, including per-restaurant history.
- Conflict prevention rechecks table availability inside the in-memory store when a booking is created.
- Backend tests cover auth boundaries, invalid login, CSRF, user-scoped booking history, invalid party size, invalid dates/times, unknown restaurants, overlapping reservations, atomic conflict prevention, HTTP endpoint behavior, OpenAPI availability, and error mapping.
- Frontend tests cover auth path display, login submission, booking creation, booking confirmation/history display, and API error display.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
