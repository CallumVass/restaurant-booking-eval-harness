# Restaurant Booking System

Small full-stack restaurant booking system with authenticated accounts.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, OpenAPI at `/openapi/v1.json`.
- Auth: ASP.NET Core Identity with HTTP-only cookie authentication and CSRF protection.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client with TanStack Query hooks from `frontend/openapi/restaurant-booking.json`.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Seeded Demo Users

| Email              | Password    |
|--------------------|-------------|
| alice@example.com  | Demo1234!   |
| bob@example.com    | Demo1234!   |

Users are auto-seeded on first run. You can also register new accounts via the UI.

## Authentication

Auth uses **HTTP-only cookies** (not localStorage/sessionStorage). The ASP.NET Core Identity cookie (`.AspNetCore.Identity.Application`) is set on login and sent automatically by the browser on subsequent requests.

### CSRF Protection

State-changing requests (login, register, logout, booking creation) require a CSRF token:

1. The SPA fetches a token from `GET /api/antiforgery/token` on load.
2. The returned token is included as the `X-CSRF-TOKEN` header on mutation requests.
3. The backend validates the token against an HTTP-only antiforgery cookie.

This flow is handled automatically by the `useAuth` hook and generated TanStack Query hooks.

### Auth Endpoints

All endpoints under `/api/auth/` and `/api/antiforgery/token`.

| Method | Path                    | Auth Required | Description                            |
|--------|-------------------------|---------------|----------------------------------------|
| POST   | /api/auth/register      | No (CSRF)     | Register a new account                 |
| POST   | /api/auth/login         | No (CSRF)     | Sign in with email and password        |
| POST   | /api/auth/logout        | No (CSRF)     | Sign out                               |
| GET    | /api/auth/me            | No            | Current user info (or null if anon)    |
| GET    | /api/antiforgery/token  | No            | CSRF request token for the SPA         |

### Booking Endpoints

| Method | Path                                    | Auth Required | Description                         |
|--------|-----------------------------------------|---------------|-------------------------------------|
| GET    | /api/restaurants                        | No (public)   | List all restaurants                |
| GET    | /api/restaurants/{id}/availability      | No (public)   | Available slots for a restaurant    |
| POST   | /api/bookings                           | Yes + CSRF    | Create a booking                    |
| GET    | /api/bookings/mine                      | Yes           | Current user's booking history      |

> Note: The old unauthenticated `GET /api/bookings` (list all bookings) has been replaced by `GET /api/bookings/mine`, which returns only the authenticated user's bookings.

Booking creation requires both authentication (HTTP-only cookie) and a valid CSRF token (`X-CSRF-TOKEN` header). Restaurants and availability are publicly accessible.

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

CORS is configured for `http://localhost:5173` (Vite default) with credentials allowed.

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

- Restaurant list, availability lookup, and booking creation endpoints.
- Authenticated booking creation with HTTP-only cookie auth and CSRF protection.
- User-scoped booking history via `GET /api/bookings/mine` — users can only see their own bookings.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, capacity limits, auth boundaries (401 missing auth, 400 missing CSRF, 400 duplicate email, 401 wrong credentials), and cross-user isolation.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
