# Restaurant Booking System

Small full-stack restaurant booking system with authenticated user accounts.

## Stack

- Backend: .NET 10 minimal Web API, ASP.NET Core Identity (EF Core InMemory), in-memory booking store, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query with Orval-generated typed client and hooks.
- Auth: HTTP-only cookie authentication via ASP.NET Core Identity. CSRF protection via built-in antiforgery with `X-CSRF-TOKEN` header.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json`. TanStack Query hooks also generated from the same spec.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Auth

Authentication uses HTTP-only cookies (no localStorage or sessionStorage tokens). The SPA fetches a CSRF token from `GET /api/antiforgery/token` on load and sends it as `X-CSRF-TOKEN` header on state-changing requests (login, register, logout, create booking).

### Seeded Demo Users

| Email | Password |
|-------|----------|
| `demo@example.com` | `Demo1234!` |
| `guest@example.com` | `Guest1234!` |

### Auth Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/antiforgery/token` | Fetch CSRF token (required before any POST) |
| POST | `/api/auth/register` | Create account (`{ email, password }`) |
| POST | `/api/auth/login` | Sign in (`{ email, password }`) |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Get current user info (401 if unauthenticated) |

### Protected Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/bookings` | Yes | Create booking (requires auth + CSRF token) |
| GET | `/api/bookings/mine` | Yes | Current user's bookings |

Unauthenticated GET endpoints (`/api/restaurants`, `/api/bookings`, `/api/restaurants/{id}/availability`, `/openapi/v1.json`) remain open.

### CSRF Flow

1. SPA loads and calls `GET /api/antiforgery/token` to get a CSRF token and cookie.
2. All POST/PUT/DELETE requests include the token as the `X-CSRF-TOKEN` header.
3. The server validates the header against the antiforgery cookie.
4. After login/logout, the SPA refreshes the CSRF token.

## Run

Start the backend:

```bash
dotnet run --project backend/RestaurantBooking.Api --urls http://localhost:5177
```

In a separate terminal, start the frontend:

```bash
cd frontend
npm install
npm run generate:api
npm run dev
```

Open the Vite URL shown in the terminal (default `http://localhost:5173`). The dev server proxies `/api` to `http://localhost:5177`.

Demo users are seeded automatically on startup.

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

- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
- Auth integration tests cover login, register, logout, session management, user-scoped booking history, unauthorized access, and CSRF validation.
- Frontend UI tests cover auth header rendering and interaction.
- API client generation is reproducible via `npm run generate:api` (runs `orval --config orval.config.ts`).
