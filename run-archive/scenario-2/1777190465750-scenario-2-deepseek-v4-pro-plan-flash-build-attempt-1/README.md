# Restaurant Booking System

Small full-stack restaurant booking system.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client (TanStack Query hooks + typed fetch) from `frontend/openapi/restaurant-booking.json`.
- Auth: ASP.NET Core Identity with HTTP-only cookies and CSRF protection.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Run

Start the backend:

```bash
dotnet run --project backend/RestaurantBooking.Api --urls http://localhost:5177
```

Start the frontend:

```bash
cd frontend
npm install
npm run generate:api
npm run dev
```

Open the Vite URL shown in the terminal (typically `http://localhost:5173`). The dev server proxies `/api` to `http://localhost:5177`.

### Seeded Demo User

A demo user is created automatically on first run:

- Email: `demo@example.com`
- Password: `Demo123!`

## Authentication

This app uses **HTTP-only cookie authentication** with ASP.NET Core Identity (local email/password).

- A user must be authenticated to create bookings.
- A user can view their own booking history (`/api/bookings/mine`).
- Users cannot view another user's booking history.
- Passwords require at least 6 characters with at least one digit.

### CSRF Protection

State-changing requests (login, register, logout, create booking) require a CSRF token:

1. The SPA fetches a CSRF token via `GET /api/auth/antiforgery/token` on startup.
2. The token is sent as the `X-CSRF-TOKEN` header on mutation requests.
3. The antiforgery cookie is automatically included by the browser (HTTP-only, SameSite=Lax).

When running locally (HTTP), the cookie `Secure` policy is `SameAsRequest` so it works without HTTPS. In production, HTTPS should be enabled.

### Auth Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | Yes | Sign out |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/auth/antiforgery/token` | No | Get CSRF token |

### Protected Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/bookings/mine` | Yes | User's booking history |

Public endpoints (`GET /api/restaurants`, `GET /api/bookings`, `GET /api/restaurants/{id}/availability`) remain open.

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
npm test
```

## Behavior Covered

- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
- Auth integration tests cover registration, login, logout, session-based booking creation, user-scoped booking history, history isolation (User A cannot see User B's bookings), CSRF (antiforgery token endpoint returns a token), and OpenAPI document completeness.
- Frontend tests cover the auth form (login/register toggle) and app layout for authenticated users.
