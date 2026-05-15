# Restaurant Booking System

Small full-stack restaurant booking system with authenticated booking accounts.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence (EF Core InMemory), ASP.NET Core Identity with cookie auth, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS v4, shadcn/ui-style source components, TanStack Query (generated via Orval).
- API client: Orval-generated TanStack Query hooks + typed fetch client from `frontend/openapi/restaurant-booking.json`.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Authentication

- **Local email/password** via ASP.NET Core Identity (EF Core InMemory store).
- **HTTP-only cookies** for authentication — no tokens in localStorage/sessionStorage.
- **CSRF protection** via ASP.NET Core Antiforgery: the SPA fetches a token from `GET /api/csrf-token` on load and sends it as the `X-XSRF-TOKEN` header on all state-changing requests.
- **CORS** is configured for `http://localhost:5173` and `http://localhost:4173` with credentials support.
- **Demo user** is seeded on first run:
  - Email: `demo@example.com`
  - Password: `demo1234`

## Auth Endpoints

| Method | Path | Auth | CSRF | Description |
|--------|------|------|------|-------------|
| POST | `/api/auth/register` | No | No | Create account |
| POST | `/api/auth/login` | No | Yes | Sign in |
| POST | `/api/auth/logout` | Yes | Yes | Sign out |
| GET | `/api/auth/me` | Yes | No | Current user info |
| GET | `/api/csrf-token` | No | No | Get CSRF token |

## Protected Endpoints

| Method | Path | Auth | CSRF | Description |
|--------|------|------|------|-------------|
| POST | `/api/bookings` | Yes | Yes | Create a booking (associated with authenticated user) |
| GET | `/api/my-bookings` | Yes | No | List current user's bookings |

## Run

### Backend

```bash
dotnet run --project backend/RestaurantBooking.Api --urls http://localhost:5177
```

The first run seeds the demo user (`demo@example.com` / `demo1234`) automatically.

### Frontend

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

### Existing (preserved)
- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.

### Authentication (new)
- **Registration**: email + password + optional name (no CSRF required).
- **Login/Logout**: cookie-based sessions with CSRF protection.
- **Booking creation**: requires authenticated user; booking is associated with the user.
- **Booking history**: `GET /api/my-bookings` returns only the authenticated user's bookings.
- **User isolation**: users cannot view another user's booking history.
- **CSRF**: all state-changing endpoints (login, logout, create booking) require a valid `X-XSRF-TOKEN` header obtained from `GET /api/csrf-token`.
- **Demo user**: pre-seeded for local development and automated verification.

### HTTP Integration Tests (new)
- Auth flow: register, login, logout, get current user.
- Unauthenticated access: booking creation (401), my-bookings (401).
- CSRF validation: missing token returns 400.
- User booking isolation: separate users cannot see each other's bookings.
- Overlapping reservation detection via HTTP returns 409.
- Error mapping on endpoints returns appropriate HTTP status codes.
